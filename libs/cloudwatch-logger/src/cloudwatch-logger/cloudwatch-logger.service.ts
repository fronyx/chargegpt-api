import { ExecutionContext } from '@nestjs/common';
import { configService } from '@fronyx/configurations';
import {
  CloudWatchClient,
  PutMetricDataCommand,
} from '@aws-sdk/client-cloudwatch';
import * as winston from 'winston';
import * as WinstonCloudWatch from 'winston-cloudwatch';
import { useTryAsync } from 'no-try';

const cloudWatchClient: CloudWatchClient = new CloudWatchClient(
  configService.getAwsConfigurations()
);

winston.loggers.add('expectedErrorLog', {
  transports: [
    new WinstonCloudWatch({
      ...configService.getAwsConfigurationsWinston(),
      logGroupName:
        'BackendApiPrivateStack-production-BackendApiExpectedErrorLogsACBD406A-N7tYZS86cMc6',
      logStreamName: 'errors_list',
      messageFormatter: (logObject) => JSON.stringify(logObject.message),
      uploadRate: 60000,
    }),
  ],
});

winston.loggers.add('apiRequestLog', {
  transports: [
    new WinstonCloudWatch({
      ...configService.getAwsConfigurationsWinston(),
      logGroupName:
        'BackendApiPrivateStack-production-BackendApiRequestsLogsD0EBBA28-Enb2Thfd0vf5',
      logStreamName: 'requests_list',
      messageFormatter: (logObject) => JSON.stringify(logObject.message),
      uploadRate: 60000,
    }),
  ],
});

const expectedErrorLog = winston.loggers.get('expectedErrorLog');
const apiRequestLog = winston.loggers.get('apiRequestLog');

export const sendAPIRequestLogs = (args: { message: unknown }) => {
  if (!configService.isProduction()) {
    return;
  }

  apiRequestLog.info(args.message);
};

export const sendExpectedErrorLogs = (context: ExecutionContext, err: any) => {
  if (!configService.isProduction()) {
    return;
  }

  const timestamp = Date.now();
  const humanReadableTimestamp = new Date(timestamp).toISOString();

  const request = context.switchToHttp().getRequest();
  const user = request.user;
  const projectName = user.name;
  const contextConfig = request.context.config;
  const queryParams = JSON.parse(JSON.stringify(request.query));
  const urlParams = request.params;

  const message = {
    timestamp: timestamp,
    humanReadableTimestamp: humanReadableTimestamp,
    projectName,
    url: contextConfig,
    queryParams,
    urlParams,
    httpStatusCode: err.getStatusCode(),
    errorType: err?.getErrorType() ?? '-',
    message: err.internalMessage ?? err.message,
  };

  publishCustomMetric(
    'API_request_monitoring_project',
    [
      {
        property: 'httpError',
        value: 1,
        unit: 'Count',
      },
    ],
    [{ name: 'projectName', value: projectName }]
  );

  expectedErrorLog.error(message);
};

export const publishCustomMetric = async (
  nameSpace: string,
  values: {
    property: string;
    value: any;
    unit: string;
  }[],
  dimensions?: { name: string; value: string }[]
): Promise<void> => {
  const commandPayload = {
    MetricData: [],
    Namespace: nameSpace,
  };

  values.forEach(({ property, value, unit }) => {
    const metric = {
      MetricName: property,
      Value: value,
      Unit: unit,
    };

    if (dimensions) {
      dimensions.forEach(({ name, value }) => {
        metric['Dimensions'] = metric['Dimensions'] ?? [];
        metric['Dimensions'].push({
          Name: name,
          Value: value,
        });
      });
    }

    commandPayload.MetricData.push(metric);
  });

  const command = new PutMetricDataCommand(commandPayload);
  const [err] = await useTryAsync(() => cloudWatchClient.send(command));
  if (err) {
    console.error('Error sending metrics with following payload:');
    console.error(JSON.stringify(commandPayload, null, 2));
    console.error(JSON.stringify(err, null, 2));
  }
};

export const sendChargeGptRecommendation = async (
  args: {
    property: string;
    value: any;
    unit: string;
  }[],
  projectName?: string
) => {
  await publishCustomMetric(
    'chargegpt_recommendation',
    args,
    projectName
      ? [
          {
            name: 'projectName',
            value: projectName,
          },
        ]
      : undefined
  );
};

export const sendChargeGptCustomMetric = async (
  nameSpace: string,
  args: {
    property: string;
    value: any;
    unit: string;
  }[],
  dimensions?: {
    name: string;
    value: string;
  }[]
) => {
  const [err] = await useTryAsync(() =>
    publishCustomMetric(nameSpace, args, dimensions)
  );
  if (err) {
    console.error(
      'Error sending custom chargegpt metrics with following payload:'
    );
    console.error(JSON.stringify(err, null, 2));
  }
};
