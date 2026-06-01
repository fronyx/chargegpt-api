import { Location } from '@fronyx/data-transfer-object';

export interface ChargingStationWithScoreDetails extends Location {
  powerKwScore: number;
  distanceScore: number;
  probabilityScore: number;
  score: number;
  lastUsedScore: number;
}
