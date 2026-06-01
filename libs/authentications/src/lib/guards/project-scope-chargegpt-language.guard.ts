import { ExecutionContext, Injectable } from '@nestjs/common';
import { OcpiLocationsService } from '@fronyx/persistence';
import { AccessScopeService } from '../services';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { BaseProjectScopeGuard } from './base-project-scope.guard';
import {
  ChargeGPTForbiddenRequestError,
  ChargeGPTInvalidRequestParameterError
} from '../../../../../apps/cdk-apps/src/shared';

@Injectable()
export class ProjectScopeChargegptLanguageGuard extends BaseProjectScopeGuard {
  constructor(
    readonly ocpiLocationsService: OcpiLocationsService,
    readonly accessScopeService: AccessScopeService,
  ) {
    super(ocpiLocationsService, accessScopeService);
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    this.context = context;

    const { project, query } = this.getContext(context);

    try {
      if (!project.is_chargegpt || project.is_chargegpt === 'false') { //TODO need to move this somewhere as we can't use ProjectScopeChargegptConversationIdGuard
        throw new ChargeGPTForbiddenRequestError('Missing permission(s) to the following feature(s): Invalid API token. Please contact support@example.com for more information.');
      }

      if (!query.language || isEmptyString(query.language)) {
        throw new ChargeGPTInvalidRequestParameterError('Missing required query parameter(s): language.');
      }

      const supportedLanguages = project.chargegpt_languages;
      if (project.chargegpt_languages.includes('cz')) {
        supportedLanguages.push('cs');
      }

      if (!supportedLanguages.includes(query.language)) {
        throw new ChargeGPTForbiddenRequestError(`Missing permission(s) to the following feature(s): ${query.language} language. Please contact support@example.com for more information.`);
      }
    } catch (err) {
      this.handleThrownError(err);
    }

    return true;
  }
}

