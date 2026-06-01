import { Controller, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../../../sentry/sentry.interceptor';
import { UtilisationsRadarService } from './services/utilisations-radar.service';
import { UtilisationGroup } from '../../../cdk-apps/src/shared/models/general/utilisation-group.interface';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@UseInterceptors(SentryInterceptor)
@Controller('utilisations-radar')
export class UtilisationsRadarController {
  constructor(
    private readonly utilisationsRadarService: UtilisationsRadarService,
  ) {
  }

  @Post('reports')
  processUtilisationsRadarReport(): void {
    this.utilisationsRadarService.processUtilisationForEachGroup().then();
  }

  @Get('utilised-groups')
  async processUtilisationRadar(@Query() queryParams: any): Promise<UtilisationGroup[]> {
    return await this.utilisationsRadarService.getUtilisedGroup({ timeframe: Number(queryParams.timeframe) });
  }

  @Post('initialize')
  initializeCacheData(): void {
    this.utilisationsRadarService.initializeCacheData().then();
  }
}
