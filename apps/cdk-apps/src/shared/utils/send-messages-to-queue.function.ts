import { groupIntoChunk } from './group-into-chunk';
import { SQSClient, SendMessageBatchCommand, SendMessageBatchRequest } from '@aws-sdk/client-sqs';

const client = new SQSClient({ region: process.env.AWS_REGION });

export async function sendMessagesToQueue(args: { data: any[]; queueUrl: string; }): Promise<void> {
  const chunks = groupIntoChunk({ data: args.data, chunkSize: 150 });

  const commandInput: SendMessageBatchRequest = {
    QueueUrl: args.queueUrl,
    Entries: [],
  };

  for (let i = 0; i < chunks.length; i++) {
    const messages = chunks[i];

    commandInput.Entries!.push({
      Id: `${Date.now()}-${i}`,
      MessageBody: JSON.stringify(messages),
    });

    if (commandInput.Entries!.length >= 10) {
      await client.send(new SendMessageBatchCommand(commandInput));

      commandInput.Entries = [];
    }
  }

  if (commandInput.Entries!.length > 0) {
    await client.send(new SendMessageBatchCommand(commandInput));
  }
}
