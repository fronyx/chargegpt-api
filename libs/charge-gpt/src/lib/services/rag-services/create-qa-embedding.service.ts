import { qaFewShotExamples } from './qa-few-shots.model';
import { getEmbedding } from './openai-embedding-client.service';
import {
  createCategorySchema,
  disconnectRagClient,
  getRagClient,
  retrieveEmbedding,
  saveEmbedding,
} from './rag-client.service';

export const createQAEmbeddings = async (): Promise<void> => {
  console.log('Creating QA embeddings...');
  const fewShotRequests = qaFewShotExamples.map((example) =>
    JSON.stringify(example.user)
  );
  const pattern = /User request that you should help with: \\"(.*?)\\"\\n\s+Your response:/s;

  const requestParts = fewShotRequests.map((request) => {
    const match = request.match(pattern);

    if (match && match[1])
      return (match[1].split('.')).filter((part) => part.length > 0 && part !== ' ');
  });
  const fewShotExamples = qaFewShotExamples.map((example) =>
    JSON.stringify(example)
  );

  const client = await getRagClient();
  const indexName = await createCategorySchema(
    client,
    'req_ident_qa_hnsw',
    '0.0.16'
  );

  for (let i = 0; i < fewShotExamples.length; i++) {
    console.log('Creating embedding for example', i);
    for (let j = 0; j < requestParts[i].length; j++) {
      const embedding = await getEmbedding(requestParts[i][j]);

      if (embedding === null) {
        console.error('Error creating embedding for example', i);
        continue;
      }

      await saveEmbedding(client, indexName, i, fewShotExamples[i], requestParts[i][j], embedding);
    }
  }
  disconnectRagClient();
  console.log('QA embeddings created.');
};

export const retrieveQAEmbeddings = async (
  userRequest: string,
): Promise<any[]> => {
  const requests = userRequest.split('. ');
  const client = await getRagClient();
  const indexName = await createCategorySchema(
    client,
    'req_ident_qa_hnsw',
    '0.0.16'
  );
  const userRequestEmbeddings = await Promise.all(requests.map(async (request) => await getEmbedding(request)));

  const storedEmbeddingsResult = await Promise.all(userRequestEmbeddings.map(async (embedding) => await retrieveEmbedding(
    client,
    indexName,
    4,
    userRequest,
    embedding
  )));
  const documents = [];
  for (const result of storedEmbeddingsResult) {
    documents.push(...result.documents);
  }

  return documents;
};
