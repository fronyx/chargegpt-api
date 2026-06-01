import { Test } from '@nestjs/testing';
import { ConversationService } from './conversations.service';
import { ChargeGPTControllerHandlerService } from './chargegpt-controller-handler.service';
import { Conversation } from '../models/prompt';
import { ContextService } from './context.service';
import { LogMetaDataService } from './log-meta-data.service';
import { AbuseDetectionService } from './abuse-detection.service';
import { ConversationsAgentService } from './conversations-agent.service';
import { FiltersCategoriesIdentifiersService } from './filters-identifiers/filters-categories-identifiers.service';
import { ConversationSummaryService } from './conversation-summary.service';
import { RequestIdentifierAddressService } from './address-identifiers/request-identifier-address.service';
import { RequestIdentifierCat1Service } from './filters-identifiers/request-identifier-cat1.service';
import { RequestIdentifierCat2Service } from './filters-identifiers/request-identifier-cat2.service';
import { RequestIdentifierCat3Service } from './filters-identifiers/request-identifier-cat3.service';
import { RequestIdentifierCat4Service } from './filters-identifiers/request-identifier-cat4.service';
import { RequestIdentifierCat5Service } from './filters-identifiers/request-identifier-cat5.service';
import { RequestIdentifierCat6Service } from './filters-identifiers/request-identifier-cat6.service';
import { RequestIdentifierCat7Service } from './filters-identifiers/request-identifier-cat7.service';
import { RequestIdentifierCat8Service } from './filters-identifiers/request-identifier-cat8.service';
import { queryProjectByToken } from '@fronyx/toolkit';
import { disconnectRagClient } from './rag-services/rag-client.service';

describe('ChargeGPT control handler', () => {
  jest.setTimeout(10 * 60 * 1000); // 10 minutes timeout

  let chargeGPTControllerHandlerService: ChargeGPTControllerHandlerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ConversationService,
        ContextService,
        LogMetaDataService,
        AbuseDetectionService,
        ConversationsAgentService,
        FiltersCategoriesIdentifiersService,
        ConversationSummaryService,
        RequestIdentifierAddressService,
        ChargeGPTControllerHandlerService,
        RequestIdentifierCat1Service,
        RequestIdentifierCat2Service,
        RequestIdentifierCat3Service,
        RequestIdentifierCat4Service,
        RequestIdentifierCat5Service,
        RequestIdentifierCat6Service,
        RequestIdentifierCat7Service,
        RequestIdentifierCat8Service,
      ],
    }).compile();

    chargeGPTControllerHandlerService = moduleRef.get(
      ChargeGPTControllerHandlerService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Fallback FF turned OFF', () => {
    it('should not search fallback charging stations', async () => {
      const apiToken = '3658be6b-f4b7-4671-8889-d203ed1a3f26'; // chargegpt_development
      const project = await queryProjectByToken(apiToken);
      const queryParams = { conversationId: null };
      const conversationInput: Conversation = {
        text: 'I want to charge in Essen with 400kW',
        currentCoordinates: null,
        isVoice: false,
        isSuggestion: false,
        deniedContext: null,
      };

      const FronyxLocationsModules = await import('@fronyx/locations');

      const getLocationsSpy = jest.spyOn(
        FronyxLocationsModules,
        'getNearestLocations'
      );

      await chargeGPTControllerHandlerService.findChargegptRecommendations(
        project,
        queryParams,
        conversationInput
      );

      expect(getLocationsSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Fallback FF turned ON', () => {
    it('should search search fallback charging stations', async () => {
      const apiToken = 'bda0ece8-5879-4205-b716-ac5a419d85c1'; // datadog_monitoring_recommendations
      const project = await queryProjectByToken(apiToken);
      const queryParams = { conversationId: null };
      const conversationInput: Conversation = {
        text: 'I want to charge in Essen with 400kW',
        currentCoordinates: null,
        isVoice: false,
        isSuggestion: false,
        deniedContext: null,
      };

      const FronyxLocationsModules = await import('@fronyx/locations');

      const getLocationsSpy = jest.spyOn(
        FronyxLocationsModules,
        'getNearestLocations'
      );

      await chargeGPTControllerHandlerService.findChargegptRecommendations(
        project,
        queryParams,
        conversationInput
      );

      expect(getLocationsSpy).toHaveBeenCalledTimes(1);
    });
  });

  afterAll(async () => {
    await disconnectRagClient();
  });
});
