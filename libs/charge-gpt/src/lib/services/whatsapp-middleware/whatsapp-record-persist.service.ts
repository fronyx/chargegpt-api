import { whatsAppConversationRecordsClient } from '@fronyx/persistence';

const stage = 'production'; // TODO fix this after we have production instance

export interface WhatsAppRecord {
  id: string;
  partitionKey: string;
  updatedAt: number;
  conversationIds: string[];
  activeConversationId: string;
}

const getRecordPartitionKey = (recipient: string, projectName: string) => {
  return `${stage}:${projectName.replace(/\s/g, '')}:${recipient}`;
}

export const initRecord = (recipient: string, projectName: string): WhatsAppRecord => {
  return {
    id: recipient,
    partitionKey: getRecordPartitionKey(recipient, projectName),
    updatedAt: Date.now(),
    conversationIds: [],
    activeConversationId: null,
  };
};

export const getRecord = async (
  recipient: string,
  projectName: string
): Promise<WhatsAppRecord> => {
  const query = [
    'SELECT VALUE r',
    'FROM root r',
    'WHERE r.partitionKey = @partitionKey',
    'AND r.id = @recipient',
  ].join(' ');
  const parameters = [
    {
      name: '@partitionKey',
      value: getRecordPartitionKey(recipient, projectName),
    },
    {
      name: '@recipient',
      value: recipient,
    },
  ];

  const querySpec = {
    query,
    parameters,
  };

  const { resources } = await whatsAppConversationRecordsClient
    .query(querySpec)
    .fetchAll();

  if (!resources || resources.length === 0) {
    return null;
  }

  return resources[0];
};

export const saveRecord = async (record: WhatsAppRecord) => {
  return whatsAppConversationRecordsClient.upsert({
    ...record,
    updatedAt: Date.now(),
  });
};
