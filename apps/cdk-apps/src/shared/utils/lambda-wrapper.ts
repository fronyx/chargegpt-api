import * as Sentry from '@sentry/serverless';

Sentry.AWSLambda.init({
  dsn: process.env.sentryDsn,
  tracesSampleRate: 0,
  enableTracing: false,
  sampleRate: 0.05,
});

export class LambdaWrapper {
  static wrap(lambdaFn: any): any {
    return Sentry.AWSLambda.wrapHandler(lambdaFn, {
      captureTimeoutWarning: false,
    });
  }
}
