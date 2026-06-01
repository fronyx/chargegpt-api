import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-unique-token';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ToolkitProject, ToolkitsService } from '@fronyx/toolkit';

@Injectable()
export class ApiTokenStrategy extends PassportStrategy(Strategy, 'apiToken') {
  constructor(
    private readonly toolkitService: ToolkitsService,
  ) {
    super({ tokenHeader: 'x-api-token', failOnMissing: true });
  }

  async validate(token: string): Promise<ToolkitProject> {
    const tokenEntity = await this.toolkitService.findProjectByApiToken({ apiToken: token });

    if (!tokenEntity) {
      throw new UnauthorizedException();
    }

    return tokenEntity;
  }
}
