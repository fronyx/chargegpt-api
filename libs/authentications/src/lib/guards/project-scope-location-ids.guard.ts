import { ExecutionContext, Injectable } from '@nestjs/common';
import { OcpiLocationsService } from '@fronyx/persistence';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { BaseProjectScopeGuard } from './base-project-scope.guard';
import { AccessScopeService } from '../services';
import { InvalidRequestParameterError, ForbiddenRequestError } from '../../../../../apps/cdk-apps/src/shared/';
import { LocationsService } from '@fronyx/predictions';

@Injectable()
export class ProjectScopeLocationIdsGuard extends BaseProjectScopeGuard {
  constructor(
    readonly ocpiLocationsService: OcpiLocationsService,
    readonly accessScopeService: AccessScopeService,
    readonly locationsService: LocationsService,
  ) {
    super(ocpiLocationsService, accessScopeService);
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    this.context = context;

    const { project, params, query } = this.getContext(context);
    const requiredProperties = ['locationIds'];
    const optionalProperties = ['timeframe'];
    const filteredIds = [];

    try {
      if (!isObjectEmpty(params)) {
        throw new InvalidRequestParameterError('Invalid query parameter. URL params are not supported for this endpoint.');
      }

      if (!isEmptyString(query.timeframe)) {
        if (!this.validateTimeframeWithinProject(Number(query.timeframe), project)) {
          const maxTimeFrameInHour = Number(project.max_timeframe) / 60;
          throw new ForbiddenRequestError(`Your plan doesn't allow to access predictions more than ${maxTimeFrameInHour} hours ahead. Please check with your administrator.`);
        }
      }

      if (this.isMissingRequiredProperties(requiredProperties, query) || isEmptyString(query.locationIds)) {
        throw new InvalidRequestParameterError('Invalid query parameters. No locationIds provided.');
      }

      if (this.isContainUnsupportedProperties([...requiredProperties, ...optionalProperties], query)) {
        throw new InvalidRequestParameterError('Invalid query parameter. Only locationIds and timeframe are supported.');
      }

      const locationIds = query.locationIds.replace(/\s+/g, '').split(',');

      for (let i = 0; i < locationIds.length; i++) {
        const locationId = locationIds[i];
        if (await this.accessScopeService.isIdWithinProject(locationId, project)) {
          filteredIds.push((locationId));
        }
      }

      if (filteredIds.length < 1) {
        await this.locationsService.getById(locationIds[0]);

        throw new ForbiddenRequestError(`Your plan doesn't allow access to the requested ID. ${locationIds[0]}`);
      } else {
        query.locationIds = filteredIds.toString();
      }
    } catch (err) {
      this.handleThrownError(err);
    }
    return true;
  }
}
