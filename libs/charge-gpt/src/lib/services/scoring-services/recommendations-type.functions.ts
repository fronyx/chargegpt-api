import { ChargingStationWithScoreDetails } from '../../models/charging-stations.model';
import { Location } from '@fronyx/data-transfer-object';
import { labelRecommendedChargingStations } from './charging-stations-label.service';
import { calculateLocationsScoreByAttribute } from './recommendations-utils.functions';

interface LabelRecommenedChargingStationsArguments {
  locations: Location[];
  language: string;
  powerType: string;
  minPower: number;
  maxPower: number;
}

export const calculateChargingStationsScore = (
  chargingStations: Location[]
): ChargingStationWithScoreDetails[] => {
  return calculateLocationsScoreByAttribute(
    calculateLocationsScoreByAttribute(
      calculateLocationsScoreByAttribute(
        calculateLocationsScoreByAttribute(chargingStations, 'distance'),
        'probability'
      ),
      'powerKw'
    ),
    'lastUsed'
  ).map(sumPropertyScores);
};

const sumPropertyScores = (
  chargingStation: ChargingStationWithScoreDetails
): ChargingStationWithScoreDetails => {
  return {
    ...chargingStation,
    score:
      chargingStation.distanceScore +
      chargingStation.powerKwScore +
      chargingStation.probabilityScore +
      chargingStation.lastUsedScore,
  };
};

export const labelAndScoreRecommendedChargingStations = (
  args: LabelRecommenedChargingStationsArguments
): Location[] => {
  if (args.locations.length < 1) return [];

  return labelRecommendedChargingStations({
    locations: calculateChargingStationsScore(args.locations),
    language: args.language,
    powerType: args.powerType,
    minPower: args.minPower,
    maxPower: args.maxPower,
  });
};
