import { ExecutionContext, Injectable } from '@nestjs/common';
import { OcpiLocationsService } from '@fronyx/persistence';
import { AccessScopeService } from '../services';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { BaseProjectScopeGuard } from './base-project-scope.guard';
import { ChargeGPTInvalidRequestParameterError } from '../../../../../apps/cdk-apps/src/shared';
import { differenceInMinutes, isValid } from 'date-fns';

@Injectable()
export class ProjectScopeChargegptTimestampGuard extends BaseProjectScopeGuard {
  constructor(
    readonly ocpiLocationsService: OcpiLocationsService,
    readonly accessScopeService: AccessScopeService
  ) {
    super(ocpiLocationsService, accessScopeService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.context = context;

    const { query } = this.getContext(context);

    try {
      const requiredParameters = ['currentTimestamp', 'timezoneOffset'];

      if (requiredParameters.some((val) => isEmptyString(query[val]))) {
        const missingQueryParameters = requiredParameters.filter((val) =>
          isEmptyString(query[val])
        );
        const errorMessage = `Missing required query parameter(s): ${missingQueryParameters.join(
          ', '
        )}.`;

        if (missingQueryParameters.length > 0) {
          throw new ChargeGPTInvalidRequestParameterError(errorMessage);
        }
      }

      const validTimestamp = [
        new Date(Number(query.currentTimestamp)),
        new Date(query.currentTimestamp),
      ].find(isValid);
      if (!validTimestamp) {
        throw new ChargeGPTInvalidRequestParameterError(
          'Invalid currentTimestamp value provided. Expected value is LINUX timestamp in milliseconds.'
        );
      }

      if (!isDateWithinRange(query.currentTimestamp)) {
        throw new ChargeGPTInvalidRequestParameterError(
          'Invalid currentTimestamp value provided.'
        );
      }
    } catch (err) {
      this.handleThrownError(err);
    }

    return true;
  }
}

export const isDateWithinRange = (currentTimestamp: string): boolean => {
  const validTimestampDate = [
    new Date(Number(currentTimestamp)),
    new Date(currentTimestamp),
  ].find(isValid);

  if (!validTimestampDate) {
    return false;
  }

  const now = new Date();
  return Math.abs(differenceInMinutes(now, validTimestampDate)) <= 15;
};
