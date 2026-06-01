import { Module } from '@nestjs/common';
import { AccessScopeService } from './services';
import { PassportModule } from '@nestjs/passport';
import { ApiTokenStrategy } from './strategies';
import { ProjectsService, ToolkitModule } from '@fronyx/toolkit';
import { CacheModule } from '@fronyx/cache';
import {
  ProjectScopeByEvseIdGuard,
  ProjectScopeGuard,
  ProjectScopeLocationIdsGuard,
  ProjectScopeMultipleEvseParamsGuard,
  ProjectScopeChargegptLanguageGuard,
  ProjectScopeChargegptAllowedInputGuard,
  ProjectScopeChargegptAllowedOutputGuard,
  ProjectScopeChargegptFeedbackGuard,
  ProjectScopeRecommendationsAddressCoordinatesGuard,
  ProjectScopeRecommendationsTimestampGuard,
  ProjectScopeRecommendationsPowerTypeGuard,
  ProjectTokensAuthorizationsGuard,
  ProjectScopeChargegptFiltersProjectGuard,
} from './guards';
import { PersistenceModule } from '@fronyx/persistence';
import { CloudwatchLoggerModule } from '@fronyx/cloudwatch-logger';
import { PredictionsModule } from '@fronyx/predictions';
import { HttpModule } from '@nestjs/axios';

const services = [
  ApiTokenStrategy,
  ProjectScopeGuard,
  ProjectScopeByEvseIdGuard,
  ProjectScopeLocationIdsGuard,
  ProjectScopeMultipleEvseParamsGuard,
  AccessScopeService,
  ProjectsService,
  ProjectScopeChargegptLanguageGuard,
  ProjectScopeChargegptAllowedInputGuard,
  ProjectScopeChargegptAllowedOutputGuard,
  ProjectScopeChargegptFeedbackGuard,
  ProjectScopeRecommendationsAddressCoordinatesGuard,
  ProjectScopeRecommendationsTimestampGuard,
  ProjectScopeRecommendationsPowerTypeGuard,
  ProjectTokensAuthorizationsGuard,
  ProjectScopeChargegptFiltersProjectGuard,
];

@Module({
  imports: [PassportModule, ToolkitModule, CacheModule, PersistenceModule, CloudwatchLoggerModule, PredictionsModule, HttpModule],
  providers: [...services],
  exports: [...services],
})
export class AuthenticationsModule {
}
