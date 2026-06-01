import { Coordinates } from '../../models/prompt';
import {
  AddressNotFoundError,
  AddressOutOfScopeError,
} from '../../models/address-search-error';
import { AddressOption } from './models/address.model';
import { searchDestination } from './search-poi.service';
import { useTryAsync } from 'no-try';
import { AddressCharacteristics } from '../address-identifiers/address-characteristics.model';
import { getCurrentCoordinatesAccordingToConversationContext } from './poi-search-utils.service';
import { removeExtraCommas } from './clustering-locations-utils.service';
import { Tracer } from '../tracer';

type POISearchError = AddressNotFoundError | AddressOutOfScopeError;

export interface DestinationSearchConversationContext {
  isNearbyRequested: boolean;
  currentCoordinates: Coordinates;
  language: string;
  supportedCountries: string[];
  projectName: string;
  disableCountryScopeValidation: boolean;
}

const noopTracer = {
  start: () => {
    // NOOP
  },
  end: () => {
    // NOOP
  },
};

export const getPotentialDestinations = async (
  addressCharacteristics: Partial<AddressCharacteristics>,
  conversationContext: DestinationSearchConversationContext | null
): Promise<{
  error?: POISearchError;
  addressOptions?: AddressOption[];
  isPoiSearch?: boolean;
}> => {
  const tracer = conversationContext
    ? new Tracer(
        'getDestinations_externalAPIs',
        conversationContext?.projectName
      )
    : noopTracer;

  tracer.start();

  const currentCoordinates =
    getCurrentCoordinatesAccordingToConversationContext(
      addressCharacteristics,
      conversationContext
    );

  const [searchPoiError, searchPoiResults] = await useTryAsync(() =>
    searchDestination(
      addressCharacteristics,
      currentCoordinates?.lat as unknown as string,
      currentCoordinates?.lng as unknown as string,
      undefined,
      userLanguageToCountryCode(conversationContext?.language)
    )
  );

  if (searchPoiError) {
    tracer.end();
    console.error('Error getPotentialDestinations:', searchPoiError.message);
    throw searchPoiError;
  }

  if (
    isOptionsOutOfCountryScope(
      searchPoiResults.addressOptions,
      conversationContext?.supportedCountries
    ) &&
    !conversationContext?.disableCountryScopeValidation
  ) {
    tracer.end();
    const countryCode = getOutOfScopeCountryCode(
      searchPoiResults.addressOptions,
      conversationContext?.supportedCountries
    );
    return {
      error: new AddressOutOfScopeError(
        `Missing permission(s) to the following feature(s): Data access to country ${getOutOfScopeCountryCode(
          searchPoiResults.addressOptions,
          conversationContext?.supportedCountries
        )}`,
        countryCode
      ),
      addressOptions: [],
      isPoiSearch: false,
    };
  }

  tracer.end();
  return {
    ...searchPoiResults,
    addressOptions: formatVisibleAddressInOptions(
      !conversationContext?.disableCountryScopeValidation ? filterOutOfScopeLocations(
        searchPoiResults.addressOptions,
        conversationContext?.supportedCountries,
      ) : searchPoiResults.addressOptions
    ),
  };
};

const filterOutOfScopeLocations = (
  addressOptions: AddressOption[],
  supportedCountries: string[],
) => {
  if (!supportedCountries || supportedCountries.length < 1) {
    return addressOptions;
  }

  if (!addressOptions || addressOptions.length < 1) {
    return [];
  }

  return addressOptions.filter(({ countryCode }) =>
    supportedCountries.includes(countryCode)
  );
};

const getOutOfScopeCountryCode = (
  addressOptions: AddressOption[],
  supportedCountries: string[]
): string => {
  const outOfScopeCountry = addressOptions.find(
    ({ countryCode }) => !supportedCountries.includes(countryCode)
  );
  return outOfScopeCountry?.countryCode || '';
};

const isOptionsOutOfCountryScope = (
  addressOptions: AddressOption[],
  supportedCountries: string[]
): boolean => {
  if (!addressOptions || addressOptions.length < 1) {
    return false;
  }

  return (
    addressOptions.filter(({ countryCode }) =>
      supportedCountries.includes(countryCode)
    ).length < 1
  );
};

export const userLanguageToCountryCode = (language: string) => {
  return language.toUpperCase();
};

export const formatVisibleAddressInOptions = (
  inputOptions: AddressOption[]
): AddressOption[] => {
  // if all addresses are exactly the same, add the secondarySubDivision to the address string
  return inputOptions.map((option) => {
    const address = removeExtraCommas(attachAddressDetails(option));

    return {
      ...option,
      address,
    };
  });
};

export const attachAddressDetails = (option: AddressOption): string => {
  const availableParts = [
    option.address.includes(option.name) ? '' : option.name,
    option.address,
    option.secondarySubDivision,
    option.municipality,
  ].filter((val) => !!val);
  const uniqueParts = [];
  availableParts.forEach((part) => {
    if (uniqueParts.every((val) => !val.includes(part))) {
      uniqueParts.push(part);
    }
  });

  const uniqueAddressParts = [...new Set(uniqueParts)];
  return uniqueAddressParts.slice(0, 2).join(', ');
};
