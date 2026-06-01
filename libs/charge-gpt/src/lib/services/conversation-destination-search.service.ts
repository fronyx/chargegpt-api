import {
  ConversationHistory,
  SupportedStateMachineEnum,
} from '../models/conversation-history.model';
import { AddressOption } from './address-services/models/address.model';
import { alpha3to2Map } from '@fronyx/data-transfer-object';
import { getPotentialDestinations } from './address-services/poi-search.service';
import { ToolkitProject } from '@fronyx/toolkit';
import { AddressCharacteristics } from './address-identifiers/address-characteristics.model';
import { getSupportedCountriesFromProject } from '@fronyx/toolkit';
import { chargeGPTLogger } from '../models/chat-utilities';
import { AddressNotFoundError } from '../models/address-search-error';
import {
  getConversationContextForNotShowingAddressOptionsUseCase,
  isNotShowingAddressOptionsUseCase,
} from './business-name-request-utils.service';
import { shouldAddressOptionBeDisplayed } from './address-options-decision/address-options-decision.service';
import { updateStateMachine } from './conversations-helper.service';

export const getDestinationAndSetToHistory = async (
  history: ConversationHistory,
  project: ToolkitProject,
  addressCharacteristicsOutput: Partial<AddressCharacteristics>,
  isLocationAlreadyConfirmed: boolean
): Promise<void> => {
  const { error, addressOptions, isPoiSearch } = await getPotentialDestinations(
    addressCharacteristicsOutput,
    {
      isNearbyRequested: history.getIsNearbyRequested(),
      currentCoordinates: history.getCurrentCoordinates(),
      language: history.language,
      supportedCountries: getSupportedCountriesFromProject(project),
      projectName: project.name,
      disableCountryScopeValidation: false,
    }
  );

  history.setIsDestinationAPOI(isPoiSearch);

  if (error) {
    chargeGPTLogger(
      history.id,
      history.projectName,
      'POISearchServiceError',
      error.internalMessage
    );

    // TODO reset origin as well?
    history.setDestinationAddress('');
    history.setLatitude('');
    history.setLongitude('');

    throw new AddressNotFoundError(
      error.internalMessage,
      addressCharacteristicsOutput.addressSummary
    );
  }

  let showOptions = false;

  if (!isLocationAlreadyConfirmed) {
    /**
     * This block is executed when:
     * - During subsequent request where the user blocked a locations (should not happen) TODO
     * - During request where options already shown, but user requested a new destination that also has an option
     * - During request where address options should be shown to the user
     */
    showOptions = shouldAddressOptionBeDisplayed(
      addressOptions,
      addressCharacteristicsOutput
    );
  }

  if (
    showOptions &&
    isNotShowingAddressOptionsUseCase(
      addressCharacteristicsOutput,
      {
        min_power: history.getMinPower(),
        max_power: history.getMaxPower(),
        operator_name: history.getOperatorName(),
        connector_type: history.getConnectorType(),
        power_type: history.getPowerType(),
      },
      getConversationContextForNotShowingAddressOptionsUseCase(
        addressCharacteristicsOutput,
        {
          isNearbyRequested: history.getIsNearbyRequested(),
          currentCoordinates: history.getCurrentCoordinates(),
          language: history.language,
          supportedCountries: getSupportedCountriesFromProject(project),
          projectName: project.name,
          disableCountryScopeValidation: false,
        }
      ),
      history.getDestinationAddress(),
      history.getOriginAddress()
    )
  ) {
    history.setLocationsAreSearchBasedOnAddressOptions(true);
    history.setAddressOptions(addressOptions);
  } else if (showOptions) {
    history.setLocationsAreSearchBasedOnAddressOptions(false);
    history.setAddressOptions(addressOptions);
    history.setAddressOptionsDecisionNecessary(true);
    updateStateMachine(
      history,
      SupportedStateMachineEnum.SHOWED_ADDRESS_OPTIONS
    );
  } else {
    history.setLocationsAreSearchBasedOnAddressOptions(false);
    history.setAddressOptions([]);
    setSelectedAddressOptionToHistory(history, addressOptions[0]);
  }
};

export const setSelectedAddressOptionToHistory = (
  history: ConversationHistory,
  addressOption: AddressOption
) => {
  const { lat, lng, address, countryCode } = addressOption;
  const { latitude, longitude } = history.getData();
  if (!!latitude && !!longitude && latitude !== lat && longitude !== lng) {
    history.setIsAddressChanged(true);
  }

  if (countryCode) {
    history.setCountryCode(getAcceptableCountryCodeValue(countryCode));
  }

  history.setDestinationAddress('');
  history.setLatitude(String(lat));
  history.setLongitude(String(lng));
  history.setLastAddressQueryString(address);
  history.setAddress(address);
  history.setDone(true);
};

export const getAcceptableCountryCodeValue = (countryCode?: string): string => {
  if (
    Object.keys(alpha3to2Map).some(
      (countryCodeAlpha3) => countryCodeAlpha3 === countryCode
    )
  ) {
    return countryCode;
  }

  return '';
};
