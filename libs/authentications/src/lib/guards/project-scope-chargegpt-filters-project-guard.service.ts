import { ExecutionContext, Injectable } from '@nestjs/common';
import { OcpiLocationsService } from '@fronyx/persistence';
import { BaseProjectScopeGuard } from './base-project-scope.guard';
import { AccessScopeService } from '../services';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import {
  ChargeGPTForbiddenRequestError,
  ChargeGPTInvalidRequestParameterError, ChargeGPTUnauthorizedRequestError,
} from '../../../../../apps/cdk-apps/src/shared';

@Injectable()
export class ProjectScopeChargegptFiltersProjectGuard extends BaseProjectScopeGuard {
  constructor(
    readonly ocpiLocationsService: OcpiLocationsService,
    readonly accessScopeService: AccessScopeService,
  ) {
    super(ocpiLocationsService, accessScopeService);
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    super.canActivate(context);

    const { params, project } = this.getContext(context);

    try {
      if (!project.is_chargegpt || project.is_chargegpt === 'false') {
        throw new ChargeGPTUnauthorizedRequestError('Unauthorized: Invalid API token. Please contact support@example.com for more information.');
      }

      if (project.chargegpt_output_type !== 'filters') {
        throw new ChargeGPTForbiddenRequestError('Missing permission(s) to the following feature(s): Invalid API token. Please contact support@example.com for more information.');
      }

      if (isEmptyString(params.conversationId)) {
        throw new ChargeGPTInvalidRequestParameterError('Missing required query parameter(s): conversationId.');
      }
    } catch (err) {
      this.handleThrownError(err);
    }

    return true;
  }
}

