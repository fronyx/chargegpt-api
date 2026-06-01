import { configService } from '@fronyx/configurations';
import { Injectable } from '@nestjs/common';
import { ProducerService, QueueEnums } from '@fronyx/queue';
import { groupIntoChunk } from '../../../../../apps/cdk-apps/src/shared/utils/group-into-chunk';
import {
  ProcessedPrediction
} from "../../../../../apps/cdk-apps/src/shared/domain/logging/update-create/models/processed-prediction";

@Injectable()
export class LongTermStorageMessageProducerFactory {
  private readonly messageType: string;

  constructor(
    private readonly producer: ProducerService,
  ) {
    this.messageType = configService.getAiModel();
  }

  produce(args: {
    predictions: ProcessedPrediction[];
  }): void {
    const data = groupIntoChunk({ data: args.predictions, chunkSize: 200 });

    const queue = this.queueName;

    data.forEach(messages =>
      this.producer
        .send({
          queue,
          messages,
        })
        .catch(err => console.error(`LongTermStorageMessageProducerFactory: ${queue}`, JSON.stringify(err))),
    );
  }

  get queueName(): QueueEnums {
    if (this.messageType === 'classification') {
      return QueueEnums.ClassificationStorageQueue;
    }

    if (this.messageType === 'regression') {
      return QueueEnums.RegressionStorageQueue;
    }
  }
}
