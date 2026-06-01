export interface TomTomLocation {
  type: string;
  id: string;
  score: number;
  matchConfidence: {
    score: number;
  };
  dist: number;
  address: TomTomAddressDetails;
  position: {
    lat: number;
    lon: number;
  };
  entityType: string;
  viewport: {
    topLeftPoint: {
      lat: number;
      lon: number;
    };
    btmRightPoint: {
      lat: number;
      lon: number;
    };
  };
}

export interface TomTomAddressDetails {
  freeformAddress: string;
  countryCodeISO3: string;
  countryCode: string;
  municipality: string;
  countrySubdivisionName: string;
  countrySecondarySubdivision: string;
}

interface BoundingBox {
  topLeftPoint: {
    lat: number;
    lon: number;
  };
  btmRightPoint: {
    lat: number;
    lon: number;
  };
}

export interface AddressOption {
  address: string;
  addressId: string;
  name: string;
  matchConfidence?: number;
  type?: string;
  municipality?: string;
  secondarySubDivision?: string;
  distance?: number;
  lat: number;
  lng: number;
  countryCode?: string;
  boundingBox?: BoundingBox;
  terms?: { offset: number; value: string }[];
}

export interface SearchDestinationResponse {
  addressOptions: AddressOption[];
  error: any;
  isPoiSearch: boolean;
}
