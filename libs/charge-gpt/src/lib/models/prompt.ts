import { Route } from '../services/routes-services/routes.model';
import { CoordinatesDto } from './conversation-dto';

export const MAX_TURNS = 20;
export const MAX_TURNS_REFINEMENT = 4;
export const ProjectOutputType = {
  recommendations: 'recommendations',
  filters: 'filters',
};

export interface Answer {
  conversationId: string;
  role: 'system' | 'user' | 'assistant';
  prompt: string;
  results?: {
    type: 'Destination' | 'Route';
    filters?: FilterResponse;
    destination?: Address;
    data?: Location[];
    navigationLink?: string;
    origin?: Address;
    dateTime?: string;
    powerType?: string;
    minPower?: number;
    maxPower?: number;
    operatorName?: string;
    connectorType?: string;
    averageScore?: number;
    poi?: Address;
    routes?: Route[];
  };
  metaData?: MetaData;
  isClosed: boolean;
  audioUrl: string;
  responseId: string;
  isRequestOutOfScope: boolean;
  lastUserInput?: string;
  provideContext?: string;
  versionNumber?: string;
}

export interface Address {
  address?: string;
  city?: string;
  countryCode?: string;
  coordinates?: Coordinates;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

// Deprecated. Please use Location from data-transfer-objects lib
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
  connectorTypes: any[];
  operatorName: string;
}

export interface TextResult {
  isSuccessful: boolean;
  text: string;
  audioUrl?: string;
  versionNumber?: string;
}

export interface Dialog {
  role: 'system' | 'user' | 'assistant' | 'tool';
  name?: string;
  content: string;
}

export interface ChatGptAddress {
  address?: string;
  street_number?: string;
  city?: string;
  country?: string;
  power_type?: string;
}

export interface RecommendationSummary {
  predictedAvailability: number;
  distance: number;
  chargingSpeed: string;
}

export interface AudioFile {
  url: string;
  fileId: string;
  versionNumber?: string;
}

export interface MetaData {
  dateTime?: string;
  powerType?: string;
  destination?: Address;
  origin?: Address;
  poi?: Address;
  operatorName?: string;
  connectorType?: string;
  minPower?: number;
  maxPower?: number;
  isCharacterLimitReached?: boolean;
  isContainsBlockedTerm?: boolean;
  helpLevel?: string;
  isPostfix?: boolean;
  isReset?: boolean;
  isDestinationConfirmation?: boolean;
  isDestinationSelection?: boolean;
}

export interface FilterResponse {
  min_power: number;
  max_power: number;
  power_enabled: boolean;
  only_free: boolean;
  only_4_or_5_stars: boolean;
  only_public: boolean;
  only_tariff_kwh: boolean;
  only_tariff_min: boolean;
  only_remote_start_capable: boolean;
  only_auto_charge: boolean;
  hide_not_available: boolean;
  hide_unknown: boolean;
  hide_coming_soon: boolean;
  type_of_locations: any[];
  type_of_locations_enabled: boolean;
  plug_types_enabled: boolean;
  hide_no_state: boolean;
}

export interface Record {
  activity: string;
  filterName?: string;
  filterValue?: string;
  filters?: FilterResponse;
}

export interface Conversation {
  text: string;
  currentCoordinates: CoordinatesDto;
  isVoice: boolean;
  isSuggestion: boolean;
  deniedContext: string;
}

export class DialogFactory {
  static fromSystem(content: string): Dialog {
    return { role: 'system', content };
  }

  static fromUser(content: string): Dialog {
    return { role: 'user', content };
  }

  static fromAssistant(content: string): Dialog {
    return { role: 'assistant', content };
  }

  static fromFunction(name: string, content: string): Dialog {
    return { role: 'tool', name, content };
  }
}
