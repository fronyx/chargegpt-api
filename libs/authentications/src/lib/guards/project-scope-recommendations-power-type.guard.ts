import { ExecutionContext, Injectable } from '@nestjs/common';
import { OcpiLocationsService } from '@fronyx/persistence';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { RecommendationInternalServerError } from '../../../../../apps/cdk-apps/src/shared';
import { BaseProjectScopeGuard } from './base-project-scope.guard';
import { AccessScopeService } from '../services';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';

@Injectable()
export class ProjectScopeRecommendationsPowerTypeGuard extends BaseProjectScopeGuard {
  constructor(
    readonly ocpiLocationsService: OcpiLocationsService,
    readonly accessScopeService: AccessScopeService,
  ) {
    super(ocpiLocationsService, accessScopeService);
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { body } = request;

    try {
      if (isObjectEmpty(body)) {
        throw new RecommendationInternalServerError('Missing required properties in the request body: timestamp, address or coordinates, or powerType.');
      } else {
        if (!isEmptyString(body.powerType)) {
          if (!['ac', 'dc'].includes(body.powerType.toLowerCase())) {
            throw new RecommendationInternalServerError('Unsupported value(s) for properties in the request body: powerType. Accepted value(s): [\'AC\', \'DC\'].');
          }
          body.powerType = body.powerType.toUpperCase();
        }
      }
    } catch (err) {
      this.handleThrownError(err);
    }

    return true;
  }
}
