import { Controller, Get, Param, UseInterceptors, Post, Body, Query, Patch, Put } from '@nestjs/common';
import { SentryInterceptor } from '../../../sentry/sentry.interceptor';
import { OcpiLocationsService, PredictionsLocationService } from '@fronyx/persistence';
import { isEmptyString } from '../../../cdk-apps/src/shared/utils/is-empty-string.function';
import { EVFreaksOcpiService } from './services/e-v-freaks-ocpi.service';
import {
  IsValidLocationResult,
  OcpiLocation,
  InvalidRequestParameterError,
} from '../../../cdk-apps/src/shared';
import { PaginatedResults } from '../../../cdk-apps/src/shared/models/general/paginated-results.model';
import { ApiExcludeController } from '@nestjs/swagger';
import { getChargingStationSearchFunction, getNearestLocations } from '@fronyx/locations';
import { EVFreaksPollingService } from './services/e-v-freaks-polling.service';

@ApiExcludeController()
@UseInterceptors(SentryInterceptor)
@Controller('locations')
export class LocationsController {
  constructor(
    private readonly locationsRepo: OcpiLocationsService,
    private readonly predictionsLocationsService: PredictionsLocationService,
    private readonly evFreaksOcpiService: EVFreaksOcpiService,
    private readonly evfreaksPollingService: EVFreaksPollingService
  ) {
  }

  @Get('ocpi')
  async findOcpiLocations(@Query() params: any): Promise<PaginatedResults<OcpiLocation>> {
    return this.predictionsLocationsService.getPaginatedOcpiLocations(params);
  }

  @Get('is-valid/location-id/:locationId')
  async isValidLocation(@Param() params): Promise<IsValidLocationResult> {
    return this.predictionsLocationsService.isValidLocation(params);
  }

  @Get('from-ev-freaks/details')
  async getOcpiLocationDetailsFromEvFreaks(@Query() queryParams): Promise<OcpiLocation> {
    return this.evFreaksOcpiService.getLocationDetails(queryParams);
  }

  @Get(':locationId')
  async getLocation(@Param() params): Promise<any> {
    if (isEmptyString(params.locationId)) {
      throw new Error('Invalid location id in getLocation.');
    }

    return this.locationsRepo.findById(params.locationId);
  }

  @Get(':locationId/city')
  async getLocationCity(@Param() params): Promise<string> {
    if (isEmptyString(params.locationId)) {
      throw new Error('Invalid location id in getLocationCity.');
    }

    return this.locationsRepo.findLocationCityById(params.locationId);
  }

  @Post(':locationId/ocpi/reloads')
  async reloadLocationByIdFromEvFreaks(@Param() params): Promise<void> {
    const location = await this.evFreaksOcpiService.getLocationDetails(params);
    await this.locationsRepo.save(location);
  }

  @Put('ev-freaks')
  async updatePartialEvFreaksLocations(@Body() body): Promise<void> {
    await this.locationsRepo.updateEvfreaksLocation({ locations: body });
  }

  @Post(':locationId')
  async createLocation(@Param() params, @Body() body): Promise<void> {
    await this.locationsRepo.save(OcpiLocation.createFromCreatePayload({
      ...body,
      id: params.locationId,
    }));
  }

  @Patch(':locationId')
  async updateLocation(@Param() params, @Body() body): Promise<void> {
    await this.locationsRepo.update(OcpiLocation.createFromUpdatePayload({
      ...body,
      id: params.locationId,
    }));
  }

  @Get('by-coordinates')
  async findNearestLocationsByCoordinate(
    @Query() args: { latitude: number; longitude: number },
  ) {
    const requiredParams = ['latitude', 'longitude'];
    if (requiredParams.some(param => args[param] === null || args[param] === undefined)) {
      throw new InvalidRequestParameterError('Invalid query parameters');
    }

    return getNearestLocations(args, getChargingStationSearchFunction('FRK'));
  }

  @Post('ev-freaks/process')
  async processEVFreaksLocations(@Body() body): Promise<void> {
    await this.evfreaksPollingService.processPolledLocations({ locations: body.locations, isPolling: body.isPolling });
  }

  @Post('ev-freaks/trigger-side-effects')
  async triggerSideEffectsStoringLocations(@Body() body): Promise<void> {
    await this.evfreaksPollingService.triggerSideEffectsStoringLocations(body);
  }
}
