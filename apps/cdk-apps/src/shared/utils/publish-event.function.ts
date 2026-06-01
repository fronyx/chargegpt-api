import { PollingEventsEnum } from '../domain/logging/events/polling-events.enum';
import { CloudWatchEventsClient, PutEventsCommand, PutEventsCommandInput } from '@aws-sdk/client-cloudwatch-events';
import { isEmptyString } from './is-empty-string.function';
import { isNull } from './is-null.function';
import {
  MAX_PUT_EVENT_BYTE_SIZE,
  getByteSize,
  groupIntoChunkByByteSize
} from './group-into-chunk-by-byte-size.function';

let eventBridgeClientConfig = {
  region: process.env.AWS_REGION,
} as Record<string, any>;

if (isNull(process.env.stage)) {
  eventBridgeClientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  };
}

const client = new CloudWatchEventsClient(eventBridgeClientConfig);

export async function publishEvent(args: {
  eventBusName: string;
  type: string;
  payload: any[];
  source: string;
}): Promise<any> {
  let chunks = groupIntoChunkByByteSize({ data: args.payload, byteSize: MAX_PUT_EVENT_BYTE_SIZE });
  const commandInput: PutEventsCommandInput = {
    Entries: [],
  };

  for (const payload of chunks) {
    commandInput.Entries?.push({
      Source: args.source,
      DetailType: 'payload',
      Detail: JSON.stringify({
        type: args.type,
        payload,
      }),
      EventBusName: args.eventBusName,
    });
    const totalByteSize = getByteSize(JSON.stringify(commandInput));
    console.log('totalByteSize: ', totalByteSize);

    if (totalByteSize > MAX_PUT_EVENT_BYTE_SIZE) {
      await client.send(new PutEventsCommand(commandInput));
      commandInput.Entries = [];
    }
  }

  if (commandInput.Entries!.length > 0) {
    await client.send(new PutEventsCommand(commandInput));
  }
}

export async function publishToLogsProcessorEventBus(args: {
  type: PollingEventsEnum;
  payload: any[];
}): Promise<void> {
  const source = 'lambda.EVFreaksPolling';

  const eventBusName = process.env.logsProcessorEventBus!;

  if (isEmptyString(eventBusName)) {
    throw new Error('logsProcessorEventBus not configured!');
  }

  await publishEvent({
    eventBusName,
    source,
    type: args.type,
    payload: args.payload,
  });
}
