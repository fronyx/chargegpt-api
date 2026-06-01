import { Module } from '@nestjs/common';
import { CacheModule } from '@fronyx/cache';
import { QueueModule } from '@fronyx/queue';
import { ProcessedPredictionsMessageService, SqsEventBodyParserFactory } from './services';
import { RegressionModelMessageParserService } from './services/regression-model-message-parser.service';
import { LongTermStorageMessageProducerFactory } from './services/long-term-storage-message-producer.factory';
import { HttpModule } from '@nestjs/axios';

const services = [
  ProcessedPredictionsMessageService,
  SqsEventBodyParserFactory,
  RegressionModelMessageParserService,
  LongTermStorageMessageProducerFactory,
];

@Module({
  imports: [CacheModule, QueueModule, HttpModule],
  providers: [...services],
  exports: [...services],
})
export class MessageProcessorModule {}
