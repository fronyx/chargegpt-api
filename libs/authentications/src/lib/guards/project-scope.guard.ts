import { ExecutionContext, Injectable } from '@nestjs/common';
import { OcpiLocationsService } from '@fronyx/persistence';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { BaseProjectScopeGuard } from './base-project-scope.guard';
import { AccessScopeService } from '../services';
import { isNull } from '../../../../../apps/cdk-apps/src/shared/utils/is-null.function';
import {
  OcpiEvseEntity,
  InvalidRequestParameterError,
  ForbiddenRequestError
} from '../../../../../apps/cdk-apps/src/shared';
import { EvsesService, LocationsService } from '@fronyx/predictions';

@Injectable()
export class ProjectScopeGuard extends BaseProjectScopeGuard {
  constructor(
    readonly ocpiLocationsService: OcpiLocationsService,
    readonly accessScopeService: AccessScopeService,
    readonly locationsService: LocationsService,
    readonly evsesService: EvsesService,
  ) {
    super(ocpiLocationsService, accessScopeService);
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    this.context = context;

    const { project, params, query } = this.getContext(context);

    try {
      if (isObjectEmpty(params)) {
        throw new InvalidRequestParameterError('Missing URL parameters');
      }

      if (!isNull(query.timeframe)) {
        if (!this.validateTimeframeWithinProject(Number(query.timeframe), project)) {
          const maxTimeFrameInHour = Number(project.max_timeframe) / 60;
          throw new ForbiddenRequestError(`Your plan doesn't allow to access predictions more than ${maxTimeFrameInHour} hours ahead. Please check with your administrator.`);
        }
      }

      if (isNull(params.locationId)) {
        throw new InvalidRequestParameterError('Missing locationId from URL parameters.');
      }

      if (!isNull(params.locationId) && isNull(params.uid) && isNull(params.evseId)) {
        if (!(await this.accessScopeService.isIdWithinProject(params.locationId, project))) {
          await this.locationsService.getById(params.locationId);

          throw new ForbiddenRequestError(`Your plan doesn't allow access to the requested ID. ${params.locationId}`);
        }
      } else {
        if (!isNull(params.evseId)) {
          if (!(await this.accessScopeService.isIdWithinProject(`${params.locationId}_${OcpiEvseEntity.cleanEvseId(params.evseId)}`, project))) {
            await this.evsesService.findEvseByEvseIdInDB({ evseId: params.evseId });

            throw new ForbiddenRequestError(`Your plan doesn't allow access to the requested ID ${params.locationId}_${params.evseId}`);
          }
        } else {
          if (!(await this.accessScopeService.isIdWithinProject(`${params.locationId}_${params.uid}`, project))) {
            await this.evsesService.findEvseByLocationIdUidInDB({ locationId: params.locationId, uid: params.uid });

            throw new ForbiddenRequestError(`Your plan doesn't allow access to the requested ID ${params.locationId}_${params.uid}`);
          }
        }
      }
    } catch (err) {
      this.handleThrownError(err);
    }

    return true;
  }
}
