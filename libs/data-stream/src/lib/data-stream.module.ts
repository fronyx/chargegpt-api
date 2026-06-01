import { Module } from '@nestjs/common';
import { StreamingService } from './services';

const services = [StreamingService];

@Module({
  providers: [...services],
  exports: [...services],
})
export class DataStreamModule {}
