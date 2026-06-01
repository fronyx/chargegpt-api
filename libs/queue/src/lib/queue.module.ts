import { Module } from '@nestjs/common';
import { QueueService, ProducerService } from './services';

const services = [
  QueueService,
  ProducerService,
];

@Module({
  providers: [...services],
  exports: [...services],
})
export class QueueModule {
}
