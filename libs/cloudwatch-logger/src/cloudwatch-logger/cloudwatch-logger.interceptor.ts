import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { configService } from '@fronyx/configurations';
import { sendAPIRequestLogs } from './cloudwatch-logger.service';

@Injectable()
export class CloudWatchLoggerInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const timestamp = Date.now();
    const humanReadableTimestamp = new Date(timestamp).toISOString();

    return next
      .handle()
      .pipe(
        tap(() => {
          this.processAndSendLogs({
            humanReadableTimestamp,
            context,
            timestamp,
          });
        }),
        catchError(err => {
          this.processAndSendLogs({
            humanReadableTimestamp,
            context,
            timestamp,
          });
          throw err;
        }),
      );
  }

  processAndSendLogs(args: {
    context: ExecutionContext,
    timestamp: number;
    humanReadableTimestamp: string;
  }): void {
    const request = args.context.switchToHttp().getRequest();
    const response = args.context.switchToHttp().getResponse();
    const user = request.user;
    const apiToken = user.api_token;
    const projectName = user.name;
    const contextConfig = request.context.config;
    const queryParams = JSON.parse(JSON.stringify(request.query));
    const urlParams = request.params;

    const message = {
      timestamp: args.timestamp,
      humanReadableTimestamp: args.humanReadableTimestamp,
      url: contextConfig,
      queryParams,
      urlParams,
      apiToken,
      projectName,
      httpStatusCode: response.raw.statusCode,
    };
    if (configService.isProduction()) {
      sendAPIRequestLogs({ message });
    }
  }
}
