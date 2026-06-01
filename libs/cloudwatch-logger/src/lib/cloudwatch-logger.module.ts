import { Module } from '@nestjs/common';
import { CloudWatchLoggerInterceptor } from '../cloudwatch-logger';

const services = [CloudWatchLoggerInterceptor];

@Module({
  providers: [...services],
  exports: [...services],
})
export class CloudwatchLoggerModule {}
