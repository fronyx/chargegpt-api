import { ExecutionContext, Injectable } from '@nestjs/common';
import { OcpiLocationsService } from '@fronyx/persistence';
import { BaseProjectScopeGuard } from './base-project-scope.guard';
import { ChargeGPTForbiddenRequestError } from '../../../../../apps/cdk-apps/src/shared';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { AccessScopeService } from '../services';

@Injectable()
export class ProjectScopeChargegptDomainGuard extends BaseProjectScopeGuard {
  constructor(
    readonly ocpiLocationsService: OcpiLocationsService,
    readonly accessScopeService: AccessScopeService,
  ) {
    super(ocpiLocationsService, accessScopeService);
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const { headers, project } = this.getContext(context);
    const acceptedUrls: string[] | undefined = project?.chargegpt_accepted_urls;
    const referer = headers['referer'] ?? headers['origin'];

    if (isObjectEmpty(acceptedUrls)) {
      return true;
    }

    if (!acceptedUrls.some(url => url.includes(referer))) {
      this.handleThrownError(new ChargeGPTForbiddenRequestError('Missing permission(s) to the following feature(s): Invalid API token. Please contact support@example.com for more information.'));
    }

    return true;
  }
}

