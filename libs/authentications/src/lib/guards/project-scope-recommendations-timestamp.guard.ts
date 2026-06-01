import { ExecutionContext, Injectable } from '@nestjs/common';
import { OcpiLocationsService } from '@fronyx/persistence';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { RecommendationInternalServerError } from '../../../../../apps/cdk-apps/src/shared';
import { BaseProjectScopeGuard } from './base-project-scope.guard';
import { AccessScopeService } from '../services';

@Injectable()
export class ProjectScopeRecommendationsTimestampGuard extends BaseProjectScopeGuard {
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
        body.timestamp = Number(body.timestamp);

        if (isNaN(body.timestamp)) {
          throw new RecommendationInternalServerError('Unsupported value(s) for properties in the request body: timestamp.');
        }
      }
    } catch (err) {
      this.handleThrownError(err);
    }

    return true;
  }
}
