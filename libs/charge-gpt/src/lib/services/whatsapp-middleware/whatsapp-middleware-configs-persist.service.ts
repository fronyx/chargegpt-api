import { whatsAppMiddlewareConfigsClient } from '@fronyx/persistence';

enum WhatsAppConfigTypeEnum {
  PHONE_TO_PROJECT_MAP = 'phone_to_project_map',
}

interface ProjectConfig {
  name: string;
  apiToken: string;
  id: number;
}

export interface WhatsAppMiddlewareConfigs {
  configType: WhatsAppConfigTypeEnum;
  id: string;
  value: ProjectConfig;
}

export const getPhoneToProjectMapConfig = async (
  recipient: string
): Promise<WhatsAppMiddlewareConfigs> => {
  const query = [
    'SELECT VALUE r',
    'FROM root r',
    'WHERE r.configType = @partitionKey',
    'AND r.id = @recipient',
  ].join(' ');
  const parameters = [
    {
      name: '@partitionKey',
      value: WhatsAppConfigTypeEnum.PHONE_TO_PROJECT_MAP,
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

  const { resources } = await whatsAppMiddlewareConfigsClient
    .query(querySpec)
    .fetchAll();

  if (!resources || resources.length === 0) {
    return null;
  }

  return resources[0];
};
