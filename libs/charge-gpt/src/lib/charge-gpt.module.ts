import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LocationsModule } from '@fronyx/locations';
import { PersistenceModule } from '@fronyx/persistence';
import { PredictionsModule } from '@fronyx/predictions';
import { ChargeGPTController } from './controllers/charge-gpt.controller';
import { CloudwatchLoggerModule } from '@fronyx/cloudwatch-logger';
import { AuthenticationsModule } from '@fronyx/authentications';
import {
  AbuseDetectionService,
  AudioFileService,
  ChatGptService,
  ConversationHelperService,
  ConversationService,
  GoogleApiService,
  SanityCheckService,
  ContextService,
  LogMetaDataService,
  FiltersAgentService,
  FeedbackService,
  RequestIdentifierCat1Service,
  RequestIdentifierCat2Service,
  RequestIdentifierCat3Service,
  RequestIdentifierCat4Service,
  RequestIdentifierCat5Service,
  RequestIdentifierCat6Service,
  RequestIdentifierCat7Service,
  RequestIdentifierCat8Service,
  RequestIdentifierAddressService,
  RequestIdentifierPostfixService,
  RecommendationService,
  ConversationSummaryService,
  FiltersCategoriesIdentifiersService,
  RequestIdentifierDecisionService,
} from './services';
import { RecommendationsController } from './controllers/recommendations.controller';
import { WhatsAppWebhookController } from './controllers/whatsapp-webhook.controller';
import { ChargeGPTControllerHandlerService } from './services/chargegpt-controller-handler.service';

const services = [
  ChatGptService,
  AudioFileService,
  GoogleApiService,
  ConversationService,
  AbuseDetectionService,
  SanityCheckService,
  RecommendationService,
  FeedbackService,
  ContextService,
  LogMetaDataService,
  FiltersAgentService,
  ConversationHelperService,
  RequestIdentifierCat1Service,
  RequestIdentifierCat2Service,
  RequestIdentifierCat3Service,
  RequestIdentifierCat4Service,
  RequestIdentifierCat5Service,
  RequestIdentifierCat6Service,
  RequestIdentifierCat7Service,
  RequestIdentifierCat8Service,
  RequestIdentifierAddressService,
  RequestIdentifierPostfixService, 
  ConversationSummaryService,
  FiltersCategoriesIdentifiersService,
  RequestIdentifierDecisionService,
  ChargeGPTControllerHandlerService,
];

@Module({
  imports: [
    HttpModule,
    LocationsModule,
    PersistenceModule,
    PredictionsModule,
    CloudwatchLoggerModule,
    AuthenticationsModule,
  ],
  providers: [...services],
  controllers: [
    ChargeGPTController,
    RecommendationsController,
    WhatsAppWebhookController,
  ],
  exports: [...services],
})
export class ChargeGptModule {}
