import { PersistenceModule } from '@fronyx/persistence';
import { Module } from '@nestjs/common';
import { CacheModule } from '@fronyx/cache';
import { PredictionsQueryService } from './services';
import { CloudwatchLoggerModule } from '@fronyx/cloudwatch-logger';
import { LocationsService } from './services/locations/locations.service';
import { EvsesService } from './services/evses/evses.service';
import { EvsePredictionsService } from './services/evse-predictions/evse-predictions.service';
import { EvseDictionaryService } from './services/dictionary/evse-dictionary.service';

@Module({
  imports: [
    PersistenceModule,
    CacheModule,
    CloudwatchLoggerModule,
  ],
  providers: [
    PredictionsQueryService,
    EvsePredictionsService,
    LocationsService,
    EvsesService,
    EvseDictionaryService,
  ],
  exports: [
    PredictionsQueryService,
    EvseDictionaryService,
    EvsesService,
    LocationsService,
  ],
})
export class PredictionsModule {
}
