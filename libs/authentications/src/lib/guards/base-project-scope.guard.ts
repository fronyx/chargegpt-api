import { OcpiLocationsService } from '@fronyx/persistence';
import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { isExpectedError } from '../../../../../apps/cdk-apps/src/shared';
import { AccessScopeService } from '../services';
import { sendExpectedErrorLogs } from '@fronyx/cloudwatch-logger';

@Injectable()
export class BaseProjectScopeGuard implements CanActivate {
  protected cachedRequest: {
    [key: string]: {
      lastUpdated: number;
      locations: {
        [key: string]: {
          id: string;
          evses: {
            evse_id: string;
            uid: string;
            primary_id: string;
          }[]
        }
      };
    };
  } = {};

  protected context: ExecutionContext;

  constructor(
    readonly ocpiLocationsService: OcpiLocationsService,
    readonly accessScopeService: AccessScopeService,
  ) {
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    this.context = context;
    return true;
  }

  getContext(context) {
    const request = context.switchToHttp().getRequest();
    return {
      project: request.user,
      params: request.params,
      query: request.query,
      body: request.body,
      headers: request.headers,
    };
  }

  validateTimeframeWithinProject(timeframe: number, project): boolean {
    return Number(timeframe) <= Number(project.max_timeframe);
  }

  isMissingRequiredProperties(properties: string[], query: Record<string, string>) {
    const keySet = new Set();
    Object.keys(query).forEach(key => keySet.add(key));
    return properties.some(key => !keySet.has(key));
  }

  isContainUnsupportedProperties(properties: string[], query: Record<string, string>) {
    const keySet = new Set();
    properties.forEach(key => keySet.add(key));
    return Object.keys(query).some(key => !keySet.has(key));
  }

  handleThrownError(err: any): void {
    let error = err;

    if (isExpectedError(err) && err.getPublicError) {
      error = err.getPublicError();
      sendExpectedErrorLogs(this.context, err);
    }

    console.error(error.message);

    throw error;
  }
}