import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { AppService } from './app/services/app.service';

let app: INestApplicationContext;

async function bootstrap(): Promise<INestApplicationContext> {
  return NestFactory.createApplicationContext(AppModule);
}

(async () => {
  if (typeof app === 'undefined' || app === null || app === undefined) {
    app = await bootstrap();
  }
})();

export const handler = async (event: any = {}): Promise<any> => {
  if (typeof app === 'undefined' || app === null || app === undefined) {
    app = await bootstrap();
  }

  const service = app.get(AppService);

  const payload = service.getValidPayload({
    records: service.filterRecordsOlderThan5Minutes({ records: event.Records ?? [] }),
  });
  try {
    await service.sendMessage({ payload });
  } catch (err) {
    console.error('Error pushing the message:', err, 'with the payload', JSON.stringify(event.Records));
    throw err;
  }

  return true;
};
