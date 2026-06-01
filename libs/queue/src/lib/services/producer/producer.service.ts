import { Injectable } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';
import { QueueEnums } from '../../enums';

@Injectable()
export class ProducerService {
  constructor(
    private readonly queue: QueueService,
  ) {
  }

  async send(args: {
    queue: QueueEnums;
    messages: any;
  }): Promise<void> {
    try {
      await this.queue.sqs.sendMessage({
        QueueUrl: this.queue.getQueueUrl(args.queue),
        MessageBody: JSON.stringify(args.messages ?? []),
      }).promise();
    } catch (err) {
      const message = `[ProducerService.send] ERROR caused by: ${err.message}, payload: ${JSON.stringify(args)}, stack: ${err.stack}`;
      console.error(message);
    }
  }
}
