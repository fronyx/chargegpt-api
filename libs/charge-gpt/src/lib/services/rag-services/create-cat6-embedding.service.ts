import { cat6FewShotExamples } from './cat6-few-shots.model';
import { getEmbedding } from './openai-embedding-client.service';
import {
  createCategorySchema,
  disconnectRagClient,
  getRagClient,
  retrieveEmbedding,
  saveEmbedding,
} from './rag-client.service';

export const createCat6Embeddings = async (): Promise<void> => {
  console.log('Creating Category 6 embeddings...');
  const fewShotRequests = cat6FewShotExamples.map((example) =>
    JSON.stringify(example.user)
  );
  const fewShotExamples = cat6FewShotExamples.map((example) =>
    JSON.stringify(example)
  );

  const client = await getRagClient();
  const indexName = await createCategorySchema(
    client,
    'req_ident_cat6_flat',
    '0.0.5'
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
  console.log('Category 6 embeddings created.');
};

export const retrieveCat6Embeddings = async (
  userRequest: string,
  overtConversationSummary: string
): Promise<any[]> => {
  const request = `Conversation history: {${overtConversationSummary}}
  
      User request: ${userRequest}
      Your response: `;
  const client = await getRagClient();
  const indexName = await createCategorySchema(
    client,
    'req_ident_cat6_flat',
    '0.0.5'
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
