import { ConversationHistory } from '../../models/conversation-history.model';
import { calculateChargingStationsScore } from './recommendations-type.functions';

class AggregatedChargingStationScores {
  constructor(
    public availability: number[],
    public distance: number[],
    public powerKw: number[],
    public lastUsed: number[],
    public length: number = availability.length
  ) {}
}

export const getChargingStationsAggregatedPropertiesValues = (
  history: ConversationHistory
): AggregatedChargingStationScores => {
  const recommendedChargingStations = history.getRecommendedChargingStations();
  const allChargingStations = calculateChargingStationsScore(
    history.getAvailableChargingStations()
  );

  if (!recommendedChargingStations.length) {
    return new AggregatedChargingStationScores([], [], [], []);
  }

  recommendedChargingStations.sort(({ score: a }, { score: b }) => b - a);
  allChargingStations.sort(({ score: a }, { score: b }) => b - a);

  const chargingStations = allChargingStations.slice(
    allChargingStations.findIndex(
      ({ locationId }) =>
        locationId === recommendedChargingStations[0].locationId
    )
  );

  const availability = chargingStations.map(
    (chargingStation) => chargingStation.probability
  );
  const distance = chargingStations.map(
    (chargingStation) => chargingStation.distance
  );
  const powerKw = chargingStations.map(
    (chargingStation) => chargingStation.powerKw
  );
  const lastUsed = chargingStations.map(
    (chargingStation) => chargingStation.lastUsed
  );

  return new AggregatedChargingStationScores(
    availability,
    distance,
    powerKw,
    lastUsed
  );
};
