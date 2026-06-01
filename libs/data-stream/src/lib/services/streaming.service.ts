import { Injectable } from '@nestjs/common';
import { KinesisClient, PutRecordsCommand } from '@aws-sdk/client-kinesis';
import { configService } from '@fronyx/configurations';

@Injectable()
export class StreamingService {
  private readonly client: KinesisClient;

  constructor() {
    this.client = new KinesisClient(configService.getAwsCredentials());
  }

  async putRecords(args: { data: any[]; name: string; }): Promise<void> {
    const command = new PutRecordsCommand({
      StreamName: args.name,
      Records: (args.data ?? []).map(val => ({
        Data: new TextEncoder().encode(`${JSON.stringify(val)}\n`),
        PartitionKey: '1',
      })),
    });

    try {
      await this.client.send(command);
    } catch (err) {
      const message = `[StreamingService.putRecords] ERROR caused by: ${err.message}, payload: ${JSON.stringify(args)}, stack: ${err.stack}`;
      console.error(message);
    }
  }
}
