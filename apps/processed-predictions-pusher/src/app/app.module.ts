import { Module } from '@nestjs/common';
import { AppService } from './services/app.service';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';

@Module({
  imports: [
    HttpModule.register({
      timeout: 60000,
      httpsAgent: new https.Agent({ keepAlive: true }),
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
