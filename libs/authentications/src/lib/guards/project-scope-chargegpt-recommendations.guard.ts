import { ExecutionContext, Injectable } from '@nestjs/common';
import { BaseProjectScopeGuard } from './base-project-scope.guard';
import { AccessScopeService } from '../services';
import {
  ChargeGPTForbiddenRequestError,
} from '../../../../../apps/cdk-apps/src/shared';
import { OcpiLocationsService } from '@fronyx/persistence';

@Injectable()
export class ProjectScopeChargegptRecommendationsGuard extends BaseProjectScopeGuard {
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

    const { project } = this.getContext(context);

    try {
      if (project.chargegpt_output_type !== 'recommendations') {
        throw new ChargeGPTForbiddenRequestError('Missing permission(s) to the following feature(s): Invalid API token. Please contact support@example.com for more information.');
      }
    } catch (err) {
      this.handleThrownError(err);
    }

    return true;
  }
}

