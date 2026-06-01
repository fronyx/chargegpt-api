export interface Location {
  locationId: string;
  link: string;
  distance: number;
  probability?: number;
  primaryIds?: string[];
  lat?: number;
  lng?: number;
  powerType?: string;
  powerKw?: number;
  recommendation?: string;
  isCurrentlyAvailable?: boolean;
  score?: number; // filled by enrichLocationsWithRecommendationType
  lastUsed: null | number // filled by pre-trigger script in CosmosDB
  connectorTypes: any[];
  operatorName: string;
}

export type SUPPORTED_PEER_ID = 'FRK' | 'MUV' | 'NeutralPartner' | 'TEST';

