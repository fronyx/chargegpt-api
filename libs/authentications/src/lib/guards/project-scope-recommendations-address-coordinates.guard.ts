import { ExecutionContext, Injectable } from '@nestjs/common';
import { OcpiLocationsService } from '@fronyx/persistence';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { RecommendationInternalServerError } from '../../../../../apps/cdk-apps/src/shared';
import { BaseProjectScopeGuard } from './base-project-scope.guard';
import { AccessScopeService } from '../services';

@Injectable()
export class ProjectScopeRecommendationsAddressCoordinatesGuard extends BaseProjectScopeGuard {
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
        if (!isEmptyString(body.address) && !isObjectEmpty(body.coordinates)) {
          throw new RecommendationInternalServerError('Unsupported value(s) for properties in the request body: address or coordinates. Please provide either address or coordinates.');
        } else if (isEmptyString(body.address) && !isObjectEmpty(body.coordinates)) {
          const lat = Number(body.coordinates.lat);
          const lng = Number(body.coordinates.lng);

          if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            throw new RecommendationInternalServerError('Unsupported value(s) for properties in the request body: coordinates. Accepted value(s): latitude [-90, 90], longitude [-180, 180].');
          }
          request.body.coordinates = { lat, lng };
        }
      }
    } catch (err) {
      this.handleThrownError(err);
    }

    return true;
  }
}
