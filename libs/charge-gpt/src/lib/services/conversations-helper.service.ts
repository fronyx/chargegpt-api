import { Injectable } from '@nestjs/common';
import {
  DialogFactory,
  Location,
  MetaData,
  Answer,
  ProjectOutputType,
  FilterResponse,
  Coordinates,
} from '../models/prompt';
import {
  ChargegptMissingHelpError,
  LocationRequestMessage,
  NoInputError,
} from '../../../../../apps/cdk-apps/src/shared/models/general/chargegpt-translation';
import { chargeGPTLogger } from '../models/chat-utilities';
import {
  LocationFilter,
  NoChargePointsInDBError,
  NoChargePointsAvailableError,
} from '../../../../../apps/cdk-apps/src/shared';
import { quickCompletion } from './chat-gpt.service';
import {
  ConversationHistory,
  SupportedStateMachineEnum,
} from '../models/conversation-history.model';
import { CategoryPropertiesEnum as Cat1 } from './filters-identifiers/request-identifier-cat1.service';
import { CategoryPropertiesEnum as Cat7 } from './filters-identifiers/request-identifier-cat7.service';
import { CategoryPropertiesEnum as Cat8 } from './filters-identifiers/request-identifier-cat8.service';
import {
  generateCountryPermissionErrorMessage,
  generateInvalidAddressErrorMessage,
  generateRouteRecommendationText,
  getChargeGptFilterExceedTurnsLimitErrorMessage,
  getChargeGptFilterText,
  getChargeGptRecommendationText,
} from '../models/charge-gpt-translation.assets';
import { configService } from '@fronyx/configurations';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { TranslationsService } from '@fronyx/translations';
import { IdentifiedFilters } from './filters-identifiers/filters-categories-identifiers.service';
import { resetHistoryCurrentCoordinates } from './current-coordinates-setter.util';
import { isValid } from 'date-fns';
import {
  AllIdentifiedFilters,
  HelpAgentResponse,
  identifyHelpNeededWithinRequest,
} from './help-agent.service';
import {
  AddressNotFoundError,
  AddressOutOfScopeError,
} from '../models/address-search-error';
import { identifyAddressCharacteristics } from './address-identifiers/address-characterisitics.service';
import { serializeFilterResponse } from '../models/filters-response-serializer';
import { textToSpeech } from './audio-services/azure-audio.service';

import { storeConversationHistory } from './conversation-persist.service';
import { isChargePointSearchNeededForPoiCategories } from './address-services/search-poi.service';
import {
  BIGGEST_SEARCH_DISTANCE,
  STANDARD_SEARCH_DISTANCE,
} from '@fronyx/locations';
import {
  sendErrorMetric,
  sendFiltersNoTurnsUntilSuccessMetric,
  sendFiltersNumberOfTurnsSubcomponentMetric,
  sendFiltersSuccessfulConversationMetric,
  sendFilterStartConversationMetric,
  sendNumberOfTurnsSubcomponentMetric,
  sendRecommendationDistanceMetric,
  sendRecommendationProbabilityMetric,
  sendRecommendationsCountMetric,
  sendStartConversationMetric,
  sendSuccessfulConversationMetric,
} from './conversation-quality.service';
import {
  isSpecialPoiCategories,
  searchDestinationBasedOnChargingStations,
} from './dialog-managements-services/search-destinations-from-charging-stations.service';
import {
  noChargePointsInDBError,
  searchForAvailableChargingStations,
  noChargePointsAvailableError,
} from './search-charging-stations-service/charging-station-search.service';
import { getDestinationAndSetToHistory } from './conversation-destination-search.service';
import { QAAgentResponse } from './qa-agent.service';
import { ToolkitProject } from '@fronyx/toolkit';
import { getRecommendedChargingStationsAlongRoute } from './routes-services/route-search.service';
import { getHistory } from './conversation-factory.service';
import {
  DEFAULT_MAX_POWER,
  DEFAULT_MIN_RAPID_POWER,
} from '../models/power-kw.constants';
import { Route } from './routes-services/routes.model';
import { calculateChargingStationsScore } from './scoring-services/recommendations-type.functions';
import { labelRecommendedChargingStations } from './scoring-services/charging-stations-label.service';
import { ChargingStationWithScoreDetails } from '../models/charging-stations.model';
import { createHelpEmbeddings } from './rag-services/create-help-embedding.service';
import { createAddressesEmbeddings } from './rag-services/create-addresses-embedding.service';
import { createRecommendationHelpEmbeddings } from './rag-services/create-recommendation-help-embedding.service';
import { createCat7Embeddings } from './rag-services/create-cat7-embedding.service';
import { createCat1Embeddings } from './rag-services/create-cat1-embedding.service';

@Injectable()
export class ConversationHelperService {
  constructor() {
    this.createEmbeddings();
  }

  async createEmbeddings(): Promise<void> {
    // await createTranslationEmbeddings();
    // await createAddressesEmbeddings();
    // await createCat1Embeddings();
    // await createCat7Embeddings();
    // await createHelpEmbeddings();
    // await createQAEmbeddings();
    // await createRecommendationHelpEmbeddings();
  }
}

export const generateNoInputResponse = async (
  project: ToolkitProject,
  history: ConversationHistory
): Promise<Answer> => {
  const translation = new TranslationsService(history.language);
  translation.setAsset('NoInputError', NoInputError);

  const message = translation.get('NoInputError');

  let audioUrl = '';
  if (project.chargegpt_allowed_output === 'text_voice') {
    audioUrl = await textToSpeech(message, history.language);
  }

  const response: Answer = {
    conversationId: history.id,
    role: 'assistant',
    prompt: message,
    isClosed: false,
    audioUrl,
    responseId: history.getResponseId(),
    isRequestOutOfScope: false,
  };

  chargeGPTLogger(
    history.id,
    history.projectName,
    'responseId',
    response.responseId
  );

  return response;
};

export const generateAbusivePromptResponse = async (
  history: ConversationHistory,
  message: string,
  project: ToolkitProject,
  metaData?: any
): Promise<Answer> => {
  let audioUrl = '';
  if (project.chargegpt_allowed_output === 'text_voice') {
    audioUrl = await textToSpeech(message, history.language);
  }

  const response: Answer = {
    conversationId: history.id,
    role: 'assistant',
    prompt: message,
    isClosed: false,
    audioUrl,
    responseId: history.getResponseId(),
    isRequestOutOfScope: false,
  };

  const metaDataConfig = project.response.find(
    ({ name }) => name === 'meta_data'
  );
  if (!isObjectEmpty(metaData) && metaDataConfig?.value === 1) {
    response.metaData = serializeMetaData(metaData);
  }

  chargeGPTLogger(
    history.id,
    history.projectName,
    'responseId',
    response.responseId
  );

  return response;
};

export const startConversation = async (payload: {
  clientTimestamp: number | string;
  timezoneOffset: number;
  language: string;
  project: ToolkitProject;
}): Promise<Answer> => {
  payload.clientTimestamp = [
    new Date(Number(payload.clientTimestamp)),
    new Date(payload.clientTimestamp),
  ]
    .find(isValid)
    .getTime();

  const history = await getHistory(payload);

  // conversationStage is needed for the closing of conversation process
  const conversationStage = configService.isProduction()
    ? 'production'
    : 'staging';

  chargeGPTLogger(
    history.id,
    history.projectName,
    'conversationLanguage',
    history.language
  );

  chargeGPTLogger(
    history.id,
    history.projectName,
    'conversationStage',
    conversationStage
  );
  history.setConversationStage(conversationStage);

  return answer({
    history,
    project: payload.project,
    isClosed: false,
  });
};

export const setUserNumberOfTurns = (
  history: ConversationHistory
): {
  userNumberOfTurns: number;
} => {
  const userNumberOfTurns = history.getUserNumberOfTurns();
  const currentNumberOfTurn = isNaN(userNumberOfTurns)
    ? 1
    : userNumberOfTurns + 1;

  history.setUserNumberOfTurns(currentNumberOfTurn);

  return {
    userNumberOfTurns: currentNumberOfTurn,
  };
};

export const triggerSendStartConversationMetrics = async (
  projectName: string,
  projectOutputType: string
): Promise<void> => {
  if (projectOutputType === ProjectOutputType.filters) {
    await sendFilterStartConversationMetric(projectName);
  } else {
    await sendStartConversationMetric(projectName);
  }
};

export const getAnotherChargePointRecommendations = (
  history: ConversationHistory,
  project: ToolkitProject
) => {
  const scoredChargingStations = calculateChargingStationsScore(
    history.getAvailableChargingStations()
  );
  const blockedChargingStationId = history.getBlockedLocations();

  if (scoredChargingStations.length < 1) {
    const { error } = noChargePointsInDBError(history, false);
    return returnMetaData(history, project, error);
  }

  const filteredChargePoints = excludeRecommendedChargePoints(
    scoredChargingStations,
    blockedChargingStationId
  );

  if (!filteredChargePoints?.length) {
    const { error } = noChargePointsInDBError(history, false);
    return returnMetaData(history, project, error);
  }

  const isSearchRadiusIncreased =
    filteredChargePoints.filter(
      ({ distance }) => distance > STANDARD_SEARCH_DISTANCE
    ).length > 0;

  if (filteredChargePoints.length < 1) {
    const { error } = noChargePointsAvailableError(
      history,
      scoredChargingStations,
      isSearchRadiusIncreased
    );
    return returnMetaData(history, project, error);
  }

  return returnRecommendations(history, project, filteredChargePoints, []);
};

export const returnQuestion = async (
  history: ConversationHistory,
  project: ToolkitProject,
  lastUserInput: string
): Promise<Answer> => {
  const switchReason = history.getSwitchReason();

  history.addDialog(
    DialogFactory.fromUser(`
  language to answer in: ${new TranslationsService(
    history.language
  ).getLanguageName()}
  switch_reason: ${switchReason}
  lastUserInput: ${lastUserInput}
  `)
  );
  const { isError, chatGptResponse, errorMessage } = await quickCompletion(
    history.getCurrentDialogs(),
    history.id,
    project.name,
    project.chargegpt_output_type,
    history.language
  );

  history.addDialog(
    DialogFactory.fromAssistant(errorMessage ?? chatGptResponse),
    true
  );

  if (isError) triggerSendErrorMetric(history, project.name);

  return answer({ history, project, isClosed: false });
};

export const setFilterSuccessConversationCounter = async (
  history: ConversationHistory
): Promise<void> => {
  const { successConversationCount, userNumberOfTurns } = history.getData();

  if (successConversationCount < 1) {
    await sendFiltersSuccessfulConversationMetric(history.projectName);
    await sendFiltersNoTurnsUntilSuccessMetric(
      history.projectName,
      userNumberOfTurns
    );
  }

  const currentSuccessConversationCount = Number(successConversationCount) + 1;

  history.setSuccessCounter(currentSuccessConversationCount);
};

export const returnFiltersResults = async (
  history: ConversationHistory,
  project: ToolkitProject
): Promise<Answer> => {
  const filters = serializeFilterResponse(project, history.getData());
  const { results, metaData } = prepareResultsAndMetaData(history, filters);

  Promise.all([
    setFilterSuccessConversationCounter(history),
    sendFiltersNumberOfTurnsSubcomponentMetric(
      project.name,
      Number(history.numberOfTurnsSubcomponent)
    ),
  ]);

  history.addDialog(
    DialogFactory.fromAssistant(
      getChargeGptFilterText(
        project,
        history.language,
        history.getAddress(),
        history.getCurrentCoordinates(),
        history.getIsNearbyRequested(),
        history.getPostfixText()
      )
    ),
    true
  );

  return answer({
    history,
    project,
    isClosed: false,
    results,
    metaData,
  });
};

export const returnResults = async (
  history: ConversationHistory,
  project: ToolkitProject,
  increasedSearchDistance = false
): Promise<Answer> => {
  if (project.chargegpt_output_type === ProjectOutputType.filters) {
    return returnFiltersResults(history, project);
  } else {
    const { locations, error } = await searchForAvailableChargingStations(
      history,
      project,
      increasedSearchDistance ? BIGGEST_SEARCH_DISTANCE : undefined
    );

    history.setAvailableChargingStations(locations);

    if (
      error &&
      !increasedSearchDistance &&
      !history.getIsLocationsAreSearchBasedOnAddressOptions() &&
      !history.getIsDestinationAPOI()
    ) {
      return returnResults(history, project, true);
    }

    if (error) {
      return returnMetaData(history, project, error);
    }

    const scoredChargingStations = calculateChargingStationsScore(locations);

    return returnRecommendations(history, project, scoredChargingStations, []);
  }
};

const setSuccessConversationCounter = async (history: ConversationHistory) => {
  const { successConversationCount } = history.getData();

  if (successConversationCount < 1) {
    await sendSuccessfulConversationMetric(history.projectName);
  }

  const currentSuccessConversationCount = Number(successConversationCount) + 1;

  history.setSuccessCounter(currentSuccessConversationCount);
  history.resetNumberOfTurnsSubcomponent();
};

export const returnMetaData = (
  history: ConversationHistory,
  project: ToolkitProject,
  error: any
): Promise<Answer> => {
  const metaData = getMetaData(
    history,
    error,
    (conversationHistory: ConversationHistory) =>
      triggerSendRecommendationSuccessMetric(conversationHistory, [])
  );

  return answer({ history, project, isClosed: false, metaData });
};

export const returnRecommendations = (
  history: ConversationHistory,
  project: ToolkitProject,
  locations: ChargingStationWithScoreDetails[],
  route: Route[] = []
): Promise<Answer> => {
  const { results, metaData } = getResultsAndMetaData(
    history,
    locations,
    route
  );

  triggerSendRecommendationSuccessMetric(history, locations);

  return answer({
    history,
    project,
    isClosed: false,
    results,
    metaData,
  });
};

export const searchRecommendationsAlongRoute = async (
  history: ConversationHistory,
  project: ToolkitProject,
  origin: Coordinates,
  destination: Coordinates,
  routeNeed: string
): Promise<Answer> => {
  const {
    error,
    chargingStations,
    destination: stopPoint,
    routes,
  } = await getRecommendedChargingStationsAlongRoute(
    project,
    history,
    origin,
    destination,
    routeNeed
  );

  if (error) {
    history.setRouteNeeds('');

    return returnMetaData(history, project, error);
  }

  history.setLatitude(stopPoint.lat.toString());
  history.setLongitude(stopPoint.lng.toString());
  history.setAddress(stopPoint.address);

  return returnRecommendations(history, project, chargingStations, routes);
};

export const triggerSendRecommendationSuccessMetric = async (
  history: ConversationHistory,
  locations: Location[]
): Promise<void> => {
  history.setIsConversationFinished(true);
  const projectName = history.projectName;
  const promises = [];
  promises.push(
    sendNumberOfTurnsSubcomponentMetric(
      projectName,
      Number(history.numberOfTurnsSubcomponent)
    ),
    setSuccessConversationCounter(history),
    sendRecommendationsMetric(locations, projectName)
  );
  await Promise.all(promises);
};

const sendRecommendationsMetric = async (
  locations: Location[],
  projectName: string
) => {
  for (const { probability, distance } of locations) {
    sendRecommendationProbabilityMetric(projectName, probability);
    sendRecommendationDistanceMetric(projectName, distance);
  }

  sendRecommendationsCountMetric(projectName, locations.length);
};

export const userNeedHelp = async (
  history: ConversationHistory,
  project: ToolkitProject
): Promise<Answer> => {
  const helpResponse = await identifyHelpNeededWithinRequest(
    history,
    project,
    true
  );

  return helpAnswer(history, helpResponse, project);
};

const getResultsAndMetaData = (
  history: ConversationHistory,
  locations?: Location[],
  route?: Route[]
): { results: any; metaData: MetaData } => {
  const powerType = history.getPowerType();
  const connectorType = history.getConnectorType();
  const operatorName = history.getOperatorName();
  const minPower = history.getMinPower();
  const maxPower = history.getMaxPower();
  const address = history.getAddress();
  const latitude = history.getLatitude();
  const longitude = history.getLongitude();
  const countryCode = history.getCountryCode();

  const metaData = {
    dateTime: null,
    powerType: null,
    operatorName: null,
    connectorType: null,
    minPower: null,
    maxPower: null,
    destination: null,
    origin: null,
    poi: null,
  };
  let results = null;

  if (isRoutingRequest(history)) {
    results = {
      type: 'Route',
      data: locations ?? [],
    };
  } else {
    results = {
      type: 'Destination',
      data: locations ?? [],
    };
  }

  logPowerTypeRecommendation(history, powerType, locations);

  if (!isEmptyString(history.getProcessedDateTime())) {
    results.dateTime = history.getProcessedDateTime();
    metaData.dateTime = history.getProcessedDateTime();
  }

  if (!isEmptyString(powerType)) {
    results.powerType = powerType === 'both' ? 'AC/DC' : powerType;
    metaData.powerType = results.powerType;
  }

  if (!isEmptyString(operatorName)) {
    results.operatorName = operatorName;
    metaData.operatorName = operatorName;
  }

  if (!isEmptyString(connectorType)) {
    results.connectorType = connectorType.toUpperCase();
    metaData.connectorType = connectorType.toUpperCase();
  }

  if (!isNaN(minPower) && !isNaN(maxPower)) {
    results.minPower = minPower;
    results.maxPower = maxPower;
    metaData.minPower = minPower;
    metaData.maxPower = maxPower;
  }

  if (history.getCurrentCoordinates()) {
    results.destination = {
      coordinates: history.getCurrentCoordinates(),
    };

    metaData.destination = results.destination;
  }

  if (
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    !isEmptyString(address) &&
    !isRoutingRequest(history)
  ) {
    results.destination = {
      address,
      coordinates: {
        lat: latitude,
        lng: longitude,
      },
    };

    metaData.destination = {
      address,
      coordinates: {
        lat: latitude,
        lng: longitude,
      },
    };

    if (!isEmptyString(countryCode)) {
      results.destination = {
        ...results.destination,
        countryCode,
      };

      metaData.destination = {
        ...metaData.destination,
        countryCode,
      };
    }
  }

  if (isRoutingRequest(history)) {
    const originAddress = history.getFoundOriginAddressName();
    const originCoordinates = history.getOriginCoordinates();
    const destinationAddress = history.getFoundDestinationAddressName();
    const destinationCoordinates = history.getDestinationCoordinates();
    const routeNeed = history.getRouteNeeds();

    results.origin = {
      address: originAddress,
      coordinates: {
        lat: originCoordinates?.lat,
        lng: originCoordinates?.lng,
      },
    };

    metaData.origin = {
      address: originAddress,
      coordinates: {
        lat: originCoordinates?.lat,
        lng: originCoordinates?.lng,
      },
    };

    results.destination = {
      address: destinationAddress,
      coordinates: {
        lat: destinationCoordinates?.lat,
        lng: destinationCoordinates?.lng,
      },
    };

    metaData.destination = {
      address: destinationAddress,
      coordinates: {
        lat: destinationCoordinates?.lat,
        lng: destinationCoordinates?.lng,
      },
    };

    if (routeNeed) {
      results.poi = {
        address,
        coordinates: {
          lat: latitude,
          lng: longitude,
        },
      };

      metaData.poi = {
        address,
        coordinates: {
          lat: latitude,
          lng: longitude,
        },
      };
    }

    results.routes = route;
  }

  const isSearchRadiusIncreased =
    locations.filter(({ distance }) => distance > STANDARD_SEARCH_DISTANCE)
      .length > 0;

  if (history.getDestinationAddress() && history.getOriginAddress()) {
    history.addDialog(
      DialogFactory.fromAssistant(generateRouteRecommendationText(history)),
      true
    );
  } else {
    history.addDialog(
      DialogFactory.fromAssistant(
        getChargeGptRecommendationText(history, isSearchRadiusIncreased)
      ),
      true
    );
  }

  return {
    results,
    metaData,
  };
};

export const helpAnswer = async (
  history: ConversationHistory,
  helpResponse: HelpAgentResponse | QAAgentResponse,
  project: ToolkitProject
): Promise<Answer> => {
  if (!helpResponse) {
    const translation = new TranslationsService(history.language);
    translation.setAsset(
      'ChargegptMissingHelpError',
      ChargegptMissingHelpError
    );
    history.addDialog(
      DialogFactory.fromAssistant(translation.get('ChargegptMissingHelpError')),
      false
    );
  } else {
    const { response, outOfScope, helpLevel } = helpResponse;

    history.setIsRequestOutOfScope(outOfScope ?? false);
    history.setHelpLevel(helpLevel);
    history.addDialog(DialogFactory.fromAssistant(response), true);
    history.setIsHelpRequested(true);
  }

  return answer({ history, project, isClosed: false });
};

export const askForLocationContext = async (
  history: ConversationHistory,
  project: ToolkitProject
): Promise<Answer> => {
  const translation = new TranslationsService(history.language);
  translation.setAsset('LocationRequestMessage', LocationRequestMessage);
  history.addDialog(
    DialogFactory.fromAssistant(translation.get('LocationRequestMessage')),
    true
  );

  history.setIsCurrentCoordinatesRequested(true);

  return answer({
    history,
    project,
    isClosed: false,
    provideContext: 'Location',
  });
};

export const triggerSendErrorMetric = async (
  history: ConversationHistory,
  projectName: string
): Promise<void> => {
  const { errorConversationCount, successConversationCount } =
    history.getData();

  if (errorConversationCount < 1 && successConversationCount < 1) {
    await sendErrorMetric(projectName);
  }

  const currentErrorConversationCount = Number(errorConversationCount) + 1;

  history.setErrorCounter(currentErrorConversationCount);
};

export const manuallyGeneratedErrorMessage = async (
  history: ConversationHistory,
  project: ToolkitProject,
  error: unknown
): Promise<Answer> => {
  if (error instanceof AddressOutOfScopeError) {
    const message = generateCountryPermissionErrorMessage(
      history.language,
      error.address
    );
    chargeGPTLogger(
      history.id,
      history.projectName,
      'destinationError',
      message
    );
    history.addDialog(DialogFactory.fromAssistant(message));
  }

  if (error instanceof AddressNotFoundError) {
    const destinationAddress = error.address;
    const message = generateInvalidAddressErrorMessage(
      history.language,
      destinationAddress
    );
    chargeGPTLogger(
      history.id,
      history.projectName,
      'destinationError',
      message
    );
    history.addDialog(DialogFactory.fromAssistant(message));
  }

  if (
    error instanceof NoChargePointsInDBError ||
    error instanceof NoChargePointsAvailableError
  ) {
    chargeGPTLogger(
      history.id,
      history.projectName,
      'noChargingStationFound',
      error.internalMessage
    );
    history.addDialog(DialogFactory.fromAssistant(error.message), true);
  }

  resetHistoryCurrentCoordinates(history);
  history.setIsCurrentCoordinatesRequested(false);

  await triggerSendErrorMetric(history, project.name);

  return answer({ history, project, isClosed: false });
};

export const answer = async (args: {
  history: ConversationHistory;
  project: ToolkitProject;
  isClosed: boolean;
  provideContext?: string;
  results?: any;
  metaData?: MetaData;
}): Promise<Answer> => {
  const latestText = args.history.latestText();

  let audioUrl = '';
  if (args.project.chargegpt_allowed_output === 'text_voice') {
    audioUrl = await textToSpeech(latestText, args.history.language);
  }

  const {
    isRequestOutOfScope,
    lastUserInput,
    helpLevel,
    postfix,
    isAddressOptionsDecisionNecessary,
    isAddressConfirmationNecessary,
  } = args.history.getData();

  const response: Answer = {
    conversationId: args.history.id,
    role: 'assistant',
    prompt: latestText,
    isClosed: args.isClosed,
    audioUrl,
    responseId: args.history.getResponseId(),
    isRequestOutOfScope: isRequestOutOfScope ?? false,
  };

  if (isRequestOutOfScope) {
    response.lastUserInput = lastUserInput;

    chargeGPTLogger(
      args.history.id,
      args.history.projectName,
      'lastUserInput',
      response.lastUserInput
    );
  }

  if (!isEmptyString(args.provideContext)) {
    response.provideContext = args.provideContext;

    chargeGPTLogger(
      args.history.id,
      args.history.projectName,
      'provideContext',
      response.provideContext
    );
  }

  if (!isObjectEmpty(args.results)) {
    if (
      args.results.data.some(
        (chargingStation) =>
          chargingStation.score === null || chargingStation.score === undefined
      )
    ) {
      throw new Error('FATAL: Missing charging station score');
    }

    args.results.data.sort(({ score: a }, { score: b }) => b - a);

    let recommendedChargingStations =
      args.results.data?.slice(
        0,
        args.project.chargegpt_charge_point_recommendation_count
      ) ?? [];

    // Labelling the charging stations
    if (recommendedChargingStations.length > 1) {
      recommendedChargingStations = labelRecommendedChargingStations({
        locations: recommendedChargingStations,
        language: args.history.language,
        powerType: args.history.getPowerType(),
        minPower: args.history.getMinPower(),
        maxPower: args.history.getMaxPower(),
      });
    }

    args.history.setRecommendedChargingStations(recommendedChargingStations);

    logResults(
      args.history.id,
      args.history.projectName,
      args.results,
      recommendedChargingStations
    );

    recommendedChargingStations = filterInternalPropertiesFromResults(
      recommendedChargingStations
    );
    args.results.data = recommendedChargingStations;
    updateStateMachine(
      args.history,
      args.history.getOriginAddress() && args.history.getOriginAddress()
        ? SupportedStateMachineEnum.SHOWED_CHARGE_POINT_ALONG_ROUTE_RECOMMENDATIONS
        : SupportedStateMachineEnum.SHOWED_CHARGE_POINT_RECOMMENDATIONS
    );

    response.results = args.results;
  }

  const metaData = args.project.response.find(
    ({ name }) => name === 'meta_data'
  );

  if (metaData?.value === 1) {
    response.metaData = {
      ...args.metaData,
      ...serializeMetaData({
        helpLevel,
        isPostfix: !isEmptyString(postfix) && isEmptyString(helpLevel),
        isDestinationSelection: isAddressOptionsDecisionNecessary,
        isDestinationConfirmation: isAddressConfirmationNecessary,
        isReset: args?.metaData?.isReset,
      }),
    };

    chargeGPTLogger(
      args.history.id,
      args.history.projectName,
      'metaData',
      `isCharacterLimitReached: ${response?.metaData?.isCharacterLimitReached} | isContainsBlockedTerm: ${response?.metaData?.isContainsBlockedTerm} | helpLevel: ${response?.metaData?.helpLevel} | isPostfix: ${response?.metaData?.isPostfix} | isDestinationSelection: ${response?.metaData?.isDestinationSelection} | isDestinationConfirmation: ${response?.metaData?.isDestinationConfirmation} | isReset: ${response?.metaData?.isReset}`
    );
  }

  const apiVersion = args.project.response.find(
    ({ name }) => name === 'version'
  );
  if (apiVersion && apiVersion.value === 1) {
    response.versionNumber = configService.getApiVersion();

    chargeGPTLogger(
      args.history.id,
      args.history.projectName,
      'versionNumber',
      response.versionNumber
    );
  }
  chargeGPTLogger(
    args.history.id,
    args.history.projectName,
    'responseId',
    response.responseId
  );

  // if there was a request for address confirmation, it was asked
  args.history.setIsAddressConfirmationNecessary(false);
  args.history.setAddressOptionsDecisionNecessary(false);

  await storeConversationHistory(args.history);

  return response;
};

const getMetaData = (
  history: ConversationHistory,
  error: any,
  triggerSendMetric?: (history: ConversationHistory) => void
): MetaData => {
  const metaData = {
    dateTime: null,
    powerType: null,
    operatorName: null,
    destination: null,
    origin: null,
    poi: null,
    connectorType: null,
    minPower: null,
    maxPower: null,
  };
  const powerType = history.getPowerType();
  const connectorType = history.getConnectorType();
  const operatorName = history.getOperatorName();
  const minPower = history.getMinPower();
  const maxPower = history.getMaxPower();
  const { latitude, longitude, address, country_code } = history.getData();

  if (error) {
    chargeGPTLogger(
      history.id,
      history.projectName,
      'noChargingStationFound',
      error.internalMessage
    );

    history.addDialog(DialogFactory.fromAssistant(error.message), true);

    if (triggerSendMetric) {
      triggerSendMetric(history);
    }
  }

  if (!isEmptyString(history.getProcessedDateTime())) {
    metaData.dateTime = history.getProcessedDateTime();
  }

  if (!isEmptyString(powerType)) {
    metaData.powerType = powerType === 'both' ? 'AC/DC' : powerType;
  }

  if (!isEmptyString(operatorName)) {
    metaData.operatorName = operatorName;
  }

  if (!isEmptyString(connectorType)) {
    metaData.connectorType = connectorType.toUpperCase();
  }

  if (!isNaN(minPower) && !isNaN(maxPower)) {
    metaData.minPower = minPower;
    metaData.maxPower = maxPower;
  }

  if (history.getCurrentCoordinates()) {
    metaData.destination = {
      coordinates: history.getCurrentCoordinates(),
    };
  }

  if (
    !isEmptyString(latitude) &&
    !isEmptyString(longitude) &&
    !isEmptyString(address)
  ) {
    metaData.destination = {
      address,
      coordinates: {
        lat: latitude,
        lng: longitude,
      },
    };

    if (!isEmptyString(country_code)) {
      metaData.destination = {
        ...metaData.destination,
        countryCode: country_code,
      };
    }
  }

  if (isRoutingRequest(history)) {
    const originAddress = history.getFoundOriginAddressName();
    const originCoordinates = history.getOriginCoordinates();
    const destinationAddress = history.getFoundDestinationAddressName();
    const destinationCoordinates = history.getDestinationCoordinates();
    const routeNeed = history.getRouteNeeds();

    metaData.origin = {
      address: originAddress,
      coordinates: {
        lat: originCoordinates?.lat,
        lng: originCoordinates?.lng,
      },
    };

    metaData.destination = {
      address: destinationAddress,
      coordinates: {
        lat: destinationCoordinates?.lat,
        lng: destinationCoordinates?.lng,
      },
    };

    if (routeNeed) {
      metaData.poi = {
        address,
        coordinates: {
          lat: latitude,
          lng: longitude,
        },
      };
    }
  }

  return metaData;
};

const filterInternalPropertiesFromResults = (
  locations: ChargingStationWithScoreDetails[]
): Location[] => {
  return locations.map((location) => {
    const {
      primaryIds,
      isCurrentlyAvailable,
      score,
      powerKwScore,
      distanceScore,
      probabilityScore,
      lastUsedScore,
      lastUsed,
      ...allowedProperties
    } = location;

    return allowedProperties;
  });
};

export function levenshteinDistance(
  value: string,
  other: string,
  ignoreAscii = false
): number {
  const codes = [];
  const cache = [];

  if (value === other) {
    return 0;
  }

  if (value.length === 0) {
    return other.length;
  }

  if (other.length === 0) {
    return value.length;
  }

  if (ignoreAscii) {
    value = value.toLowerCase();
    other = other.toLowerCase();
  }

  let index = 0;

  while (index < value.length) {
    codes[index] = value.charCodeAt(index);
    cache[index] = ++index;
  }

  let indexOther = 0;
  let result: number;

  while (indexOther < other.length) {
    const code = other.charCodeAt(indexOther);
    let index = -1;
    let distance = indexOther++;
    result = distance;

    while (++index < value.length) {
      const distanceOther = code === codes[index] ? distance : distance + 1;
      distance = cache[index];
      result =
        distance > result
          ? distanceOther > result
            ? result + 1
            : distanceOther
          : distanceOther > distance
          ? distance + 1
          : distanceOther;
      cache[index] = result;
    }
  }

  return result;
}

export const handleConversationTooLong = (
  history: ConversationHistory,
  project: ToolkitProject
) => {
  const message = getChargeGptFilterExceedTurnsLimitErrorMessage(
    project,
    history.language
  );

  history.addDialog(DialogFactory.fromAssistant(message), false);
  chargeGPTLogger(
    history.id,
    history.projectName,
    'exceedTurnLimitError',
    message
  );
};

export const logPowerTypeRecommendation = (
  history: ConversationHistory,
  requestedPowerType: string,
  locations: Location[]
) => {
  if (locations.length > 0) {
    const countAC = locations.filter((loc) => loc.powerType === 'AC').length;
    const countDC = locations.filter((loc) => loc.powerType === 'DC').length;

    const recString = `requested ${requestedPowerType} got AC ${countAC} times, DC ${countDC} times`;
    chargeGPTLogger(
      history.id,
      history.projectName,
      'powerTypeRecommendation',
      recString
    );
  }
};

export const serializeMetaData = ({
  isCharacterLimitReached = false,
  isContainsBlockedTerm = false,
  helpLevel = '',
  isPostfix = false,
  isDestinationSelection = false,
  isDestinationConfirmation = false,
  isReset = false,
}): {
  isCharacterLimitReached: boolean;
  isContainsBlockedTerm: boolean;
  helpLevel: string;
  isPostfix: boolean;
  isDestinationSelection: boolean;
  isDestinationConfirmation: boolean;
  isReset: boolean;
} => {
  return {
    isCharacterLimitReached,
    isContainsBlockedTerm,
    helpLevel,
    isPostfix,
    isDestinationSelection,
    isDestinationConfirmation,
    isReset,
  };
};

export const setIdentifiedFiltersToHistory = (
  history: ConversationHistory,
  identifiedFilters: IdentifiedFilters
) => {
  if (identifiedFilters[Cat1.MAX_POWER] !== null) {
    history.setMaxPower(identifiedFilters[Cat1.MAX_POWER] as number);
  }

  if (identifiedFilters[Cat1.MIN_POWER] !== null) {
    history.setMinPower(identifiedFilters[Cat1.MIN_POWER] as number);
  }

  if (identifiedFilters[Cat8.CONNECTOR_TYPE] !== null) {
    history.setConnectorType(identifiedFilters[Cat8.CONNECTOR_TYPE] as string);
  }

  if (identifiedFilters[Cat7.DATE_TIME]) {
    history.setDateTime(identifiedFilters[Cat7.DATE_TIME] as string);
  }

  if (identifiedFilters[Cat7.OPERATOR_NAME]) {
    history.setOperatorName(identifiedFilters[Cat7.OPERATOR_NAME] as string);
  }

  if (identifiedFilters[Cat7.POWER_TYPE] !== undefined) {
    history.setPowerType(identifiedFilters[Cat7.POWER_TYPE] as string);
  }
};

export const validateCountryCodePermissionWithinProject = (
  countryCode: any,
  projectFilters: LocationFilter[]
): {
  isError: boolean;
} => {
  if (!isEmptyString(countryCode)) {
    const countryFilters = projectFilters
      .filter(({ attribute }) => attribute === 'country')
      .map(({ value }) => value.toLowerCase());

    if (!countryFilters.includes(countryCode.toLowerCase())) {
      return {
        isError: true,
      };
    }
  }

  return {
    isError: false,
  };
};

export const isRequestCompletelyOutOfScope = (
  allIdentifiedFilters: AllIdentifiedFilters,
  lastUserInput: string
): boolean => {
  const noFilteresIdentified = Object.values(allIdentifiedFilters).every(
    (filter) => filter === undefined || filter === null || filter === 'all'
  );
  return noFilteresIdentified && !!lastUserInput;
};

export const isNoUnconfirmedAddresses = (
  unconfirmedAddresses: unknown
): boolean => {
  if (Array.isArray(unconfirmedAddresses)) {
    return unconfirmedAddresses.every((address) => !address);
  }

  return !unconfirmedAddresses;
};

export const prepareResultsAndMetaData = (
  history: ConversationHistory,
  filters: FilterResponse
) => {
  const results: any = {};
  const metaData: any = {};

  const { latitude, longitude, country_code } = history.getData();

  if (!isObjectEmpty(filters)) {
    results.filters = filters;
  }

  if (!isEmptyString(latitude) && !isEmptyString(longitude)) {
    results.destination = {
      coordinates: {
        lat: latitude,
        lng: longitude,
      },
    };

    if (!isEmptyString(history.getAddress())) {
      results.destination.address = history.getAddress();
    }

    if (!isEmptyString(country_code)) {
      results.destination.countryCode = country_code;
    }

    if (results.destination) {
      metaData.destination = results.destination;
    }
  }

  return { results, metaData };
};

const logResults = (
  conversationId: string,
  projectName: string,
  response: any,
  recommendedChargingStations: ChargingStationWithScoreDetails[]
) => {
  chargeGPTLogger(conversationId, projectName, 'dateTime', response?.dateTime);
  chargeGPTLogger(
    conversationId,
    projectName,
    'powerType',
    response?.powerType
  );
  chargeGPTLogger(
    conversationId,
    projectName,
    'operatorName',
    response?.operatorName
  );
  chargeGPTLogger(
    conversationId,
    projectName,
    'address',
    `${response?.destination?.address} | countryCode: ${response?.destination?.countryCode} | coordinates: ${response?.destination?.coordinates?.lat}, ${response?.destination?.coordinates?.lng}`
  );
  chargeGPTLogger(
    conversationId,
    projectName,
    'origin',
    `${response?.origin?.address} | coordinates: ${response?.origin?.coordinates?.lat}, ${response?.origin?.coordinates?.lng}`
  );
  chargeGPTLogger(
    conversationId,
    projectName,
    'poi',
    `${response?.poi?.address} | coordinates: ${response?.poi?.coordinates?.lat}, ${response?.poi?.coordinates?.lng}`
  );

  for (const location of recommendedChargingStations) {
    chargeGPTLogger(
      conversationId,
      projectName,
      'location',
      `locationId: ${location.locationId} | recommendation: ${
        location?.recommendation
      } | coordinates: ${location?.lat}, ${location?.lng} | powerType: ${
        location?.powerType
      } | powerKw: ${location?.powerKw} | powerKwScore: ${
        location?.powerKwScore
      }| connectorType: ${location?.connectorTypes.toString()} | distance: ${
        location?.distance
      }| distanceScore: ${location?.distanceScore} | probability: ${
        location?.probability
      } | probabilityScore: ${location?.probabilityScore} | lastUsed: ${
        location?.lastUsed
      } | lastUsedScore: ${location?.lastUsedScore} | score: ${location?.score}`
    );
  }
};

export const addressSearch = async (
  history: ConversationHistory,
  project: ToolkitProject,
  address: string,
  isLocationAlreadyConfirmed: boolean
) => {
  const conversationId = history.id;
  const projectName = project.name;

  const addressCharacteristicsOutput = await identifyAddressCharacteristics(
    address,
    conversationId,
    projectName,
    project.chargegpt_output_type,
    history.language.toLowerCase()
  );

  history.setAddressCharacteristics(addressCharacteristicsOutput);
  history.setLastAddressQueryString(address);
  history.setIsAddressInvalid(false);

  if (
    isHighwayOrRoutingRequest(history) &&
    shouldOverridePowerToRapid(history)
  ) {
    setRapidPowerToHistory(history);
  }

  if (addressCharacteristicsOutput.error) {
    chargeGPTLogger(
      conversationId,
      projectName,
      'processedAddressError',
      addressCharacteristicsOutput.error
    );
    history.setIsAddressInvalid(true);

    throw new AddressNotFoundError(
      'Address is invalid',
      addressCharacteristicsOutput.addressSummary
    );
  }

  const { isError } = await validateCountryCodePermissionWithinProject(
    addressCharacteristicsOutput.countryCode,
    project.filters
  );

  if (isError) {
    throw new AddressOutOfScopeError(
      `Missing permission(s) to the following feature(s): Data access to country ${addressCharacteristicsOutput.countryCode.toUpperCase()}`,
      addressCharacteristicsOutput.countryCode
    );
  }

  if (
    isChargePointSearchNeededForPoiCategories(
      addressCharacteristicsOutput.poiCategories,
      addressCharacteristicsOutput.poiName
    ) &&
    !isSpecialPoiCategories(addressCharacteristicsOutput)
  ) {
    return searchDestinationBasedOnChargingStations(
      history,
      project,
      addressCharacteristicsOutput,
      isLocationAlreadyConfirmed
    );
  }

  return getDestinationAndSetToHistory(
    history,
    project,
    addressCharacteristicsOutput,
    isLocationAlreadyConfirmed
  );
};

export const updateStateMachine = (
  history: ConversationHistory,
  state: SupportedStateMachineEnum
) => {
  history.setStateMachine(state);
};

export const excludeRecommendedChargePoints = (
  availableChargePoints: ChargingStationWithScoreDetails[],
  blockedIds: string[]
) => {
  const filteredChargePoints = availableChargePoints.filter(
    (chargePoint) => !blockedIds.includes(chargePoint.locationId)
  );

  return filteredChargePoints;
};

export const isHighwayOrRoutingRequest = (
  history: ConversationHistory
): boolean => {
  return (
    (!isEmptyString(history.getDestinationAddress()) &&
      !isEmptyString(history.getOriginAddress())) ||
    history.getAddressCharacteristics().isHighwayRequested
  );
};

export const shouldOverridePowerToRapid = (history: ConversationHistory) => {
  if (isNaN(history.getMinPower()) && isNaN(history.getMaxPower())) {
    return true;
  }

  return false;
};

export const setRapidPowerToHistory = (history: ConversationHistory) => {
  history.setMinPower(DEFAULT_MIN_RAPID_POWER);
  history.setMaxPower(DEFAULT_MAX_POWER);
};

const isRoutingRequest = (history: ConversationHistory) => {
  return (
    !isEmptyString(history.getDestinationAddress()) &&
    !isEmptyString(history.getOriginAddress())
  );
};
