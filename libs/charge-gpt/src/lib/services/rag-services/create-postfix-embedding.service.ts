import { postfixFewShotExamples } from './postfix-few-shots.model';
import { getEmbedding } from './openai-embedding-client.service';
import {
  createCategorySchema,
  disconnectRagClient,
  getRagClient,
  retrieveEmbedding,
  saveEmbedding,
} from './rag-client.service';

export const createPostfixEmbeddings = async (): Promise<void> => {
  console.log('Creating postfix embeddings...');
  const fewShots = postfixFewShotExamples.map((example) =>
    JSON.stringify(example)
  );

  const client = await getRagClient();
  const indexName = await createCategorySchema(
    client,
    'req_ident_postfix_flat',
    '0.0.4'
  );

  for (let i = 0; i < fewShots.length; i++) {
    console.log('Creating embedding for example', i);
    const embedding = await getEmbedding(fewShots[i]);

    if (embedding === null) {
      console.error('Error creating embedding for example', i);
      continue;
    }
    
    await saveEmbedding(client, indexName, i, fewShots[i], fewShots[i], embedding);
  }
  disconnectRagClient();
  console.log('Postfix embeddings created.');
};

export const retrievePostfixEmbeddings = async (
  userRequest: string
): Promise<any[]> => {
  const client = await getRagClient();
  const indexName = await createCategorySchema(
    client,
    'req_ident_postfix_flat',
    '0.0.4'
  );
  const userRequestEmbedding = await getEmbedding(userRequest);
  const storedEmbeddingsResult = await retrieveEmbedding(
    client,
    indexName,
    10,
    userRequest,
    userRequestEmbedding
  );

  return storedEmbeddingsResult.documents;
};
