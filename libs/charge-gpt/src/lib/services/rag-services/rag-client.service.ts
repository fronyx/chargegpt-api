import { configService } from '@fronyx/configurations';
import { useTryAsync } from 'no-try';
import { createClient, SchemaFieldTypes, VectorAlgorithms } from 'redis';

const client = createClient({
  url: `redis://${configService.getAzureRagRedisHost()}:${configService.getAzureRagRedisPort()}`,
  password: configService.getAzureRagRedisPassword(),
});

export const getRagClient = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
};

export const disconnectRagClient = async () => {
  if (!client.isOpen) {
    return;
  }

  await client.disconnect();
};

interface RedisClient {
  ft: { create: any; search: any };
  hSet: any;
}

export const createCategorySchema = async (
  client: RedisClient,
  categoryName: string,
  version: string
): Promise<string> => {
  const indexName = `${categoryName}_${version}`;

  const [err] = await useTryAsync(() =>
    client.ft.create(
      indexName,
      {
        request: {
          type: SchemaFieldTypes.TEXT,
          WEIGHT: 0.5,
        },
        v: {
          type: SchemaFieldTypes.VECTOR,
          ALGORITHM: VectorAlgorithms.HNSW,
          TYPE: 'FLOAT32',
          DIM: 1536, // fit to the OpenAI embedding
          DISTANCE_METRIC: 'COSINE',
          WEIGHT: 0.5,
        },
      },
      {
        ON: 'HASH',
        PREFIX: indexName,
      }
    )
  );

  if (err instanceof Error && err.message === 'Index already exists') {
    // console.log('Index exists already, skipped creation.');
  } else {
    console.log('create category schema error: ', err);
  }

  return indexName;
};

export const saveEmbedding = async (
  client: RedisClient,
  indexName: string,
  index: number,
  sentence: string,
  request: string,
  embedding: number[],
  useUserRequest = false
) => {
  const hashStruct = useUserRequest
    ? {
        sentence,
        request,
        v: float32Buffer(embedding),
      }
    : {
        sentence,
        v: float32Buffer(embedding),
      };

  return client.hSet(`${indexName}:${index}`, hashStruct);
};

function float32Buffer(arr: number[]) {
  return Buffer.from(new Float32Array(arr).buffer);
}

function noEmbedding() {
  return { documents: [] };
}

export const retrieveEmbedding = async (
  client: RedisClient,
  indexName: string,
  kFactor: number,
  userRequest: string,
  embedding: number[] | null,
  useUserRequest = false,
  retryCount = 0
): Promise<{ documents: unknown[] }> => {
  if (embedding === null) {
    return noEmbedding();
  }

  const query = useUserRequest
    ? `(@request:${userRequest})=>[KNN ${kFactor} @v $BLOB AS distance]`
    : `*=>[KNN ${kFactor} @v $BLOB AS distance]`;

  const ftSearch = () => {
    return new Promise((resolve, reject) => {
      const retrieveTimeout = setTimeout(() => {
        reject(new Error('TIMEOUT: Retrieving embedding from RAG'));
      }, 500);

      client.ft
        .search(indexName, query, {
          PARAMS: {
            BLOB: float32Buffer(embedding),
          },
          SORTBY: 'distance',
          DIALECT: 2,
          RETURN: ['distance', 'sentence'],
        })
        .then((results) => {
          clearTimeout(retrieveTimeout);
          resolve(results);
        });
    });
  };

  const [err, results] = await useTryAsync(() => ftSearch());

  if (err && retryCount < 3) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return retrieveEmbedding(
      client,
      indexName,
      kFactor,
      userRequest,
      embedding,
      useUserRequest,
      retryCount + 1
    );
  }

  if (err) {
    console.error('RAG retrieval error:', JSON.stringify(err, null, 2));
    console.error('Query used:', query);
    return noEmbedding();
  }

  return results as any;
};
