import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { tap, Observable } from 'rxjs';
import { configService } from '@fronyx/configurations';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { Answer } from '../models/prompt';
import { sendChargeGptRecommendation } from '@fronyx/cloudwatch-logger';

@Injectable()
export class ChargeGptRecommendationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(tap((body) => this.processAndSendLogs(body)));
  }

  async processAndSendLogs(body: Answer): Promise<void> {
    if (isObjectEmpty(body)) {
      return;
    }
    const results = body.results;

    if (isObjectEmpty(body.results)) {
      return;
    }

    const data = results.data;
    const messages = [];

    if (!isObjectEmpty(data)) {
      for (const { probability, distance, powerType } of data) {
        messages.push({
          property: `predictedAvailability:${powerType.toLowerCase()}`,
          value: probability,
          unit: 'None',
        });
        messages.push({
          property: `distance:${powerType.toLowerCase()}`,
          value: distance,
          unit: 'None',
        });
      }
    }

    if (configService.isProduction() && messages.length > 0) {
      await sendChargeGptRecommendation(messages);
    }
  }
}
