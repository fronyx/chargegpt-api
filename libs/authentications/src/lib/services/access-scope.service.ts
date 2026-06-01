import { Injectable } from '@nestjs/common';
import { CacheService } from '@fronyx/cache';
import { ToolkitProject, ToolkitsService } from '@fronyx/toolkit';
import { OcpiLocationsService, ToolkitScopedEvsesPrimaryIdsService } from '@fronyx/persistence';
import {
  ToolkitScopedEvsesPrimaryIdsEntity,
} from '../../../../../apps/cdk-apps/src/shared';
import { ECSClient, RunTaskCommand, RunTaskCommandInput } from '@aws-sdk/client-ecs';
import { Project } from '../models/project';
import { cleanId } from '../../../../../apps/cdk-apps/src/shared/database/entities/crawling/ocpi-location.entity';
import { configService } from '@fronyx/configurations';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as Sentry from '@sentry/minimal';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';

@Injectable()
export class AccessScopeService {
  private cachedProject: Record<string, Project> = {};

  constructor(
    private readonly cache: CacheService,
    private readonly toolkitsService: ToolkitsService,
    private readonly ocpiLocationsService: OcpiLocationsService,
    private readonly toolkitScopedEvsesPrimaryIdsService: ToolkitScopedEvsesPrimaryIdsService,
    private readonly http: HttpService,
  ) {
  }

  async initializeScopeDataInDB(): Promise<void> {
    console.log('Getting all projects...');
    const projects = (await this.toolkitsService.getAllProjects())
      .filter(({
                 prediction_frequency,
                 is_availability,
                 is_chargegpt
               }) => prediction_frequency === 'REAL_TIME' || is_availability || is_chargegpt);

    console.log('Getting all scoped ids...');
    const scopedIds = await this.toolkitScopedEvsesPrimaryIdsService.getAllScopedIds();
    const existingPrimaryIds = new Set();
    scopedIds.forEach(({ primary_id }) => existingPrimaryIds.add(primary_id));

    const scopedEvseMap = scopedIds.reduce((acc, val) => {
      acc[val.primary_id] = val;
      return acc;
    }, {} as any);

    for (const project of projects) {
      const locations = await this.ocpiLocationsService.findOcpiLocationsByProjects({ projects: [project] });

      locations.forEach(location => {
        location.evses.forEach(evse => {
          const primaryId = evse.primary_id;

          if (!scopedEvseMap[primaryId]) {
            scopedEvseMap[primaryId] = ToolkitScopedEvsesPrimaryIdsEntity.toEntityFromCreateDto({
              ...evse,
              location_id: location.id,
              is_real_time: false,
              is_availability: false,
              is_chargegpt: false,
            });
          }

          scopedEvseMap[primaryId].is_availability = scopedEvseMap[primaryId].is_availability || (project.isEvseWithinScope(evse) && project.isLocationWithinScope(location) && project.is_availability);
          scopedEvseMap[primaryId].is_chargegpt = scopedEvseMap[primaryId].is_chargegpt || (project.isEvseWithinScope(evse) && project.isLocationWithinScope(location) && project.is_chargegpt);
          scopedEvseMap[primaryId].is_real_time = scopedEvseMap[primaryId].is_real_time || (project.isEvseWithinScope(evse) && project.isLocationWithinScope(location) && project.prediction_frequency === 'REAL_TIME');
        });
      });
    }

    const scopedEvses = Object.values(scopedEvseMap) as ToolkitScopedEvsesPrimaryIdsEntity[];
    scopedEvses.forEach(({ primary_id }: any) => existingPrimaryIds.delete(primary_id));
    const primaryIdsToBeRemoved: string[] = Array.from(existingPrimaryIds) as string[];

    console.log('Storing all scoped ids...');
    await this.toolkitScopedEvsesPrimaryIdsService.saveMany({ scopedEvses });
    console.log('# of evses within projects scope:', scopedEvses.length);

    console.log('Removing removed scoped ids...');
    await this.toolkitScopedEvsesPrimaryIdsService.removeScopedEvsesByPrimaryIds({ primaryIds: primaryIdsToBeRemoved });
    console.log('# of evses removed:', primaryIdsToBeRemoved.length);
  }

  async refreshScopeDataInCacheForAllProjects(): Promise<void> {
    const projects = await this.toolkitsService.getAllProjects();
    for (const project of projects) {
      await this.initializeScopeDataInCache({ apiToken: project.api_token });
    }
  }

  async initializeScopeDataInCache(args: { apiToken }): Promise<void> {
    const existingPrimaryIds = new Set();

    console.log('Initializing scopes data in cache.');

    const toolkitProject = await this.toolkitsService.findProjectByApiToken({ apiToken: args.apiToken });

    console.log(`Loading data for project: ${toolkitProject.id}`);

    const locations = await this.ocpiLocationsService.findOcpiLocationsByProjects({ projects: [toolkitProject] });
    const project = new Project(this.cache, toolkitProject.api_token);
    this.cachedProject[toolkitProject.api_token] = project;
    (await project.getAllMembers()).forEach((id) => existingPrimaryIds.add(id));

    const scopedEvses = locations
      .map(location => {
        const evses = location?.evses.map(evse => ToolkitScopedEvsesPrimaryIdsEntity.toEntityFromCreateDto({
          ...evse,
          location_id: location.id,
          is_real_time: toolkitProject.prediction_frequency === 'REAL_TIME',
          is_availability: toolkitProject.is_availability,
          is_chargegpt: toolkitProject.is_chargegpt,
        })) ?? [];
        return evses;
      })
      .reduce((acc, val) => [].concat(acc, val), []);

    scopedEvses.forEach(({ primary_id, evse_id_stripped, location_id }) => {
      existingPrimaryIds.delete(primary_id);
      existingPrimaryIds.delete(evse_id_stripped);
      existingPrimaryIds.delete(`${location_id}_${evse_id_stripped}`);
      existingPrimaryIds.delete(cleanId(location_id));
    });

    console.log('# of evses within projects scope:', scopedEvses.length);
    const primaryIdsToBeRemoved: string[] = Array.from(existingPrimaryIds) as string[];
    console.log('# of evses removed:', primaryIdsToBeRemoved.length);
    if (primaryIdsToBeRemoved.length > 0) {
      await project.removeKey(primaryIdsToBeRemoved);
    }

    for (const location of locations) {
      await project.addLocation(location);
    }
  }

  async addLocationToProjectScope(args: { location, project: ToolkitProject; }): Promise<void> {
    const project = new Project(this.cache, args.project.api_token);
    await project.addLocation(args.location);
  }

  async removeScopedEvsesFomCache(args: { apiTokens: string[] }): Promise<void> {
    for (const apiToken of args.apiTokens) {
      const project = new Project(this.cache, apiToken);
      await project.deleteKey();
    }
  }

  async getAllScopedPrimaryIds(args: { isRealTime: boolean }): Promise<string[]> {
    const results = await this.toolkitScopedEvsesPrimaryIdsService.getAllPrimaryIds(args.isRealTime);
    return results.map(evse => evse.primary_id);
  }

  async isIdWithinProject(locationId: string, project: ToolkitProject): Promise<boolean> {
    if (!this.cachedProject[project.api_token]) {
      this.cachedProject[project.api_token] = new Project(this.cache, project.api_token);
    }

    return await this.cachedProject[project.api_token].hasId(locationId);
  }

  async initializeScopeData(apiToken: string): Promise<void> {
    await this.initializeScopeDataInDB();
    console.log('Scope data in DB initialization is finished.');

    await this.initializeScopeDataInCache({ apiToken });
    console.log('Scope data in cache initialization is finished.');
  }

  async removeDataOutOfScope(apiTokens: string[]): Promise<void> {
    await this.initializeScopeDataInDB();
    console.log('Scope data in DB initialization is finished.');
    await this.removeScopedEvsesFomCache({ apiTokens });
    console.log('Remove data in cache is finished.');
  }

  async runScopeDataInitializationTask(apiToken: string): Promise<void> {
    console.log('Starting async task for scope data initialization...');

    const client = new ECSClient(configService.getAwsConfigurations());
    const command = new RunTaskCommand(generateEcsCommandInput('SEED_SCOPE', { apiToken }));
    await client.send(command);

    console.log('Async task started.');
  }

  async runRemoveDataOutOfScopeTask(apiTokens: string[]): Promise<void> {
    console.log('Starting async task for remove scoped data...');

    const client = new ECSClient(configService.getAwsConfigurations());
    const command = new RunTaskCommand(generateEcsCommandInput('DELETE_SCOPE', { apiTokens }));
    await client.send(command);
  }

  async removeInvalidLocationsIntoElasticSearchFromDB(): Promise<void> {
    const start = Date.now();

    console.log('Loading all locations from the DB. This may take a while...');

    const locations = await this.ocpiLocationsService.loadAllLocationsWithStatusAndPowerType();
    await this.removeInvalidLocationsFromElasticSearch(locations);

    console.log(`All locations loaded! It took ${Date.now() - start}ms.`);
  }

  async removeInvalidLocationsFromElasticSearch(invalidLocations): Promise<void> {
    for (const location of invalidLocations) {
      try {
        await firstValueFrom(this.http.delete(`http://10.0.68.98:9200/locations-geocoordinates-index-1/_doc/${location.id}`));
      } catch (err) {
        // noop
      }
      await new Promise<void>(resolve => setTimeout(() => resolve(), 100));
    }
  }

  async seedLocationsIntoElasticSearchFromDB(): Promise<void> {
    const start = Date.now();

    console.log('Loading all locations from the DB. This may take a while...');

    const locations = await this.ocpiLocationsService.loadAllLocationsWithStatusAndPowerType();
    console.log(`All locations loaded! It took ${Date.now() - start}ms.`);
    console.log('validLocation.length: ', locations.length);
    console.log('invalidLocation.length: ', locations.length);
    const { validLocations, invalidLocations } = await this.checkTheValidityOfLocations(locations);

    if (validLocations.length > 0) {
      await this.seedValidLocationsIntoElasticSearch(validLocations);
    }

    if (invalidLocations.length > 0) {
      await this.removeInvalidLocationsFromElasticSearch(invalidLocations);
    }
  }

  async checkTheValidityOfLocations(locations): Promise<any> {
    const invalidStatuses = ['INOPERATIVE', 'OUTOFORDER', 'PLANNED', 'REMOVED'];

    // log each location
    locations.forEach(location => {
      const statuses = location.evses.map(evse => evse.status);
      location.is_valid = statuses.filter(status => !invalidStatuses.includes(status)).length > 0;
      location.power_type = Object.keys(location.evses
        .map(({ connectors }) => connectors)
        .reduce((acc, val) => [].concat(acc, val), [])
        .reduce((acc, { power_type }) => {
          acc[power_type] = true;
          return acc;
        }, {}));
    });

    return {
      validLocations: locations.filter(location => location.is_valid),
      invalidLocations: locations.filter(location => !location.is_valid)
    };
  }

  async seedValidLocationsIntoElasticSearch(
    validLocations: {
      id: string;
      id_stripped: string;
      latitude: string;
      longitude: string;
      power_type: string[];
      operator_name: string;
      frk_operator_name: string;
      suboperator_name: string;
      owner_name: string;
    }[]
  ): Promise<void> {
    for (const location of validLocations) {
      let isSuccessfull = false,
        retryCount = 0;

      const operatorNames = [
        ...new Set(
          [
            location.operator_name,
            location.frk_operator_name,
            location.suboperator_name,
            location.owner_name,
          ].filter((name) => !isEmptyString(name))
        ),
      ];

      while (!isSuccessfull) {
        try {
          await firstValueFrom(
            this.http.post(
              `http://10.0.68.98:9200/locations-geocoordinates-index-1/_doc/${location.id}`,
              {
                locationId: location.id,
                strippedId: location.id_stripped,
                location: {
                  lat: Number(location.latitude).toFixed(6),
                  lon: Number(location.longitude).toFixed(6),
                },
                power_type: location.power_type,
                operator_names: operatorNames,
              }
            )
          );
          isSuccessfull = true;
        } catch (err) {
          Sentry.captureException(err);
          isSuccessfull = false;
          retryCount++;
          await new Promise<void>((resolve) =>
            setTimeout(() => resolve(), retryCount * 1000)
          );
        }
      }
    }
  }
}

export const generateEcsCommandInput = (command?: string, payload?: any): RunTaskCommandInput => {
  const environment = [
    {
      name: 'BUILD_TARGET',
      value: 'prod',
    },
  ];

  if (command) {
    environment.push({
      name: 'ASYNC_COMMAND',
      value: command,
    });
  }

  if (payload) {
    environment.push({
      name: 'ASYNC_COMMAND_PAYLOAD',
      value: JSON.stringify(payload),
    });
  }

  return {
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
          environment,
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
      { key: 'async-command', value: command }
    ]
  };
};
