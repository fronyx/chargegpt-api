import { ExecutionContext, Injectable } from '@nestjs/common';
import { OcpiLocationsService } from '@fronyx/persistence';
import { AccessScopeService } from '../services';
import { ForbiddenRequestError } from '../../../../../apps/cdk-apps/src/shared';
import { BaseProjectScopeGuard } from './base-project-scope.guard';

@Injectable()
export class ProjectScopeChargegptAllowedOutputGuard extends BaseProjectScopeGuard {
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

    const { project } = this.getContext(context);

    try {
      if (project.chargegpt_allowed_output !== 'text_voice') {
        throw new ForbiddenRequestError('User don\'t have access to the voice feature.');
      }
    } catch (err) {
      this.handleThrownError(err);
    }

    return true;
  }
}
