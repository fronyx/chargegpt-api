import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { catchError, Observable, of } from 'rxjs';
import * as Sentry from '@sentry/minimal';
import { isExpectedError } from '../cdk-apps/src/shared';
import { configService } from '@fronyx/configurations';
import { sendExpectedErrorLogs } from '@fronyx/cloudwatch-logger';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: any) => {
        let error = err;

        if (isExpectedError(err) && err.getPublicError) {
          error = err.getPublicError();
        }

        if (configService.isProduction()) {
          if (isExpectedError(err)) {
            console.log('Sending expected error logs to cloudwatch...');
            console.log(JSON.stringify(err));
            sendExpectedErrorLogs(context, err);
          } else {
            Sentry.captureException(err);
          }
        }

        console.log(error.message);

        return of(error);
      })
    );
  }
}
