import { OcpiLocationsService } from '@fronyx/persistence';
import { Injectable } from '@nestjs/common';
import { AccessScopeService } from '@fronyx/authentications';
import { ECSClient, RunTaskCommand, RunTaskCommandInput } from '@aws-sdk/client-ecs';
import { configService } from '@fronyx/configurations';
import { EvseStatusCacheKey } from '../../../../cdk-apps/src/shared/models/cache/evse-status-cache-key';
import { CacheService } from '@fronyx/cache';

export interface InternalCommand {
  command: string;
  payload: any;
}

@Injectable()
export class InternalProcessService {
  constructor(
    private readonly accessScopeService: AccessScopeService,
    private readonly ocpiLocationsService: OcpiLocationsService,
    private readonly cache: CacheService,
  ) {
  }

  async executeAsyncCommand(command: string, payload: any): Promise<any> {
    if (command === 'SEED_SCOPE') {
      const { apiToken } = JSON.parse(payload);
      await this.triggerInitializationOfScopeData(apiToken);
    }

    if (command === 'START_STAGING') {
      await this.startStagingBackendApi();
    }

    if (command === 'DELETE_SCOPE') {
      const { apiTokens } = JSON.parse(payload);

      await this.triggerRemoveOutOfScopeData(apiTokens);
    }

    return { isTerminate: true };
  }

  async triggerInitializationOfScopeData(apiToken: string): Promise<void> {
    await this.accessScopeService.initializeScopeData(apiToken);
  }

  async triggerRemoveOutOfScopeData(apiTokens: string[]): Promise<void> {
    await this.accessScopeService.removeDataOutOfScope(apiTokens);
  }

  async startStagingBackendApi(): Promise<void> {
    console.log('Starting async task for starting staging backend api...');

    const client = new ECSClient(configService.getAwsConfigurations());
    const input: RunTaskCommandInput = {
      cluster: process.env.ASYNC_ECS_CLUSTER_ARN ?? 'arn:aws:ecs:region:account-id:cluster/example',
      count: 1,
      enableECSManagedTags: true,
      launchType: 'FARGATE',
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: (process.env.ASYNC_ECS_SUBNET_IDS ?? 'subnet-example').split(','),
          securityGroups: (process.env.ASYNC_ECS_SECURITY_GROUP_IDS ?? 'sg-example').split(','),
          assignPublicIp: 'DISABLED',
        },
      },
      overrides: {
        cpu: '2048',
        memory: '4096',
        containerOverrides: [
          {
            name: 'web',
            environment: [
              {
                name: 'BUILD_TARGET',
                value: 'staging',
              },
            ],
          },
        ],
        executionRoleArn: process.env.ASYNC_ECS_EXECUTION_ROLE_ARN,
        taskRoleArn: process.env.ASYNC_ECS_TASK_ROLE_ARN,
        ephemeralStorage: {
          sizeInGiB: 21,
        },
      },
      startedBy: 'internalprocessservice',
      taskDefinition: process.env.ASYNC_ECS_TASK_DEFINITION_ARN ?? 'arn:aws:ecs:region:account-id:task-definition/example',
      tags: [
        { key: 'async-command', value: 'START_STAGING' }
      ]
    };
    const command = new RunTaskCommand(input);
    const commandOutput = await client.send(command);

    console.log('Async task started.');
    console.log(JSON.stringify(commandOutput));
  }

  async seedEvseStatusesIntoCache(): Promise<void> {
    const locations = await this.ocpiLocationsService.loadAllLocationsWithStatusAndPowerType();

    for (const location of locations) {
      for (const evse of location.evses) {
        const locationId = location.id;
        await this.cache.hSet(EvseStatusCacheKey.create({ locationId: locationId }).value, evse.primary_id, evse.status);
      }
    }
  }
}
