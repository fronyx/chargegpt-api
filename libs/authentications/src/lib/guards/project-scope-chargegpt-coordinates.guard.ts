import { ExecutionContext, Injectable } from '@nestjs/common';
import { OcpiLocationsService } from '@fronyx/persistence';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { ChargeGPTInvalidRequestParameterError } from '../../../../../apps/cdk-apps/src/shared';
import { BaseProjectScopeGuard } from './base-project-scope.guard';
import { AccessScopeService } from '../services';

@Injectable()
export class ProjectScopeChargegptCoordinatesGuard extends BaseProjectScopeGuard {
  constructor(
    readonly ocpiLocationsService: OcpiLocationsService,
    readonly accessScopeService: AccessScopeService,
  ) {
    super(ocpiLocationsService, accessScopeService);
  }

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { body } = request;

    try {
      if (body?.currentCoordinates) {
        if (isObjectEmpty(body.currentCoordinates) || isEmptyString(body.currentCoordinates?.lat) || isEmptyString(body.currentCoordinates?.lng)) {
          throw new ChargeGPTInvalidRequestParameterError('Unsupported value(s) for properties in the request body: currentCoordinates. Accepted value(s): latitude [-90, 90], longitude [-180, 180].');
        }
        const lat = Number(body.currentCoordinates.lat);
        const lng = Number(body.currentCoordinates.lng);

        if (isNaN(lat) || isNaN(lng)) {
          throw new ChargeGPTInvalidRequestParameterError('Unsupported value(s) for properties in the request body: currentCoordinates. Accepted value(s): latitude [-90, 90], longitude [-180, 180].');
        }

        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            throw new ChargeGPTInvalidRequestParameterError('Unsupported value(s) for properties in the request body: currentCoordinates. Accepted value(s): latitude [-90, 90], longitude [-180, 180].');
          }
          request.body.currentCoordinates = { lat, lng };
        }

      if (!isEmptyString(body?.deniedContext) && body?.deniedContext !== 'Location') {
        throw new ChargeGPTInvalidRequestParameterError('Unsupported value(s) for properties in the request body: deniedContext. Accepted value(s): \'Location\'');
      }
    } catch (err) {
      this.handleThrownError(err);
    }

    return true;
  }
}