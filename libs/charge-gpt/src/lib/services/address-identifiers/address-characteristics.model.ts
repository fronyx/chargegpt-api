export interface AddressCharacteristics {
  country: string | null;
  countryCode: string | null;
  city: string | null;
  addressLine: string | null;
  district: string | null;
  cardinalDirection: string | null;
  poiName: string | null;
  isHighwayRequested: boolean;
  isCityCenter: boolean;
  poiCategories: string[] | null;
  error: string | undefined;
  addressSummary: string | null;
}
