import {
  Controller,
  Get,
  UseInterceptors,
  Post,
  Body,
  Query,
  Res,
  Headers,
} from '@nestjs/common';
import { SentryInterceptor } from '../../../../../apps/sentry/sentry.interceptor';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { validateVerificationRequest } from '../services/whatsapp-middleware/verification-utils.service';
import { useTry } from 'no-try';
import { processWebhookEvents } from '../services/whatsapp-middleware/whatsapp-webhook.service';
import * as Sentry from '@sentry/minimal';
import { whatsAppChargeGPTHandlerService } from '../services/whatsapp-middleware/whatsapp-chargegpt-handler.service';

@ApiTags('ChargeGPT')
@UseInterceptors(SentryInterceptor)
@Controller('charge-gpt/whatsapp/webhook')
export class WhatsAppWebhookController {
  @ApiExcludeEndpoint()
  @Get('')
  verify(@Query() query, @Res() response): void {
    const [err, challengeValue] = useTry(() =>
      validateVerificationRequest(query)
    );

    if (err) {
      response.status(400).send(err.message);
    }

    response.status(200).send(challengeValue);
  }

  @ApiExcludeEndpoint()
  @Post('')
  async processEvent(
    @Headers() headers,
    @Body() body,
    @Res() response
  ): Promise<any> {
    console.info('>>> Processing webhook event body', JSON.stringify(body));
    response.status(200).send();

    processWebhookEvents(headers, body, whatsAppChargeGPTHandlerService)
      .then()
      .catch((err) => {
        console.error(`Failed to process webhook events ${err.message}`);
        Sentry.captureException(err);
      });
  }
}
