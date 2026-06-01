import { AddressCharacteristics } from '../address-identifiers/address-characteristics.model';
import { TomTomLocation } from './models/address.model';

const STANDARD_MATCH_CONFIDENCE_SCORE = 0.91;
const LOWER_MATCH_CONFIDENCE_SCORE = 0.8;

export const isMunicipality = (option) => {
  return option.entityType === 'Municipality';
};

export const containsMunicipality = (addressOptions) => {
  return addressOptions.some(isMunicipality);
};

export const onlyMunicipality = (addressOptions) => {
  return addressOptions.filter(isMunicipality);
};

export const chooseMostSuitableGeocodeOptions = (
  addressCharacteristics: Partial<AddressCharacteristics>,
  addressOptions
) => {
  const optionsWithinCountry = onlyAddressFromTheSameCountry(
    addressOptions,
    addressCharacteristics.countryCode
  );
  if (
    containsMunicipality(optionsWithinCountry) &&
    !!addressCharacteristics.city &&
    !addressCharacteristics.addressLine &&
    !addressCharacteristics.district
  ) {
    const municipalityOptions = optionsAboveMinMatchConfidenceThreshold(
      onlyMunicipality(optionsWithinCountry)
    );

    return municipalityOptions.length > 0
      ? municipalityOptions
      : optionsAboveMinMatchConfidenceThreshold(
          onlyMunicipality(optionsWithinCountry),
          LOWER_MATCH_CONFIDENCE_SCORE
        );
  }

  return optionsAboveMinMatchConfidenceThreshold(optionsWithinCountry);
};

const optionsAboveMinMatchConfidenceThreshold = (
  addressOptions: TomTomLocation[],
  minMatchConfidenceOverride: number = null
): TomTomLocation[] => {
  let matchConfidenceComparator = STANDARD_MATCH_CONFIDENCE_SCORE;

  if (minMatchConfidenceOverride === null) {
    const isOnlyStreet =
      addressOptions.every(({ type }) => type === 'Street') &&
      minMatchConfidenceOverride === null;

      matchConfidenceComparator = isOnlyStreet
    ? LOWER_MATCH_CONFIDENCE_SCORE
    : STANDARD_MATCH_CONFIDENCE_SCORE;
  } else {
    matchConfidenceComparator = minMatchConfidenceOverride;
  }

  return addressOptions.filter((option) => {
    return Number(option.matchConfidence.score) > matchConfidenceComparator;
  });
};

const onlyAddressFromTheSameCountry = (
  addressOptions: TomTomLocation[],
  countryCodeISO3: string
): TomTomLocation[] => {
  if (!countryCodeISO3) {
    return addressOptions;
  }

  return addressOptions.filter(
    ({ address }) => address.countryCodeISO3 === countryCodeISO3
  );
};
