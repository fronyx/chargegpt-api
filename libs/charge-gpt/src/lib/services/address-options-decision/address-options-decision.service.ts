import { AddressCharacteristics } from '../address-identifiers/address-characteristics.model';
import { AddressOption } from '../address-services/models/address.model';
import { isPoiCategorySearch } from '../address-services/search-poi.service';

export const VISIBLE_ADDRESS_OPTIONS_LIMIT = 3;
export const getVisibleAddressOptionsToBeDisplayed = <T>(options: T[]): T[] => {
  return options.slice(0, VISIBLE_ADDRESS_OPTIONS_LIMIT);
};
const ADDRESS_TYPES_THAT_SHOULD_NOT_SHOW_OPTIONS = [
  'tourist_attraction',
  'airport',
  'museum',
];

export const shouldAddressOptionBeDisplayed = (
  addressOptionsInput: AddressOption[],
  addressCharacteristics: Partial<AddressCharacteristics>
): boolean => {
  if (addressOptionsInput.length === 1) {
    return false;
  }

  if (isPOI(addressCharacteristics) && addressOptionsInput.length > 1) {
    const firstOptionType = addressOptionsInput[0].type;

    if (ADDRESS_TYPES_THAT_SHOULD_NOT_SHOW_OPTIONS.includes(firstOptionType)) {
      return false;
    }

    return true;
  }

  return addressOptionsInput.length > 1;
};

const isPOI = (
  addressCharacteristics: Partial<AddressCharacteristics>
): boolean => {
  return (
    !!addressCharacteristics.poiName ||
    isPoiCategorySearch(
      addressCharacteristics.poiCategories,
      addressCharacteristics.poiName
    )
  );
};
