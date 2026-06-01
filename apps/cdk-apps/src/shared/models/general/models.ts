import { EvseIDValue } from '../cache/evse-id-value';
import { EvseUIDValue } from '../cache/evse-uid-value';
import { ScopedEntityIdsPartyIdKey } from '../cache/scoped-entity-ids-party-id-key';
import { ScopedEntityIdsApiTokenKey } from '../cache/scoped-entity-ids-api-token-key';
import { OcpiLocationEvseListKey } from '../cache/ocpi-location-evse-list-key';
import { ApiTokenCacheValue } from '../cache/api-token-cache-value';
import { PredictionsClassificationKey } from '../cache/predictions-classification-key';
import { UtilisationStatusCacheKey } from '../cache/utilisation-status-cache-key';

export type Project = any;
export type LocationEvseListValue = (EvseIDValue | EvseUIDValue);
export type CacheKey = (
  ScopedEntityIdsPartyIdKey |
  ScopedEntityIdsApiTokenKey |
  OcpiLocationEvseListKey |
  PredictionsClassificationKey |
  UtilisationStatusCacheKey
  );

export interface LambdaInvocationPayload {
  body: Project;
}

export interface Connector {
  id: string;
  standard: string;
  format: string;
  power_type: string;
  voltage: number;
  amperage: number;
  last_updated: Date;
}

export interface Evse {
  uid: string;
  evse_id: string;
  status: string;
  last_updated: Date;
  connectors: Connector[];
}

export interface Location {
  id: string;
  city: string;
  country: string;
  address: string;
  latitude: number;
  postal_code: string;
  longitude: number;
  evses: Evse[];
  last_updated: Date;
}
