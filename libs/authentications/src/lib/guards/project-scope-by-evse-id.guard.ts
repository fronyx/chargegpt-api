import { ExecutionContext, Injectable } from '@nestjs/common';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { OcpiLocationsService } from '@fronyx/persistence';
import { BaseProjectScopeGuard } from './base-project-scope.guard';
import { AccessScopeService } from '../services';
import {
  OcpiEvseEntity,
  InvalidRequestParameterError,
  ForbiddenRequestError
} from '../../../../../apps/cdk-apps/src/shared';
import { isNull } from '../../../../../apps/cdk-apps/src/shared/utils/is-null.function';
import { EvsesService } from '@fronyx/predictions';

@Injectable()
export class ProjectScopeByEvseIdGuard extends BaseProjectScopeGuard {
  constructor(
    readonly ocpiLocationsService: OcpiLocationsService,
    readonly accessScopeService: AccessScopeService,
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
      if (isObjectEmpty(params) || isEmptyString(params.evseId)) {
        throw new InvalidRequestParameterError('Invalid query parameter. EVSE id is missing.');
      }

      if (!isNull(query.timeframe)) {
        if (!this.validateTimeframeWithinProject(Number(query.timeframe), project)) {
          const maxTimeFrameInHour = Number(project.max_timeframe) / 60;
          throw new ForbiddenRequestError(`Your plan doesn't allow to access predictions more than ${maxTimeFrameInHour} hours ahead. Please check with your administrator.`);
        }
      }

      if (!(await this.accessScopeService.isIdWithinProject(OcpiEvseEntity.cleanEvseId(params.evseId), project))) {
        await this.evsesService.findEvseByEvseIdInDB({ evseId: params.evseId });

        throw new ForbiddenRequestError(`Your plan doesn't allow access to the requested key: ${params.evseId}`);
      }
    } catch (err) {
      this.handleThrownError(err);
    }

    return true;
  }
}
