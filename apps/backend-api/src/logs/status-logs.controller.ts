import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { SentryInterceptor } from '../../../sentry/sentry.interceptor';
import { StatusLogsService } from './services/status-logs.service';
import { OcpiStatusLog } from '../../../cdk-apps/src/shared';
import { OcpiStatusLogsService } from '@fronyx/persistence';
import { isEmptyString } from '../../../cdk-apps/src/shared/utils/is-empty-string.function';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@UseInterceptors(SentryInterceptor)
@Controller('status-logs')
export class StatusLogsController {
  constructor(
    private readonly service: StatusLogsService,
    private readonly statusLogsRepo: OcpiStatusLogsService,
  ) {
  }

  @Post('ocpi')
  async storeOcpiStatusLogs(@Body() body: any): Promise<void> {
    const statusLogs = body.map(val => OcpiStatusLog.create(val));
    await this.service.saveMany({ statusLogs });
  }

  @Get('last-minute')
  async getLogsForLastMinute(): Promise<OcpiStatusLog[]> {
    const results = await this.statusLogsRepo.getLogsForLastMinute();

    return results;
  }

  @Get('by-primary-ids')
  async getStatusLogsByPrimaryId(@Query() queryParams: { primaryIds: string; }): Promise<OcpiStatusLog[]> {
    const primaryIds = queryParams.primaryIds
      .split(',')
      .filter(primaryId => !isEmptyString(primaryId));

    const results = await this.statusLogsRepo.getLogsForPredictionsProcessing(primaryIds);

    return results;
  }
}
