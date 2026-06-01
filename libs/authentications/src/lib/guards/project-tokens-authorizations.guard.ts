import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { ProjectsService } from '@fronyx/toolkit';

@Injectable()
export class ProjectTokensAuthorizationsGuard implements CanActivate {
  constructor(
    private readonly projectsService: ProjectsService,
  ) {

  }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;

    if (headers['x-api-token']) {
      let project;

      try {
        project = await this.projectsService.getProjectByApiToken(headers['x-api-token']);
      } catch (err) {
        console.log(`Error getting projects by api token by the request header x-api-token: ${headers['x-api-token']}`);
        console.error(JSON.stringify(err));
        return false;
      }

      if (!project) {
        return false;
      }

      request.user = project;
    } else {
      return false;
    }

    return true;
  }
}