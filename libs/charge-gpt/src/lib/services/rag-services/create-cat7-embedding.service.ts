import { cat7FewShotExamples } from './cat7-few-shots.model';
import { getEmbedding } from './openai-embedding-client.service';
import {
  createCategorySchema,
  disconnectRagClient,
  getRagClient,
  retrieveEmbedding,
  saveEmbedding,
} from './rag-client.service';

export const createCat7Embeddings = async (): Promise<void> => {
  console.log('Creating Category 7 embeddings...');
  const fewShotRequests = cat7FewShotExamples.map((example) =>
    JSON.stringify(example.user)
  ); 
  const pattern = /User request: (.*?)\\n\s+Your response:/s;
  const requestParts = fewShotRequests.map((request) => {
    const match = request.match(pattern);

    if (match && match[1])
      return (match[1].split('.')).filter((part) => part.length > 0 && part !== ' ');
  });
  const fewShotExamples = cat7FewShotExamples.map((example) =>
    JSON.stringify(example)
  );

  const client = await getRagClient();
  const indexName = await createCategorySchema(
    client,
    'req_ident_cat7_hnsw',
    '0.0.9'
  );

  for (let i = 0; i < fewShotExamples.length; i++) {
    console.log('Creating embedding for example', i);
    for (let j = 0; j < requestParts[i].length; j++) {
      const embedding = await getEmbedding(requestParts[i][j]);

      if (embedding === null) {
        console.error('Error creating embedding for example', i);
        continue;
      }

      await saveEmbedding(client, indexName, i, fewShotExamples[i], requestParts[i][j], embedding, false);
    }
  }
  disconnectRagClient();
  console.log('Category 7 embeddings created.');
};

export const retrieveCat7Embeddings = async (
  userRequest: string,
  overtConversationSummary: string
): Promise<any[]> => {
  const requests = userRequest.split('. ');
  const client = await getRagClient();
  const indexName = await createCategorySchema(
    client,
    'req_ident_cat7_hnsw',
    '0.0.9'
  );
  const userRequestEmbeddings = await Promise.all(requests.map(async (request) => await getEmbedding(request)));

  const storedEmbeddingsResultWithSAM25 = await Promise.all(userRequestEmbeddings.map(async (embedding) => await retrieveEmbedding(
    client,
    indexName,
    4,
    userRequest,
    embedding,
    false
  )));
  const documents = [];
  for (const result of storedEmbeddingsResultWithSAM25) {
    documents.push(...result.documents);
  }
  // if (storedEmbeddingsResultWithSAM25.documents.length < 3) {
  //   const storedEmbeddingsResult = await retrieveEmbedding(
  //     client,
  //     indexName,
  //     4,
  //     userRequest,
  //     userRequestEmbedding,
  //     false
  //   );
  //   return storedEmbeddingsResult.documents;
  // }


  return documents;
};
