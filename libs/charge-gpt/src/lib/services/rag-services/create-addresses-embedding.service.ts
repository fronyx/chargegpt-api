import { addressFewShotExamples } from './address-few-shots.model';
import { getEmbedding } from './openai-embedding-client.service';
import {
  createCategorySchema,
  disconnectRagClient,
  getRagClient,
  retrieveEmbedding,
  saveEmbedding,
} from './rag-client.service';


export const createAddressesEmbeddings = async (): Promise<void> => {
  console.log('Creating address embeddings...');
  const fewShotRequests = addressFewShotExamples.map((example) =>
    JSON.stringify(example.user)
  );
  const pattern = /User request: (.*?)\\n\s+Your response:/s;
  const historyPattern = /{([^}]*)}/g;

  const requests = fewShotRequests.map((request) => {
    const match = request.match(pattern);
    if (match && match[1])
      return (match[1]);
  });
  
  const requestParts = fewShotRequests.map((request) => {
    const match = request.match(pattern);

    if (match && match[1])
      return (match[1].split('.')).filter((part) => part.length > 0 && part !== ' ');
  });
  const requestHistoryParts = fewShotRequests.map((request) => {
    const match = request.match(historyPattern);

    if (match && match[1])
      return match[1];
  });

  const fewShotExamples = addressFewShotExamples.map((example) =>
    JSON.stringify(example)
  );

  const client = await getRagClient();
  const indexName = await createCategorySchema(
    client,
    'req_ident_address_hnsw',
    '0.0.92'
  );

  for (let i = 0; i < fewShotExamples.length; i++) {
    console.log('Creating embedding for example', i);
    // store the complete user request
    if (requests[i] === undefined) {
      const embedding = await getEmbedding(requests[i]);

      if (embedding === null) {
        console.error('Error creating embedding for example', i);
        continue;
      }

      await saveEmbedding(client, indexName, i, fewShotExamples[i], requests[i], embedding, false);
    }
    // store the parts of the user request
    for (let j = 0; j < requestParts[i].length; j++) {
      const embedding = await getEmbedding(requestParts[i][j]);

      if (embedding === null) {
        console.error('Error creating embedding for example', i);
        continue;
      }

      await saveEmbedding(client, indexName, i, fewShotExamples[i], requestParts[i][j], embedding, false);
    }
    // store the history of the user request
    if (requestHistoryParts[i] !== undefined) {
      const embedding = await getEmbedding(requestHistoryParts[i]);

      if (embedding === null) {
        console.error('Error creating embedding for example', i);
        continue;
      }

      await saveEmbedding(client, indexName, i, fewShotExamples[i], requestHistoryParts[i], embedding, false);
    }
  }
  disconnectRagClient();
  console.log('Address embeddings created.');
};


export const retrieveAddressesEmbeddings = async (
  userRequest: string,
  overtConversationSummary: string
): Promise<any[]> => {
  const requests = userRequest.split('. ');
  const client = await getRagClient();
  const indexName = await createCategorySchema(
    client,
    'req_ident_address_hnsw',
    '0.0.92'
  );
  const userRequestEmbeddings = await Promise.all(requests.map(async (request) => await getEmbedding(request)));

  const storedEmbeddingsResultWithSAM25 = await Promise.all(userRequestEmbeddings.map(async (embedding) => await retrieveEmbedding(
    client,
    indexName,
    8,
    userRequest,
    embedding,
    false
  )));
  const documents = [];
  for (const result of storedEmbeddingsResultWithSAM25) {
    documents.push(...result.documents);
  }

  if ((overtConversationSummary !== undefined) && (overtConversationSummary !== '')) {
    const historyEmbedding = await getEmbedding(overtConversationSummary);

    const historyEmbeddingResults = await retrieveEmbedding(
      client,
      indexName,
      8,
      userRequest,
      historyEmbedding,
      false
    );
    if (historyEmbeddingResults.documents.length > 0) {
      documents.push(...historyEmbeddingResults.documents);
    }
  }
  // console.log('Address embeddings retrieved:', documents);
  return documents;
};
