import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersistenceModule } from '@fronyx/persistence';
import { CloudwatchLoggerModule } from '@fronyx/cloudwatch-logger';
import { CacheModule } from '@fronyx/cache';
import { HttpModule } from '@nestjs/axios';
import { PredictionsController } from './predictions.controller';
import { EvsesController } from '../logs/evses.controller';
import { LocationsController } from '../logs/locations.controller';
import { InternalProcessController } from './internal-process.controller';
import { ConnectorsController } from '../logs/connectors.controller';
import { AccessScopesController } from './access-scopes.controller';
import { StatusLogsController } from '../logs/status-logs.controller';
import { OcpiUpdationsController } from '../logs/ocpi-updations.controller';
import { OcpiCreationsController } from '../logs/ocpi-creations.controller';
import { AuthenticationsModule } from '@fronyx/authentications';
import { QueueModule } from '@fronyx/queue';
import { PredictionsModule } from '@fronyx/predictions';
import { NearbyEvseQueryService } from '../logs/services/nearby-evse-query.service';
import { EvsesService } from '../logs/services/evses.service';
import { StatusLogsService } from '../logs/services/status-logs.service';
import { EVFreaksOcpiService } from '../logs/services/e-v-freaks-ocpi.service';
import { InternalProcessService } from './services/internal-process.service';
import { CpoController } from '../logs/cpo.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { LogsCommandHandlers } from '../logs/commands/handlers';
import { UnknownEntitiesSagas } from '../logs/sagas/unknown-entities.sagas';
import { LogsEventHandlers } from '../logs/events/handlers';
import { UtilisationsRadarService } from '../logs/services/utilisations-radar.service';
import { UtilisationsRadarController } from '../logs/utilisations-radar.controller';
import { ToolkitModule } from '@fronyx/toolkit';
import { ChargeGptModule } from '@fronyx/charge-gpt';
import { LocationsModule } from '@fronyx/locations';
import { TimestreamModule } from '@fronyx/timestream';
import { EVFreaksPollingService } from '../logs/services/e-v-freaks-polling.service';

@Module({
  imports: [
    PersistenceModule,
    CacheModule,
    HttpModule,
    AuthenticationsModule,
    QueueModule,
    CqrsModule,
    CloudwatchLoggerModule,
    ToolkitModule,
    PredictionsModule,
    ChargeGptModule,
    LocationsModule,
    TimestreamModule,
  ],
  controllers: [
    AppController,
    PredictionsController,
    EvsesController,
    LocationsController,
    InternalProcessController,
    ConnectorsController,
    AccessScopesController,
    StatusLogsController,
    OcpiUpdationsController,
    OcpiCreationsController,
    CpoController,
    UtilisationsRadarController,
  ],
  providers: [
    AppService,
    NearbyEvseQueryService,
    EvsesService,
    StatusLogsService,
    EVFreaksOcpiService,
    InternalProcessService,
    ...LogsCommandHandlers,
    ...LogsEventHandlers,
    UnknownEntitiesSagas,
    UtilisationsRadarService,
    EVFreaksPollingService,
  ],
})
export class AppModule {
}
