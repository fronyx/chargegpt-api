import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@fronyx/configurations';
import {
  OcpiCposService,
  OcpiLocationsService,
  OcpiEvsesService,
  OcpiConnectorsService,
  OcpiStatusLogsService,
  CrawlingEvsesService,
  CrawlingLocationsService,
  PredictionsLocationService,
  ToolkitScopedEvsesPrimaryIdsService
} from './services';
import {
  EvseEntity,
  LocationEntity,
  OcpiConnectorEntity,
  OcpiCpoEntity,
  OcpiDirectionEntity,
  OcpiEnergySourceEntity,
  OcpiEnvironmentalImpactEntity,
  OcpiEvseCoordinateEntity,
  OcpiEvseDirectionEntity,
  OcpiEvseEntity, OcpiExceptionalClosingEntity, OcpiExceptionalOpeningEntity,
  OcpiImageEntity,
  OcpiLocationEntity, OcpiLocationImageEntity,
  OcpiLocationRegularHourEntity,
  OcpiParkingRestrictionEntity,
  OcpiRelatedLocationEntity, OcpiRelatedLocationNameEntity,
  OcpiStatusScheduleEntity,
  ToolkitScopedEvsesPrimaryIdsEntity
} from '../../../../apps/cdk-apps/src/shared';
import { TimestreamModule } from '@fronyx/timestream';
import { CloudwatchLoggerModule } from '@fronyx/cloudwatch-logger';
import { CacheModule } from '@fronyx/cache';

const services = [
  OcpiCposService,
  OcpiLocationsService,
  OcpiEvsesService,
  OcpiConnectorsService,
  OcpiStatusLogsService,
  CrawlingEvsesService,
  CrawlingLocationsService,
  PredictionsLocationService,
  ToolkitScopedEvsesPrimaryIdsService
];

@Module({
  providers: [...services],
  exports: [...services],
  imports: [
    TypeOrmModule.forRoot(configService.getCrawlingDbConfig()),
    TypeOrmModule.forFeature(
      [
        OcpiCpoEntity,
        OcpiConnectorEntity,
        OcpiDirectionEntity,
        OcpiEvseEntity,
        OcpiExceptionalOpeningEntity,
        OcpiExceptionalClosingEntity,
        OcpiLocationEntity,
        OcpiRelatedLocationEntity,
        OcpiLocationRegularHourEntity,
        EvseEntity,
        LocationEntity,
        OcpiStatusScheduleEntity,
        OcpiImageEntity,
        OcpiLocationImageEntity,
        OcpiEnvironmentalImpactEntity,
        OcpiEnergySourceEntity,
        OcpiEvseDirectionEntity,
        OcpiParkingRestrictionEntity,
        OcpiRelatedLocationNameEntity,
        OcpiEvseCoordinateEntity,
        ToolkitScopedEvsesPrimaryIdsEntity,
      ]
    ),
    TimestreamModule,
    CloudwatchLoggerModule,
    CacheModule,
  ],
})
export class PersistenceModule {
}
