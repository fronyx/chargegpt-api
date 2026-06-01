import { Injectable } from '@nestjs/common';
import { LocationDeniedResponse } from '../../../../../apps/cdk-apps/src/shared/models/general/chargegpt-translation';
import {
  ConversationHistory,
  coordinates2String,
  SupportedStateMachineEnum,
} from '../models/conversation-history.model';
import { TranslationsService } from '@fronyx/translations';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import * as Sentry from '@sentry/node';
import {
  IdentifiedAddressFilters,
  IdentifiedAddressFiltersRequest,
  RequestIdentifierAddressService,
} from './address-identifiers/request-identifier-address.service';
import { initializeFilter as initializeFilterConversationPrompt } from './initialize-filter.util';
import { resetHistoryCurrentCoordinates } from './current-coordinates-setter.util';
import { useTryAsync } from 'no-try';
import {
  FiltersCategoriesIdentifiersService,
  IdentifiedFilters,
} from './filters-identifiers/filters-categories-identifiers.service';
import {
  isRequestCompletelyOutOfScope,
  setIdentifiedFiltersToHistory,
  levenshteinDistance,
  addressSearch,
  answer,
  manuallyGeneratedErrorMessage,
  userNeedHelp,
  helpAnswer,
  askForLocationContext,
  returnQuestion,
  returnResults,
  searchRecommendationsAlongRoute,
  getAnotherChargePointRecommendations,
  setRapidPowerToHistory,
  shouldOverridePowerToRapid,
  validateCountryCodePermissionWithinProject,
} from './conversations-helper.service';
import { Answer, Coordinates, DialogFactory } from '../models/prompt';
import { getVisibleAddressOptionsToBeDisplayed } from './address-options-decision/address-options-decision.service';
import { chargeGPTLogger } from '../models/chat-utilities';
import {
  isDestinationInformationInHistory,
  isCurrentCoordinatesInHistory,
} from './address-filter-identifiers-function';
import { AddressOption } from './address-services/models/address.model';
import { distanceInMeterBetween2Locations } from './address-services/poi-search-utils.service';
import { AllIdentifiedFilters } from './help-agent.service';
import { identifyRecommendationHelpNeeded } from './recommendation-help-agent.service';
import { setSelectedAddressOptionToHistory } from './conversation-destination-search.service';
import { isRoutingEnabled, ToolkitProject } from '@fronyx/toolkit';
import { firstLevelHelpRequestIdentifier } from './qa-agent.service';
import {
  IdentifiedRouteNeedsRequest,
  identifyRouteNeeds,
} from './address-identifiers/route-needs.service';
import {
  getAddressDetails,
  isRoutingUseCase,
} from './routes-services/route-search.service';
import { informRouteNotSupported } from './routes-services/route-search-unsupported.service';
import { getAddressFromCurrentCoordinates } from './address-services/search-poi.service';
import { AddressOutOfScopeError } from '../models/address-search-error';
import { LocationFilter } from '../../../../../apps/cdk-apps/src/shared';
import { getRecommendationsForAllAddressOptions } from './address-options-recommendation-service/address-options-recommendation.service';
import { mapAddressResultsIntoAddressOptions } from './address-services/address-options-display.service';

const addressFilterProperties: IdentifiedAddressFilters = {
  request: {
    origin: null,
    destination: null,
    is_nearby_requested: false,
    is_location_confirmed: null,
    is_location_blocked: null,
  },
  error: null,
};

@Injectable()
export class ConversationsAgentService {
  constructor(
    private readonly filtersCategoriesIdentifiersService: FiltersCategoriesIdentifiersService,
    private readonly requestIdentifierAddressService: RequestIdentifierAddressService
  ) {}

  async process(
    history: ConversationHistory,
    project: ToolkitProject
  ): Promise<Answer> {
    initializeFilterConversationPrompt(history);

    return history.isCurrentCoordinatesRequested()
      ? this.processLocationContextResponse(history, project)
      : this.identifyPossibleFiltersInRequest(history, project);
  }

  async identifyPossibleFiltersInRequest(
    history: ConversationHistory,
    project: ToolkitProject
  ) {
    const [
      identifiedFiltersByCategories,
      identifiedAddressFilters,
      identifiedOverideHelpResponse,
      identifiedRecommendationHelp,
    ] = await Promise.all([
      this.filtersCategoriesIdentifiersService.identifyAllFilters(
        history,
        project
      ),
      this.requestIdentifierAddressService.identifyFilters(history, project),
      firstLevelHelpRequestIdentifier(history, project),
      history.getRecommendedChargingStations().length > 0
        ? identifyRecommendationHelpNeeded(history, project)
        : null,
    ]);

    setIdentifiedFiltersToHistory(history, identifiedFiltersByCategories);

    if (identifiedRecommendationHelp !== null) {
      return helpAnswer(history, identifiedRecommendationHelp, project);
    }

    if (identifiedOverideHelpResponse !== null) {
      return helpAnswer(history, identifiedOverideHelpResponse, project);
    }

    return this.continueWithFurtherIdentificationOfPossibleFiltersInRequest(
      history,
      project,
      identifiedAddressFilters,
      identifiedFiltersByCategories
    );
  }

  async continueWithFurtherIdentificationOfPossibleFiltersInRequest(
    history: ConversationHistory,
    project: ToolkitProject,
    identifiedAddressFilters: IdentifiedAddressFilters,
    identifiedFiltersByCategories: IdentifiedFilters
  ): Promise<Answer> {
    if (
      !identifiedAddressFilters?.request ||
      (identifiedAddressFilters?.request &&
        Object.keys(identifiedAddressFilters.request).length === 1 &&
        identifiedAddressFilters?.request.destination === '{city}')
    ) {
      return this.identifyIfHelpNeededAfterAddressIdentification(
        history,
        project,
        identifiedAddressFilters,
        identifiedFiltersByCategories
      );
    }

    return this.continueWithAddressProcessing(
      history,
      project,
      identifiedAddressFilters,
      identifiedFiltersByCategories
    );
  }

  async identifyIfHelpNeededAfterAddressIdentification(
    history: ConversationHistory,
    project: ToolkitProject,
    identifiedAddressFilters: IdentifiedAddressFilters,
    identifiedFiltersByCategories: IdentifiedFilters
  ): Promise<Answer> {
    // TODO check whether options shown in the previous request

    if (
      isRequestCompletelyOutOfScope(
        {
          ...(identifiedFiltersByCategories ?? {}),
          ...(identifiedAddressFilters?.request ?? {}),
        } as AllIdentifiedFilters,
        history.getLastUserInput()
      )
    ) {
      return userNeedHelp(history, project);
    }

    if (
      identifiedAddressFilters &&
      identifiedAddressFilters.request &&
      !isObjectEmpty(identifiedAddressFilters.request) &&
      (identifiedAddressFilters.request.destination as string) !== '{city}'
    ) {
      return this.continueWithAddressProcessing(
        history,
        project,
        identifiedAddressFilters,
        identifiedFiltersByCategories
      );
    }

    if (isDestinationInformationInHistory(history)) {
      return this.continueWithAddressProcessing(
        history,
        project,
        identifiedAddressFilters,
        identifiedFiltersByCategories
      );
    }

    if (
      isCurrentCoordinatesInHistory(history) &&
      history.getOriginAddress() &&
      history.getDestinationAddress()
    ) {
      const addressFilterWtihNearbyRequestedTag: IdentifiedAddressFilters = {
        ...addressFilterProperties,
        request: {
          ...addressFilterProperties.request,
          origin: history.getOriginAddress(),
          destination: history.getDestinationAddress(),
        },
      };

      return this.continueWithAddressProcessing(
        history,
        project,
        addressFilterWtihNearbyRequestedTag,
        identifiedFiltersByCategories
      );
    }

    if (isCurrentCoordinatesInHistory(history)) {
      const addressFilterWtihNearbyRequestedTag: IdentifiedAddressFilters = {
        ...addressFilterProperties,
        request: {
          ...addressFilterProperties.request,
          is_nearby_requested: true,
        },
      };

      return this.continueWithAddressProcessing(
        history,
        project,
        addressFilterWtihNearbyRequestedTag,
        identifiedFiltersByCategories
      );
    }

    const addressFilterWithCityTag: IdentifiedAddressFilters = {
      ...addressFilterProperties,
      request: {
        ...addressFilterProperties.request,
        destination: '{city}',
      },
    };

    return this.continueWithAddressProcessing(
      history,
      project,
      addressFilterWithCityTag,
      identifiedFiltersByCategories
    );
  }

  async identifyPossibleAddressInRequest(
    history: ConversationHistory,
    project: ToolkitProject,
    identifiedFiltersByCategories: IdentifiedFilters
  ) {
    const identifiedAddressFilters: IdentifiedAddressFilters =
      await this.requestIdentifierAddressService.identifyFilters(
        history,
        project
      );

    const replaceErrorWithNearbyRequested = (
      identifiedAddressFilters: IdentifiedAddressFilters,
      isNearbyRequested: boolean
    ) => {
      if (
        identifiedAddressFilters.error &&
        identifiedAddressFilters.request === null &&
        isNearbyRequested === true
      ) {
        return {
          error: null,
          request: {
            is_nearby_requested: true,
          },
        } as IdentifiedAddressFilters;
      }

      return identifiedAddressFilters;
    };

    return !replaceErrorWithNearbyRequested(
      identifiedAddressFilters,
      history.getIsNearbyRequested()
    )?.request
      ? this.identifyIfHelpNeededAfterAddressIdentification(
          history,
          project,
          replaceErrorWithNearbyRequested(
            identifiedAddressFilters,
            history.getIsNearbyRequested()
          ),
          identifiedFiltersByCategories
        )
      : this.continueWithAddressProcessing(
          history,
          project,
          replaceErrorWithNearbyRequested(
            identifiedAddressFilters,
            history.getIsNearbyRequested()
          ),
          identifiedFiltersByCategories
        );
  }

  async continueWithAddressProcessing(
    history: ConversationHistory,
    project: ToolkitProject,
    identifiedAddressFilters: IdentifiedAddressFilters,
    identifiedFiltersByCategories: IdentifiedFilters
  ): Promise<Answer> {
    return continueWithAddressProcessing(
      history,
      project,
      identifiedAddressFilters,
      identifiedFiltersByCategories
    );
  }

  async processLocationContextResponse(
    history: ConversationHistory,
    project: ToolkitProject
  ): Promise<Answer> {
    return history.isLocationEnabled()
      ? this.identifyPossibleAddressInRequest(history, project, {} as any)
      : this.processLocationContextDeniedResponse(history, project);
  }

  //TODO do we still need this?
  async processLocationContextDeniedResponse(
    history: ConversationHistory,
    project: ToolkitProject
  ): Promise<Answer> {
    history.setIsCurrentCoordinatesRequested(false);
    history.setIsNearbyRequested(false);

    if (history.getData().unconfirmed_address) {
      return this.identifyPossibleAddressInRequest(history, project, {} as any);
    }

    if (!history.getData().unconfirmed_address) {
      // Current coordinates denied, ask for location instead
      return this.askForCurrentLocation(history, project);
    }

    throw new Error('TODO: Not implemented');
  }

  async askForCurrentLocation(
    history: ConversationHistory,
    project: ToolkitProject
  ): Promise<Answer> {
    const translation = new TranslationsService(history.language);
    translation.setAsset('LocationDeniedResponse', LocationDeniedResponse);
    history.addDialog(
      DialogFactory.fromAssistant(translation.get('LocationDeniedResponse')),
      false
    );

    resetHistoryCurrentCoordinates(history);

    return answer({
      history,
      project: project,
      isClosed: false,
    });
  }
}

export const setBlockedLocationsToHistory = (
  history: ConversationHistory,
  project: ToolkitProject
) => {
  const currentAddressOptions = history.getAddressOptions();

  if (!currentAddressOptions || currentAddressOptions.length < 1) {
    return;
  }

  const visibleAddressOptions = getVisibleAddressOptionsToBeDisplayed(
    currentAddressOptions
  );

  if (visibleAddressOptions.length < 1) {
    return;
  }

  visibleAddressOptions.forEach((addressOption: any) => {
    chargeGPTLogger(
      history.id,
      project.name,
      'BlockedLocationAddressId',
      `${addressOption.addressId}, ${addressOption.address}`
    );

    history.addBlockedLocation(addressOption.addressId);
  });
};

export const setBlockedChargingStationsToHistory = (
  history: ConversationHistory
) => {
  const blockedChargingStations = history.getRecommendedChargingStations();
  blockedChargingStations.forEach((chargingStation) => {
    history.addBlockedLocation(chargingStation.locationId);
  });
};

export const getClosestAddressOption = (
  addressOptions: AddressOption[],
  currentCoordinates: { lat: number; lng: number }
): AddressOption | null => {
  if (!currentCoordinates) {
    throw new Error('Missing current coordinates');
  }

  if (!addressOptions || addressOptions.length === 0) {
    throw new Error('Missing address options');
  }

  const optionsWithDistance = addressOptions.map((addressOption) => {
    const distance = distanceInMeterBetween2Locations(
      currentCoordinates.lat,
      currentCoordinates.lng,
      addressOption.lat,
      addressOption.lng
    );

    return [distance, addressOption];
  });

  const closestDistance = Math.min(
    ...optionsWithDistance.map(([d]) => d as number)
  );

  const closestOptionWithDistance = optionsWithDistance.find(
    ([distance]) => distance === closestDistance
  );

  if (!closestOptionWithDistance) {
    return null;
  }

  const [, closestDestination] = closestOptionWithDistance;

  return closestDestination as AddressOption;
};

export const getSelectedAddressOption = (
  addressOptions: AddressOption[],
  destination: string
) => {
  let selectedDestination;

  selectedDestination = addressOptions.find(
    ({ address }) =>
      address.toLowerCase().trim() === destination.toLowerCase().trim()
  );

  if (!selectedDestination) {
    selectedDestination = addressOptions.find(({ address }) =>
      address.toLowerCase().trim().includes(destination.toLowerCase().trim())
    );
  }

  if (!selectedDestination) {
    const similaritiesDistances = addressOptions.map(({ address }) =>
      levenshteinDistance(destination, address, true)
    );
    const nearestIndex = similaritiesDistances.indexOf(
      Math.min(...similaritiesDistances)
    );

    selectedDestination = addressOptions[nearestIndex];
  }

  return selectedDestination;
};

export const continueWithAddressProcessing = async (
  history: ConversationHistory,
  project: ToolkitProject,
  identifiedAddressFilters: IdentifiedAddressFilters,
  identifiedFiltersByCategories: IdentifiedFilters | null | undefined
) => {
  const addressFilters =
    identifiedAddressFilters?.request ??
    ({} as IdentifiedAddressFiltersRequest);

  // set blocked address options
  if (
    addressFilters.is_location_blocked &&
    history.getStateMachine() ===
      SupportedStateMachineEnum.SHOWED_ADDRESS_OPTIONS
  ) {
    setBlockedLocationsToHistory(history, project);
  }

  if (
    addressFilters.is_location_blocked &&
    history.getRecommendedChargingStations().length > 0 &&
    (history.getStateMachine() ===
      SupportedStateMachineEnum.SHOWED_CHARGE_POINT_ALONG_ROUTE_RECOMMENDATIONS ||
      history.getStateMachine() ===
        SupportedStateMachineEnum.SHOWED_CHARGE_POINT_RECOMMENDATIONS)
  ) {
    setBlockedChargingStationsToHistory(history);
  }

  if (
    addressFilters.is_location_blocked &&
    history.getRecommendedChargingStations().length > 0 &&
    history.getStateMachine() ===
      SupportedStateMachineEnum.SHOWED_CHARGE_POINT_RECOMMENDATIONS
  ) {
    // Use case: User want a different charge point recommendation
    return getAnotherChargePointRecommendations(history, project);
  }

  if (
    addressFilters.is_location_blocked &&
    history.getRecommendedChargingStations().length > 0 &&
    history.getStateMachine() ===
      SupportedStateMachineEnum.SHOWED_CHARGE_POINT_ALONG_ROUTE_RECOMMENDATIONS
  ) {
    // Use case: User want a different charge point recommendation along route
    const originCoordinates = history.getOriginCoordinates();
    const destinationCoordinates = history.getDestinationCoordinates();
    const routeNeed = history.getRouteNeeds();

    return searchRecommendationsAlongRoute(
      history,
      project,
      originCoordinates,
      destinationCoordinates,
      routeNeed
    );
  }

  let destination = addressFilters.destination as string;
  const origin = getOriginAddressFromContext(
    addressFilters.origin as string,
    history.getOriginAddress(),
    history.isLocationEnabled()
  );
  const isNearbyRequested = addressFilters.is_nearby_requested as boolean;

  if (origin && destination && !isRoutingEnabled(project)) {
    // Force return help for routing requests
    return informRouteNotSupported(history, project);
  }

  history.setIsLocationConfirmed(
    addressFilters.is_location_confirmed as boolean
  );
  history.setIsNearbyRequested(!!isNearbyRequested);

  if (destination && destination !== '{city}') {
    history.setOriginAddress(origin);

    history.setDestinationAddress(
      destination.replace(', {city}', '').replace('{city}', '')
    );
  }

  if (
    history.getIsNearbyRequested() &&
    !history.isCurrentCoordinatesRequested() &&
    !history.isLocationEnabled() &&
    !(
      isRoutingUseCase(origin ?? history.getOriginAddress(), destination) &&
      isRoutingEnabled(project)
    )
  ) {
    // Use case: Ask for location context
    return askForLocationContext(history, project);
  } else if (
    isNearbyRequested &&
    history.getAddressOptions().length > 1 &&
    history.isLocationEnabled() &&
    !(
      isRoutingUseCase(origin ?? history.getOriginAddress(), destination) &&
      isRoutingEnabled(project)
    )
  ) {
    // Use case: Choose the closest address option to user location
    const closestDestination = getClosestAddressOption(
      history.getAddressOptions(),
      history.getCurrentCoordinates()
    );

    if (closestDestination) {
      setSelectedAddressOptionToHistory(history, closestDestination);

      history.setIsLocationConfirmed(true);
      history.setIsNearbyRequested(false);
      history.setAddressOptions([]);
    } else {
      throw new Error('Unsupported behaviour: No closest option found.');
    }
  } else if (
    history.isLocationEnabled() &&
    (isNearbyRequested || history.isCurrentCoordinatesRequested()) &&
    !history.isCurrentCoordinatesSameWithPreviousQueryString(
      coordinates2String(history.getCurrentCoordinates())
    ) &&
    !(
      isRoutingUseCase(origin ?? history.getOriginAddress(), destination) &&
      isRoutingEnabled(project)
    )
  ) {
    // Use case: Set current coordinates as destination coordinates
    history.setSwitchReason(undefined);
    const currentCoordinates = history.getCurrentCoordinates();

    const [err] = await useTryAsync(() =>
      getAddressOptionForCurrentCoordinateIfValid(
        currentCoordinates,
        project.filters
      )
    );

    if (err) {
      console.error('Error validate current coordinates:', err);
      return manuallyGeneratedErrorMessage(history, project, err);
    }

    history.setLatitude(currentCoordinates?.lat?.toString());
    history.setLongitude(currentCoordinates?.lng?.toString());
    history.setDone(true);
    history.setIsCurrentCoordinatesRequested(false);
    history.setIsNearbyRequested(true);
    history.setLastAddressQueryString(null);

    destination = history.getDestinationAddress() ?? destination;
  }

  let isCityRequested = false;

  if (
    destination &&
    destination.includes('{city}') &&
    history.isLocationEnabled()
  ) {
    destination = destination.replace('{city}', '');
  }

  if (
    destination &&
    destination.includes('{city}') &&
    history.getLastUserInput()
  ) {
    isCityRequested = true;
    history.setSwitchReason('<CITY_REQUIRED>');
  }

  let shouldResetIsLocationConfirmed = false;
  if (
    history.getIsLocationConfirmed() &&
    history.getAddressOptions().length > 0
  ) {
    // Use case: User choosed a location from address options
    history.setSwitchReason(undefined);

    if (history.getAddressOptions()?.length > 0) {
      const selectedDestination = getSelectedAddressOption(
        history.getAddressOptions(),
        destination
      );

      if (selectedDestination && !isRoutingUseCase(origin, destination)) {
        setSelectedAddressOptionToHistory(
          history,
          selectedDestination ?? history.getAddressOptions()[0]
        );

        shouldResetIsLocationConfirmed = true;
      } else if (selectedDestination && isRoutingUseCase(origin, destination)) {
        // Use case: User select a location from address options along a route

        const [originError, originDetails] = await useTryAsync(() =>
          getOriginDetails(history, origin, project)
        );

        if (originError) {
          return manuallyGeneratedErrorMessage(history, project, originError);
        }

        history.setFoundOriginAddressName(originDetails.address);
        history.setFoundDestinationAddressName(selectedDestination.address);

        const originCoordinates = {
          lat: originDetails.lat,
          lng: originDetails.lng,
        };

        const destinationCoordinates = {
          lat: selectedDestination.lat,
          lng: selectedDestination.lng,
        };

        const routeNeed = history.getRouteNeeds();

        history.setIsLocationConfirmed(false);
        history.setDestinationCoordinates(destinationCoordinates);
        history.setOriginCoordinates(originCoordinates);

        return searchRecommendationsAlongRoute(
          history,
          project,
          originCoordinates,
          destinationCoordinates,
          routeNeed
        );
      } else {
        // Handling if address identifiers makes a mistake and no address is selected
        Sentry.captureException(
          new Error('Location confirmed, but no address option selected.')
        );

        console.error(
          'Location confirmed, but no address option selected.',
          history.getAddressOptions(),
          destination
        );

        const [err] = await useTryAsync(() =>
          addressSearch(history, project, destination, false)
        );

        if (err) {
          console.error('Error get selected destination from options:', err);
          return manuallyGeneratedErrorMessage(history, project, err);
        }
      }

      history.setAddressOptions([]);
    }
  } else if (
    // TODO try to find out which condition does this block handles.
    // Maybe this is to avoid searching charging stations with coordinates 0,0.
    !destination &&
    history.getDestinationAddress() &&
    !isCityRequested &&
    history.getAddressOptions().length > 0
  ) {
    const [err] = await useTryAsync(() =>
      addressSearch(
        history,
        project,
        history.getDestinationAddress(),
        history.getIsLocationConfirmed()
      )
    );

    if (err) {
      console.error('Error address search from history:', err);
      return manuallyGeneratedErrorMessage(history, project, err);
    }
  } else if (
    destination &&
    !isCityRequested &&
    history.getAddressOptions().length < 1 &&
    !history.isAddressSameWithPreviousQueryString(destination) &&
    !(
      isRoutingUseCase(origin ?? history.getOriginAddress(), destination) &&
      isRoutingEnabled(project)
    )
  ) {
    // Use case: Get destination coordinates
    const [err] = await useTryAsync(() =>
      addressSearch(
        history,
        project,
        destination,
        history.getIsLocationConfirmed()
      )
    );

    if (err) {
      console.error('Error address search:', err);
      return manuallyGeneratedErrorMessage(history, project, err);
    }
  } else if (
    destination &&
    !isCityRequested &&
    history.getAddressOptions().length > 0 &&
    !history.isAddressSameWithPreviousQueryString(destination)
  ) {
    // Use case: User mentioned a new destination address after address options are shown
    const [err] = await useTryAsync(() =>
      addressSearch(
        history,
        project,
        destination,
        history.getIsLocationConfirmed()
      )
    );

    if (err) {
      console.error('Error new address search:', err);
      return manuallyGeneratedErrorMessage(history, project, err);
    }
  } else if (
    history.getBlockedLocations().length > 0 &&
    history.getStateMachine() ===
      SupportedStateMachineEnum.SHOWED_ADDRESS_OPTIONS
  ) {
    // Use case: User want a different address option
    const availableOptions = history.getAddressOptions();
    history.setAddressOptions(availableOptions);

    if (history.getAddressOptions().length === 1) {
      const [option] = history.getAddressOptions();
      history.setAddress(option.address);
      history.setLatitude(String(option.lat));
      history.setLongitude(String(option.lng));
      history.setDone(true);
    } else if (history.getAddressOptions().length < 1) {
      history.setIsAddressInvalid(true);
      history.setAddressOptionsDecisionNecessary(false);
    }
  }

  if (history.getIsAddressOptionsDecisionNecessary()) {
    history.setSwitchReason('<ADDRESS_OPTIONS_DECISION_NEEDED>');
  }

  if (
    !(
      isRoutingUseCase(origin ?? history.getOriginAddress(), destination) &&
      isRoutingEnabled(project)
    ) &&
    history.getIsLocationsAreSearchBasedOnAddressOptions()
  ) {
    return getRecommendationsForAllAddressOptions(
      history,
      project,
      history.getAddressOptions()
    );
  }

  if (history.getIsAddressConfirmationNecessary()) {
    history.setSwitchReason('<CONFIRMATION_REQUIRED>');
  }

  if (history.getIsAddressInvalid()) {
    history.setSwitchReason('<ADDRESS_INVALID>');
  }

  if (!history.getSwitchReason() && origin && destination) {
    if (origin && destination && isRoutingEnabled(project)) {
      history.setOriginAddress(origin);
      history.setDestinationAddress(destination);

      if (shouldOverridePowerToRapid(history)) {
        setRapidPowerToHistory(history);
      }

      const routeNeeds = await getRouteNeeds(
        history,
        project,
        identifyRouteNeeds
      );
      if (routeNeeds) {
        history.setRouteNeeds(routeNeeds);
      }

      if (
        isCurrentCoordinateRequestedForRoute(origin) &&
        !history.getCurrentCoordinates()
      ) {
        return askForLocationContext(history, project);
      }

      if (isCurrentCoordinateRequestedForRoute(origin)) {
        const currentCoordinates = history.getCurrentCoordinates();

        const [err, originAddress] = await useTryAsync(() =>
          getAddressOptionForCurrentCoordinateIfValid(
            currentCoordinates,
            project.filters
          )
        );

        if (err) {
          console.error('Error validate current coordinates:', err);
          return manuallyGeneratedErrorMessage(history, project, err);
        } else {
          history.setOriginAddress(originAddress.address);
          history.setFoundOriginAddressName(originAddress.address);
          const originCoordinates = {
            lat: originAddress.lat,
            lng: originAddress.lng,
          };
          history.setOriginCoordinates(originCoordinates);
        }
      } else {
        const [originError, originDetails] = await useTryAsync(() =>
          getOriginDetails(history, origin, project)
        );

        if (originError) {
          // TODO validate to see whether we need to reset the origin and destination from within ConversationHistory
          return manuallyGeneratedErrorMessage(history, project, originError);
        }

        history.setFoundOriginAddressName(originDetails.address);

        const originCoordinates = {
          lat: originDetails.lat,
          lng: originDetails.lng,
        };
        history.setOriginCoordinates(originCoordinates);
      }

      const [destinationError, destinationDetails] = await useTryAsync(() =>
        getAddressDetails(history, project, destination, false)
      );

      if (destinationError) {
        // TODO validate to see whether we need to reset the origin and destination from within ConversationHistory
        return manuallyGeneratedErrorMessage(
          history,
          project,
          destinationError
        );
      }

      history.setFoundDestinationAddressName(destinationDetails.address);

      const destinationCoordinates = {
        lat: destinationDetails.lat,
        lng: destinationDetails.lng,
      };

      history.setDestinationCoordinates(destinationCoordinates);

      return searchRecommendationsAlongRoute(
        history,
        project,
        history.getOriginCoordinates(),
        destinationCoordinates,
        history.getRouteNeeds()
      );
    } else if (origin && destination && !isRoutingEnabled(project)) {
      // Force return help for routing requests
      return informRouteNotSupported(history, project);
    }
  }

  if (!history.getIsLocationConfirmed() && !!history.getSwitchReason()) {
    let lastUserInput = destination;
    if (history.getIsAddressOptionsDecisionNecessary()) {
      // Use case: Showing address options to user
      lastUserInput = getVisibleAddressOptionsToBeDisplayed(
        history.getAddressOptions()
      )
        .map(({ address }: any, idx) => `${idx + 1}.) ${address}`)
        .join(', ');

      history.setDestinationAddress(destination);
    } else if (history.getIsAddressConfirmationNecessary()) {
      // Use case: No showing options necessary, take first option as destination
      lastUserInput = history.getAddressOptions()[0].address;
    }

    return returnQuestion(history, project, lastUserInput);
  }

  if (shouldResetIsLocationConfirmed) {
    history.setIsLocationConfirmed(false);
  }

  return isRequestCompletelyOutOfScope(
    {
      ...(identifiedFiltersByCategories ?? {}),
      ...(addressFilters ? { request: addressFilters } : {}),
    } as AllIdentifiedFilters,
    history.getLastUserInput()
  )
    ? userNeedHelp(history, project)
    : returnResults(history, project);
};

const getOriginDetails = async (
  history: ConversationHistory,
  origin: string,
  project: ToolkitProject
): Promise<AddressOption> => {
  if (isCurrentCoordinateRequestedForRoute(origin)) {
    return getAddressOptionForCurrentCoordinateIfValid(
      history.getCurrentCoordinates(),
      project.filters
    );
  }

  return getAddressDetails(history, project, origin);
};

const isCurrentCoordinateRequestedForRoute = (origin: string) => {
  return origin.includes('{is_nearby}');
};

const getOriginAddressFromContext = (
  identifiedOrigin: string,
  historyOrigin: string,
  isLocationEnabled: boolean
) => {
  if (
    !identifiedOrigin &&
    historyOrigin === '{is_nearby}' &&
    isLocationEnabled
  ) {
    return '{is_nearby}';
  }

  return identifiedOrigin;
};

export const getRouteNeeds = async (
  history: ConversationHistory,
  project: ToolkitProject,
  identifyRouteNeedFn: any
) => {
  const response = await identifyRouteNeedFn(history, project);

  const filter = response?.request ?? ({} as IdentifiedRouteNeedsRequest);
  const routeNeed = filter.route_need;

  if (!routeNeed || routeNeed === 'null') {
    return null;
  }

  return routeNeed;
};

export const getAddressOptionForCurrentCoordinateIfValid = async (
  currentCoordinates: Coordinates | null,
  projectFilters: LocationFilter[]
): Promise<AddressOption> => {
  if (!currentCoordinates) {
    throw new Error('No current coordinates in history.');
  }

  const currentAddress = await getAddressFromCurrentCoordinates(
    currentCoordinates
  );

  if (!currentAddress) {
    throw new AddressOutOfScopeError(
      `No country code found for coordinates: ${currentCoordinates.lat}, ${currentCoordinates.lng}`,
      ''
    );
  }

  const addressOption = mapAddressResultsIntoAddressOptions([
    currentAddress,
  ])[0];

  const { isError } = validateCountryCodePermissionWithinProject(
    addressOption.countryCode,
    projectFilters
  );

  if (isError) {
    throw new AddressOutOfScopeError(
      `Missing permission(s) to the following feature(s): Data access to country ${addressOption.countryCode.toUpperCase()}`,
      addressOption.countryCode
    );
  }

  return {
    ...addressOption,
    lat: currentCoordinates.lat,
    lng: currentCoordinates.lng,
  };
};
