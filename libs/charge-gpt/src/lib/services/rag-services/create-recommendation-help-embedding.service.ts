import { recommendationHelpFewShotExamples } from './recommendation-help-few-shots.model';
import { getEmbedding } from './openai-embedding-client.service';
import {
  createCategorySchema,
  disconnectRagClient,
  getRagClient,
  retrieveEmbedding,
  saveEmbedding,
} from './rag-client.service';

export const createRecommendationHelpEmbeddings = async (): Promise<void> => {
  console.log('Creating recommendation help embeddings...');
  const fewShotRequests = recommendationHelpFewShotExamples.map((example) =>
    JSON.stringify(example.user)
  );
  const pattern = /User request that you should help with: \\"(.*?)\\"\\n\s+Your response:/s;

  const requestParts = fewShotRequests.map((request) => {
    const match = request.match(pattern);

    if (match && match[1])
      return (match[1].split('.')).filter((part) => part.length > 0 && part !== ' ');
  });
  const fewShotExamples = recommendationHelpFewShotExamples.map((example) =>
    JSON.stringify(example)
  );

  const client = await getRagClient();
  const indexName = await createCategorySchema(
    client,
    'recommendation_help_hnsw',
    '0.0.2'
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
  console.log('Recommendation help embeddings created.');
};

export const retrieveRecommendationHelpEmbeddings = async (
  userRequest: string,
): Promise<any[]> => {
  const requests = userRequest.split('. ');
  const client = await getRagClient();
  const indexName = await createCategorySchema(
    client,
    'recommendation_help_hnsw',
    '0.0.2'
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
