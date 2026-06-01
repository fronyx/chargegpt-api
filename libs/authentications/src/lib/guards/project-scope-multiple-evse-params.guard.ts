import {
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { OcpiLocationsService } from '@fronyx/persistence';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { BaseProjectScopeGuard } from './base-project-scope.guard';
import { AccessScopeService } from '../services';
import {
  OcpiEvseEntity,
  InvalidRequestParameterError,
  ForbiddenRequestError
} from '../../../../../apps/cdk-apps/src/shared';
import { EvsesService, LocationsService } from '@fronyx/predictions';

@Injectable()
export class ProjectScopeMultipleEvseParamsGuard extends BaseProjectScopeGuard {
  constructor(
    readonly ocpiLocationsService: OcpiLocationsService,
    readonly accessScopeService: AccessScopeService,
    readonly evsesService: EvsesService,
    readonly locationsService: LocationsService,
  ) {
    super(ocpiLocationsService, accessScopeService);
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    this.context = context;

    const { project, params, query } = this.getContext(context);
    const requiredProperties = ['evseIds', 'locationIdsEvseIds', 'locationIdsUids'];
    const optionalProperties = ['timeframe'];
    const filteredIds = [];

    try {
      if (!isObjectEmpty(params)) {
        throw new InvalidRequestParameterError('URL params are not supported for this endpoint.');
      }

      if (!isEmptyString(query.timeframe)) {
        if (!this.validateTimeframeWithinProject(Number(query.timeframe), project)) {
          const maxTimeFrameInHour = Number(project.max_timeframe) / 60;
          throw new ForbiddenRequestError(`Your plan doesn't allow to access predictions more than ${maxTimeFrameInHour} hours ahead. Please check with your administrator.`);
        }
      }

      if (this.isMissingRequiredProperties([requiredProperties[0]], query)
        && this.isMissingRequiredProperties([requiredProperties[1]], query)
        && this.isMissingRequiredProperties([requiredProperties[2]], query)
      ) {
        throw new InvalidRequestParameterError('Invalid query parameter. Supported query parameters: evseIds OR locationIdsEvseIds OR locationIdsUids.');
      }

      if (this.isContainUnsupportedProperties([...requiredProperties, ...optionalProperties], query)) {
        throw new InvalidRequestParameterError('Invalid query parameter. Only either one of evseIds OR locationIdsEvseIds OR locationIdsUids are supported.');
      }

      if (isEmptyString(query.locationIdsEvseIds) && isEmptyString(query.evseIds) && isEmptyString(query.locationIdsUids)) {
        throw new InvalidRequestParameterError('Invalid query parameter. No locationIdsEvseIds OR evseIds OR locationIdsUids is provided.');
      }

      if (!isEmptyString(query.locationIdsEvseIds)) {
        const locationIdsEvseIds = query.locationIdsEvseIds.split(',').filter(val => !isEmptyString(val));

        for (const locationIdEvseId of locationIdsEvseIds) {
          const locationId = locationIdEvseId.split('_')[0];
          const evseId = OcpiEvseEntity.cleanEvseId(locationIdEvseId.split('_')[1]);

          if (await this.accessScopeService.isIdWithinProject(locationId + '_' + evseId, project)) {
            filteredIds.push(locationIdEvseId);
          }
        }

        if (filteredIds.length < 1) {
          const locationId = locationIdsEvseIds[0].split('_')[0];
          const evseId = locationIdsEvseIds[0].split('_')[1];

          await this.evsesService.findEvseByEvseIdInDB({ evseId });

          throw new ForbiddenRequestError(`Your plan doesn't allow access to the requested ID. ${locationId}_${evseId}`);
        } else {
          query.locationIdsEvseIds = filteredIds.toString();
        }
      } else if (!isEmptyString(query.evseIds)) {
        const evseIds = query.evseIds.split(',').filter(val => !isEmptyString(val));

        for (const evseId of evseIds) {
          if (await this.accessScopeService.isIdWithinProject(OcpiEvseEntity.cleanEvseId(evseId), project)) {
            filteredIds.push(evseId);
          }
        }

        if (filteredIds.length < 1) {
          await this.evsesService.findEvseByEvseIdInDB({ evseId: evseIds[0] });

          throw new ForbiddenRequestError(`Your plan doesn't allow access to the requested ID. ${evseIds[0]}`);
        } else {
          query.evseIds = filteredIds.toString();
        }
      } else if (!isEmptyString(query.locationIdsUids)) {
        const locationIdsUids = query.locationIdsUids.split(',').filter(val => !isEmptyString(val));

        for (const locationIdUid of locationIdsUids) {
          if (await this.accessScopeService.isIdWithinProject(locationIdUid, project)) {
            filteredIds.push(locationIdUid);
          }
        }

        if (filteredIds.length < 1) {
          const locationId = locationIdsUids[0].split('_')[0];
          const uid = locationIdsUids[0].split('_')[1];

          await this.evsesService.findEvseByLocationIdUidInDB({ locationId, uid });

          throw new ForbiddenRequestError(`Your plan doesn't allow access to the requested ID. ${locationId}_${uid}`);
        } else {
          query.locationIdsUids = filteredIds.toString();
        }
      }
    } catch (err) {
      this.handleThrownError(err);
    }

    if (!isEmptyString(query.locationIdsEvseIds)) {
      query.locationIdsEvseIds = filteredIds.toString();
    } else if (!isEmptyString((query.evseIds))) {
      query.evseIds = filteredIds.toString();
    } else if (!isEmptyString(query.locationIdsUids)) {
      query.locationIdsUids = filteredIds.toString();
    }
    return true;
  }
}
