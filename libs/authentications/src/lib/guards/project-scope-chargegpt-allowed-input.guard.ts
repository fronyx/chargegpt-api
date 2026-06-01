import { ExecutionContext, Injectable } from '@nestjs/common';
import { OcpiLocationsService } from '@fronyx/persistence';
import { AccessScopeService } from '../services';
import {
  ChargeGPTForbiddenRequestError,
  ChargeGPTInvalidRequestParameterError,
} from '../../../../../apps/cdk-apps/src/shared';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { BaseProjectScopeGuard } from './base-project-scope.guard';

@Injectable()
export class ProjectScopeChargegptAllowedInputGuard extends BaseProjectScopeGuard {
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

    this.context = context;

    const { project, query } = this.getContext(context);

    try {
      if (project.chargegpt_allowed_input !== 'text_voice') {
        throw new ChargeGPTForbiddenRequestError('Missing permission(s) to the following feature(s): User don\'t have access to the voice feature. Please contact support@example.com for more information.');
      }

      if (isEmptyString(query.fileId)) {
        throw new ChargeGPTInvalidRequestParameterError('Missing required query parameter(s): fileId.');
      }
    } catch (err) {
      this.handleThrownError(err);
    }

    return true;
  }
}

