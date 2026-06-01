import { conversationHistoriesClient } from '@fronyx/persistence';
import { ConversationHistory } from '../models/conversation-history.model';

export const storeConversationHistory = (
  conversationHistory: ConversationHistory
) => {
  return conversationHistoriesClient.upsert(conversationHistory.getJSON());
};

export const getAllOpenConversationHistory = async (): Promise<
  ConversationHistory[]
> => {
  const query = [
    'SELECT VALUE r',
    'FROM root r',
    'WHERE r.isConversationFinished = false',
    'AND r.acquiredData.conversationStage = \'production\'',
  ].join(' ');

  const querySpec = {
    query,
  };

  const { resources } = await conversationHistoriesClient
    .query(querySpec)
    .fetchAll();

  return resources.map((val) => new ConversationHistory(val));
};

export const getConversationHistoryData = async (
  stage: string,
  projectName: string,
  id: string
): Promise<ConversationHistory> => {
  const query = [
    'SELECT VALUE r',
    'FROM root r',
    'WHERE r.partitionKey = @partitionKey',
    'AND r.id = @conversationId',
  ].join(' ');
  const parameters = [
    {
      name: '@partitionKey',
      value: `${stage}:${projectName}`,
    },
    {
      name: '@conversationId',
      value: id,
    },
  ];

  const querySpec = {
    query,
    parameters,
  };

  const { resources } = await conversationHistoriesClient
    .query(querySpec)
    .fetchAll();

  if (resources.length > 0) {
    const conversationData = resources[0];
    return conversationData;
  }

  return null;
};
