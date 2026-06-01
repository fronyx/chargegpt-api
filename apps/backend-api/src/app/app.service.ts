import { configService } from '@fronyx/configurations';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string; stage: string; apiVersion: string; } {
    return {
      message: 'Welcome to Fronyx API check alive!', stage: configService.isProduction() ? 'production' : 'staging', apiVersion: configService.getApiVersion() };
  }
}
