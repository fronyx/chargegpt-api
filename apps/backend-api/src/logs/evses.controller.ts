import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseInterceptors
} from '@nestjs/common';
import { NearbyEvseQueryService } from './services/nearby-evse-query.service';
import { Coordinate, NearbyEvse } from '@fronyx/data-transfer-object';
import { SentryInterceptor } from '../../../sentry/sentry.interceptor';
import {
  AccessScopeService,
} from '@fronyx/authentications';
import { EvsesService, IsValidEvseResult } from './services/evses.service';
import { OcpiEvsesService } from '@fronyx/persistence';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@UseInterceptors(SentryInterceptor)
@Controller('evses')
export class EvsesController {
  constructor(
    private readonly queryService: NearbyEvseQueryService,
    private readonly evseService: EvsesService,
    private readonly ocpiEvsesService: OcpiEvsesService,
    private readonly accessScopesService: AccessScopeService,
  ) {
  }

  @Get('nearby')
  async findNearbyEvses(@Query() { lat, lng }: { lat: number; lng: number }): Promise<NearbyEvse[]> {
    return this.queryService.getNearbyEvses(new Coordinate({ lat, lng }));
  }

  @Get('is-valid/location-id/:locationId/uid/:uid')
  async isValidEvse(@Param() params): Promise<IsValidEvseResult> {
    return this.evseService.isValidEvse({ locationId: params.locationId, uid: params.uid });
  }

  @Get('with/power-type/evse-primary-id')
  async getEvsePowerTypeByEvsePrimaryIds(@Query() queryParams): Promise<any> {
    return this.evseService.findPowerTypesByEvsePrimaryId({ evsePrimaryIds: (queryParams.evsePrimaryIds ?? '').split(',') });
  }

  @Get('scoped')
  async getAllPrimaryIdsForProjects(@Query() queryParams: { isRealTime: boolean }): Promise<string[]> {
    return this.accessScopesService.getAllScopedPrimaryIds(queryParams);
  }

  @Delete('evse-id/:evseId')
  async deleteEvseById(@Param() param: any): Promise<void> {
    await this.ocpiEvsesService.deleteByEvseId(param);
  }
}
