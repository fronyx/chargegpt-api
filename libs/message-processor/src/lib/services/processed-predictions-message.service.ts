import { Injectable } from '@nestjs/common';
import { LongTermStorageMessageProducerFactory } from './long-term-storage-message-producer.factory';
import {
  ProcessedPrediction
} from '../../../../../apps/cdk-apps/src/shared/domain/logging/update-create/models/processed-prediction';
import {
  filterOldPredictions
} from '../../../../../apps/cdk-apps/src/shared/domain/cache/filter-old-predictions.function';

@Injectable()
export class ProcessedPredictionsMessageService {
  constructor(
    private readonly storageFactory: LongTermStorageMessageProducerFactory,
  ) {
  }

  async perform(args: ProcessedPrediction[]): Promise<void> {
    await this.processPredictions(filterOldPredictions(args));
  }

  async processPredictions(args: ProcessedPrediction[]): Promise<void> {

    this.storageFactory.produce({ predictions: args }); // Saved to S3
  }
}
