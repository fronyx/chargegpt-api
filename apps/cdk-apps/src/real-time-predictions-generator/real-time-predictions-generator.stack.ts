import { Stack, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { addLambdaPermission, LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import * as config from 'config';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { defaultLambdaProps } from '../logs-processor-stack/constants/default-lambda-props';
import { CoreLambdaStack } from '../shared/interfaces/core-stack.interface';

export class RealTimePredictionsGeneratorStack extends Stack {
  constructor(scope: Construct, id: string, props: CoreLambdaStack) {
    super(scope, id, props);

    const lambdaEnvVariables = {
      backendApiUrl: config.get<string>('backendApi.url'),
      sentryDsn: config.get<string>('sentry.dsn'),
      toolkitUrl: config.get<string>('toolkit.url'),
      toolkitAccessToken: config.get<string>('toolkit.accessToken'),
      mongoDbUrl: config.get<string>('mongoDb.url'),
    };

    const handler = new NodejsFunction(this, `${id}Lambda`, {
      ...defaultLambdaProps,
      handler: 'processLastUpdatedEvses',
      entry: 'src/real-time-predictions-generator/services/real-time-predictions-generator.service.ts',
      timeout: Duration.minutes(15),
      memorySize: 512,
      environment: lambdaEnvVariables,
      vpc: props.vpc,
      securityGroups: [props.lambdaSg]
    });

    const policy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['lambda:InvokeFunction'],
      resources: [process.env.PREDICTION_PROCESSOR_LAMBDA_ARN ?? 'arn:aws:lambda:region:account-id:function:example']
    });

    handler.addToRolePolicy(policy);

    const eventRule = new Rule(this, `${id}EveryMinuteRule`, {
      schedule: Schedule.cron({ minute: '0/1' }),
      enabled: false,
    });
    eventRule.addTarget(new LambdaFunction(handler));

    addLambdaPermission(eventRule, handler);
  }
}
