import { ExecutionContext, Injectable } from '@nestjs/common';
import { OcpiLocationsService } from '@fronyx/persistence';
import { AccessScopeService } from '../services';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { ChargeGPTInvalidRequestParameterError } from '../../../../../apps/cdk-apps/src/shared';
import { BaseProjectScopeGuard } from './base-project-scope.guard';

@Injectable()
export class ProjectScopeChargegptFeedbackGuard extends BaseProjectScopeGuard {
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
    const { query, body } = request;

    try {
      if (isEmptyString(query.feedback) && isObjectEmpty(body)) {
        throw new ChargeGPTInvalidRequestParameterError('Missing required properties in the request body: rating. Accepted value(s): [\'+1\', \'-1\'].');
      } else {
        if (!isObjectEmpty(body)) {
          const rating = body.rating ?? query.feedback;
          const parsedRating = Number(rating);

          const errorMessage = `Unsupported value(s) for properties in the request body: rating. Accepted value(s): ['+1', '-1']. Given values: ${rating}`;
          const error = new ChargeGPTInvalidRequestParameterError(errorMessage);

          if (isNaN(parsedRating) && !body.text) {
            throw error;
          } else if (![1, -1].includes(parsedRating)) {
            throw error;
          }

          request.body = {
            rating: parsedRating,
            text: body.text ?? '',
            responseId: body.responseId ?? '',
          };
        } else {
          const parsedRating = Number(query.feedback);

          const errorMessage = `Unsupported value(s) for query parameter(s): feedback. Accepted value(s): ['+1', '-1']. Given values: ${query.feedback}`;
          const error = new ChargeGPTInvalidRequestParameterError(errorMessage);

          if (isNaN(parsedRating) || ![1, -1].includes(parsedRating)) {
            throw error;
          }

          request.body = {
            rating: parsedRating,
            text: '',
            responseId: body.responseId ?? '',
          };
        }
      }
    } catch (err) {
      this.handleThrownError(err);
    }

    return true;
  }
}
