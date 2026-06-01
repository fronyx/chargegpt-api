import { cat4FewShotExamples } from './cat4-few-shots.model';
import { getEmbedding } from './openai-embedding-client.service';
import {
  createCategorySchema,
  disconnectRagClient,
  getRagClient,
  retrieveEmbedding,
  saveEmbedding,
} from './rag-client.service';

export const createCat4Embeddings = async (): Promise<void> => {
  console.log('Creating Category 4 embeddings...');
  const fewShotRequests = cat4FewShotExamples.map((example) =>
    JSON.stringify(example.user)
  );
  const fewShotExamples = cat4FewShotExamples.map((example) =>
    JSON.stringify(example)
  );

  const client = await getRagClient();
  const indexName = await createCategorySchema(
    client,
    'req_ident_cat4_flat',
    '0.0.1'
  );

  for (let i = 0; i < fewShotExamples.length; i++) {
    console.log('Creating embedding for example', i);
    const embedding = await getEmbedding(fewShotRequests[i]);

    if (embedding === null) {
      console.error('Error creating embedding for example', i);
      continue;
    }

    await saveEmbedding(client, indexName, i, fewShotExamples[i], fewShotRequests[i], embedding);

    // await saveEmbedding(client, indexName, i, fewShotExamples[i], embedding);
  }
  disconnectRagClient();
  console.log('Category 4 embeddings created.');
};

export const retrieveCat4Embeddings = async (
  userRequest: string,
  overtConversationSummary: string
): Promise<any[]> => {
  const request = `Conversation history: {${overtConversationSummary}}
  
      User request: ${userRequest}
      Your response: `;
  const client = await getRagClient();
  const indexName = await createCategorySchema(
    client,
    'req_ident_cat4_flat',
    '0.0.1'
  );
  const userRequestEmbedding = await getEmbedding(request);
  const storedEmbeddingsResult = await retrieveEmbedding(
    client,
    indexName,
    10,
    userRequest,
    userRequestEmbedding
  );

  return storedEmbeddingsResult.documents;
};
