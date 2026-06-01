import { isEmptyString } from 'apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { AddressCharacteristics } from './address-identifiers/address-characteristics.model';
import { getCurrentCoordinatesAccordingToConversationContext } from './address-services/poi-search-utils.service';
import { DestinationSearchConversationContext } from './address-services/poi-search.service';

export interface ExtraChargingNeeds {
  min_power: number | null;
  max_power: number | null;
  operator_name: string | null;
  connector_type: string | null;
  power_type: string | null;
}

interface ConversationContext {
  isNearbyRequested: boolean;
}

export const getConversationContextForNotShowingAddressOptionsUseCase = (
  addressCharacteristics: Partial<AddressCharacteristics> | null,
  conversationContext: DestinationSearchConversationContext
): ConversationContext => {
  const currentCoordinates =
    getCurrentCoordinatesAccordingToConversationContext(
      addressCharacteristics,
      conversationContext
    );

  return {
    isNearbyRequested: !!currentCoordinates,
  };
};

export const isNotShowingAddressOptionsUseCase = (
  addressCharacteristics: Partial<AddressCharacteristics> | null,
  extraChargingNeeds: ExtraChargingNeeds,
  conversationContext: ConversationContext,
  origin: string,
  destination: string,
) => {
  if (!isEmptyString(origin) && !isEmptyString(destination)) {
    return false;
  }

  if (
    addressCharacteristics?.poiCategories?.length > 0 &&
    conversationContext.isNearbyRequested
  ) {
    return true;
  }

  if (
    addressCharacteristics?.poiCategories?.length > 0 &&
    hasExtraChargingNeeds(extraChargingNeeds)
  ) {
    return true;
  }

  if (
    addressCharacteristics?.poiName &&
    hasExtraChargingNeeds(extraChargingNeeds)
  ) {
    return true;
  }

  if (
    addressCharacteristics?.poiName &&
    conversationContext.isNearbyRequested
  ) {
    return true;
  }

  return false;
};

const hasExtraChargingNeeds = (extraChargingNeeds: ExtraChargingNeeds) => {
  if (!extraChargingNeeds) {
    return false;
  }

  // No charging needs for default values of min_power and max_power
  if (
    extraChargingNeeds.max_power === 500 &&
    extraChargingNeeds.min_power === 0
  ) {
    return false;
  }

  if (
    Object.values(extraChargingNeeds).some(
      (value) =>
        value !== null &&
        value !== undefined &&
        value !== '' &&
        value !== 'null' &&
        value !== 'both' &&
        value !== 'all'
    )
  ) {
    return true;
  }

  return false;
};
