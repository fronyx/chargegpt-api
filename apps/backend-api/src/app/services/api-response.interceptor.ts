import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { EvsePrediction, ChargingStationPrediction, AvailabilityEnum } from '../../../../cdk-apps/src/shared';
import { tap, Observable } from 'rxjs';

interface ResponseSummary {
  availableCount: number;
  unavailableCount: number;
  available2UnavailableRatio: number;
  response2RequestRatio: number;
  totalReturnedPredictions: number;
  totalRequestedPredictions: number;
}

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        tap(body => console.log(JSON.stringify(this.getLogSummary(body, context.switchToHttp().getRequest())))),
      );
  }

  getLogSummary(body: EvsePrediction | EvsePrediction[] | ChargingStationPrediction, request: any): ResponseSummary {
    let availableCount = 0;
    let unavailableCount = 0;
    let totalReturnedPredictions = 0;
    let totalRequestedPredictions = 0;

    if (Array.isArray(body)) {
      body
        .map(({ predictions }) => predictions)
        .reduce((acc, val) => [].concat(acc, val), [])
        .forEach(({ status }) => {
          if (status === AvailabilityEnum.AVAILABLE) {
            availableCount++;
          } else {
            unavailableCount++;
          }
        });

      totalReturnedPredictions = body.length;
      totalRequestedPredictions = request.query[Object.keys(request.query)[0]].split(',')?.length || 0;
    } else {
      totalReturnedPredictions = 1;
      totalRequestedPredictions = 1;

      body.predictions.forEach(({ status }) => {
        if (status === AvailabilityEnum.AVAILABLE) {
          availableCount++;
        } else {
          unavailableCount++;
        }
      });
    }

    return {
      availableCount,
      unavailableCount,
      available2UnavailableRatio: availableCount / unavailableCount,
      totalReturnedPredictions,
      totalRequestedPredictions,
      response2RequestRatio: totalReturnedPredictions / totalRequestedPredictions,
    };
  }
}
  