import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as Sentry from '@sentry/node';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { configService } from '@fronyx/configurations';
import { InternalProcessService } from './app/services/internal-process.service';

import { readFileSync, existsSync } from 'fs';

const getCertificateConfiguration = () => {
  if (process.env.TLS_CERT && process.env.TLS_KEY) {
    if (existsSync(process.env.TLS_CERT) && existsSync(process.env.TLS_KEY)) {
      return {
        key: readFileSync(process.env.TLS_KEY),
        cert: readFileSync(process.env.TLS_CERT),
      };
    }
  }

  return null;
};

async function bootstrap() {
  if (!process.env.ASYNC_COMMAND) {
    if (configService.isProduction() || configService.isStaging()) {
      Sentry.init({
        dsn: configService.getSentryDsn(),
      });
    }

    const options: any = {
      disableRequestLogging: true,
    };

    let port = process.env.PORT || 3333;
    const certificateConfig = getCertificateConfiguration();

    if (certificateConfig) {
      console.log('Found certificate. Starting HTTPS server on 8443.');
      options.https = certificateConfig;
      port = 8443;
    }

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(options));

    app.enableCors();

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    const config = new DocumentBuilder()
      .setTitle('ChargeGPT API')
      .addApiKey({
        name: 'x-api-token',
        type: 'apiKey',
        in: 'header',
      }, 'apiToken')
      .setDescription(
        '<h2>Getting started</h2>' +
        '<h3>What is the ChargeGPT API?</h3>' +
        'The ChargeGPT API helps charging service providers offer natural-language and prediction-driven EV driver experiences.\n' +
        '<h3>What kind of services are available?</h3>' +
        'Currently the following services are available:' +
        '<ul><li>Availability predictions: Prevent your EV drivers from arriving at blocked charging stations.</li></ul>' +
        '<ul><li>Recommendations: Enhance your EV drivers charging experience by delivering charging station recommendations based on their preferences, including location, date, time, and power type.</li></ul>' +
        '<ul><li>ChargeGPT (Beta): Let your EV drivers interact with your charging service in natural, human language, and recommend them suitable charging stations based on expressed charging needs.</li></ul>' +
        '<h3>How to get access?</h3>' +
        'Access credentials are issued by the API operator so you can call the service.' +
        '<br><br>' +
        'Please reach out to <b><a href="mailto:support@example.com">support@example.com</a></b> to get the credentials.' +
        '<br><br>' +
        'Please note that API token access can be restricted to certain endpoints or configurations.' +
        '<br><br>' +
        'The provided <b><i>api_token</i></b> can then be used to call the ChargeGPT API.' +
        '<br><br>' +
        'The API endpoint is: <b><i><a href="https://api.example.com" target="_blank">https://api.example.com</a></i></b>'
      )
      .addServer('https://api.example.com', 'Production')
      .setVersion('1.0')
      .build();

    const styleConfig = {
      customCss: '.topbar-wrapper img {content:url(\'https://cdn.example.com/assets/fronyx-logo.JPG\'); width:160px; height:auto; margin-top:10px} .swagger-ui .topbar { background-color: #000044; }',
      customfavIcon: 'https://cdn.example.com/assets/favicon.ico',
      customSiteTitle: 'ChargeGPT API',
      swaggerOptions: { defaultModelsExpandDepth: -1 },
    };

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('documentations', app, document, styleConfig);

    await app.listen(port, '0.0.0.0', () => {
      Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
    });
  } else {
    const app = await NestFactory.create(AppModule);
    const service = app.get(InternalProcessService);

    console.log(`Triggering async command ${process.env.ASYNC_COMMAND} with payload ${process.env.ASYNC_COMMAND_PAYLOAD}...`);

    const { isTerminate } = await service.executeAsyncCommand(process.env.ASYNC_COMMAND, process.env.ASYNC_COMMAND_PAYLOAD);

    if (isTerminate) {
      console.log('Terminating the startup process...');
      try {
        await app.close();
        process.kill(process.pid, 'SIGTERM');
      } catch (err) {
        console.error(err);
        process.kill(process.pid, 'SIGTERM');
      }
    }
  }
}

bootstrap();

