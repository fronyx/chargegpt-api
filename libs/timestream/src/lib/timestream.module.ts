import { Module } from '@nestjs/common';
import { TimestreamService } from './services/timestream.service';
import { HttpModule } from '@nestjs/axios';

const services = [
    TimestreamService,
];

@Module({
    imports: [
        HttpModule,
    ],
    providers: [...services],
    exports: [...services],
})
export class TimestreamModule {}
