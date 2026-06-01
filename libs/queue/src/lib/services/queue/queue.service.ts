import { Injectable } from '@nestjs/common';
import { configService } from '@fronyx/configurations';
import * as AWS from 'aws-sdk';

@Injectable()
export class QueueService {
  private readonly accountId = process.env.AWS_ACCOUNT_ID ?? '000000000000';
  private readonly region;
  readonly sqs;

  constructor() {
    const config = configService.getAwsConfigurations();

    if (!configService.isLambda()) {
      AWS.config.update(config);
    }
    this.region = config.region;

    this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
  }

  getQueueUrl(queueName: string): string {
    return `https://sqs.${this.region}.amazonaws.com/${this.accountId}/${queueName}`;
  }
}
