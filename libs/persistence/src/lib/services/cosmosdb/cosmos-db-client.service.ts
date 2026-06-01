import { CosmosClient } from '@azure/cosmos';
import { configService } from '@fronyx/configurations';

const ocpiDatabaseId = 'OCPIData';
const AIPredictionsDatabaseId = 'AIPredictions';
const locationsContainerId = 'Locations';
const ClassificationStatisticsContainerId = 'Statistics';
const conversationsDatabaseId = 'Conversations';
const conversationHistoriesContainerId = 'Histories';
const whatsAppRecordsContainerId = 'WhatsAppRecords';
const whatsAppMiddlewareConfigsContainerId = 'WhatsAppMiddlewareConfigs';

const options = {
  endpoint: configService.getCosmosDbEndpoint(),
  key: configService.getCosmosDbKey(),
  userAgentSuffix: 'BackendServer',
};

const cosmosDBClient = new CosmosClient(options);

export const chargingStationsClient = cosmosDBClient
  .database(ocpiDatabaseId)
  .container(locationsContainerId).items;

export const conversationHistoriesClient = cosmosDBClient
  .database(conversationsDatabaseId)
  .container(conversationHistoriesContainerId).items;

export const whatsAppConversationRecordsClient = cosmosDBClient
  .database(conversationsDatabaseId)
  .container(whatsAppRecordsContainerId).items;

export const whatsAppMiddlewareConfigsClient = cosmosDBClient
  .database(conversationsDatabaseId)
  .container(whatsAppMiddlewareConfigsContainerId).items;

export const classificationStatisticsClient = cosmosDBClient
  .database(AIPredictionsDatabaseId)
  .container(ClassificationStatisticsContainerId).items;
