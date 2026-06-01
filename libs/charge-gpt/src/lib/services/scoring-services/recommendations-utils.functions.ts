import { ChargingStationWithScoreDetails } from '../../models/charging-stations.model';
import { Location } from '@fronyx/data-transfer-object';
export type LocationProperties =
  | 'distance'
  | 'powerKw'
  | 'probability'
  | 'lastUsed';
export type LocationTriplets = [Location[], Location[], Location[], Location[]];

export const groupLocationsIntoOrderedGroups = (
  locations: Location[],
  propertyName: LocationProperties
): Location[][] => {
  if (propertyName === 'distance') {
    const distancesMap = {};
    locations.forEach(
      ({ distance }) => (distancesMap[Math.ceil(distance / 100) * 100] = [])
    );
    locations.forEach((location) =>
      distancesMap[Math.ceil(location.distance / 100) * 100].push(location)
    );

    return Object.keys(distancesMap)
      .sort((a, b) => Number(a) - Number(b))
      .map((distance) => distancesMap[distance]);
  }

  if (propertyName === 'powerKw') {
    const powerKwsMap = {};
    locations.forEach(({ powerKw }) => (powerKwsMap[powerKw] = []));
    locations.forEach((location) =>
      powerKwsMap[location.powerKw].push(location)
    );
    return Object.keys(powerKwsMap)
      .sort((a, b) => Number(b) - Number(a))
      .map((powerKw) => powerKwsMap[powerKw]);
  }

  if (propertyName === 'probability') {
    const probabilitiesMap = {};
    locations.forEach(
      ({ probability }) => (probabilitiesMap[probability] = [])
    );
    locations.forEach((location) =>
      probabilitiesMap[location.probability].push(location)
    );

    return Object.keys(probabilitiesMap)
      .sort((a, b) => Number(a) - Number(b))
      .map((probability) => probabilitiesMap[probability]);
  }

  if (propertyName === 'lastUsed') {
    const lastUsedMap = {};
    locations.forEach(({ lastUsed }) => (lastUsedMap[lastUsed] = []));
    locations.forEach((location) =>
      lastUsedMap[location.lastUsed].push(location)
    );

    return Object.keys(lastUsedMap)
      .sort((a, b) => Number(b) - Number(a))
      .map((lastUsed) => lastUsedMap[lastUsed]);
  }

  throw new Error(
    'Invalid recommendation scoring grouping logic property name'
  );
};

const MAX_STARTING_SCORE = 1000;

const locationsToChargingStationsWithScoreDetails = (
  locations: ChargingStationWithScoreDetails[][] | Location[][]
): ChargingStationWithScoreDetails[][] => {
  return locations.map((locationGroup) =>
    locationGroup.map((location) => {
      const score = location.score ?? 0;
      const powerKwScore = location.powerKwScore ?? 0;
      const distanceScore = location.distanceScore ?? 0;
      const probabilityScore = location.probabilityScore ?? 0;
      const lastUsedScore = location.lastUsedScore ?? 0;

      return {
        ...location,
        score,
        powerKwScore,
        distanceScore,
        probabilityScore,
        lastUsedScore,
      };
    })
  );
};

export const calculateLocationsScoreByAttribute = (
  locations: Location[],
  propertyName: LocationProperties
): ChargingStationWithScoreDetails[] => {
  if (!locations || locations.length < 1) {
    throw new Error('Input needs to be in the format of Location[][]');
  }

  const groupedLocations = groupLocationsIntoOrderedGroups(
    locations,
    propertyName
  );

  const locationsWithScore: ChargingStationWithScoreDetails[][] =
    locationsToChargingStationsWithScoreDetails(groupedLocations);

  if (propertyName === 'distance') {
    const distanceWeight = 1;

    locationsWithScore.forEach((locationGroup, index) => {
      locationGroup.forEach((location) => {
        location.score += (MAX_STARTING_SCORE - index) * distanceWeight;
        location.distanceScore = (MAX_STARTING_SCORE - index) * distanceWeight;
      });
    });
  }

  if (propertyName === 'powerKw') {
    const powerKwWeight = 0.5;

    locationsWithScore.forEach((locationGroup, index) => {
      locationGroup.forEach((location) => {
        location.score += (MAX_STARTING_SCORE - index) * powerKwWeight;
        location.powerKwScore = (MAX_STARTING_SCORE - index) * powerKwWeight;
      });
    });
  }

  if (propertyName === 'probability') {
    const probabilityWeight = 0.3;

    locationsWithScore.forEach((locationGroup, index) => {
      locationGroup.forEach((location) => {
        location.score += (MAX_STARTING_SCORE - index) * probabilityWeight;
        location.probabilityScore =
          (MAX_STARTING_SCORE - index) * probabilityWeight;
      });
    });
  }

  if (propertyName === 'lastUsed') {
    const lastUsedWeight = 0.3;

    locationsWithScore.forEach((locationGroup, index) => {
      locationGroup.forEach((location) => {
        if (
          !isNaN(location.lastUsed) &&
          location.lastUsed !== null &&
          location.lastUsed !== undefined
        ) {
          location.score += (MAX_STARTING_SCORE - index) * lastUsedWeight;
          location.lastUsedScore =
            (MAX_STARTING_SCORE - index) * lastUsedWeight;
        }
      });
    });
  }

  return locationsWithScore.flat();
};

interface LabellingResults {
  isNearest: string;
  isFastest: string;
  isMostAvailable: string;
}

export const getIdsForLocationsToBeLabelled = (
  chargingStations: ChargingStationWithScoreDetails[]
): LabellingResults => {
  const results: LabellingResults = {
    isNearest: null,
    isFastest: null,
    isMostAvailable: null,
  };

  const locationsGroupedByDistance = groupLocationsIntoOrderedGroups(
    chargingStations,
    'distance'
  );
  const locationsGroupedByPowerKw = groupLocationsIntoOrderedGroups(
    chargingStations,
    'powerKw'
  );
  const locationsGroupedByProbability = groupLocationsIntoOrderedGroups(
    chargingStations,
    'probability'
  );

  const locationIdPool = new Set();
  locationsGroupedByDistance.forEach((locations) =>
    locations.forEach(({ locationId }) => locationIdPool.add(locationId))
  );
  locationsGroupedByPowerKw.forEach((locations) =>
    locations.forEach(({ locationId }) => locationIdPool.add(locationId))
  );
  locationsGroupedByProbability.forEach((locations) =>
    locations.forEach(({ locationId }) => locationIdPool.add(locationId))
  );

  if (locationsGroupedByPowerKw[0].length < 2) {
    locationsGroupedByPowerKw[0].forEach((location) => {
      if (
        results.isFastest === null &&
        locationIdPool.has(location.locationId)
      ) {
        results.isFastest = location.locationId;
        locationIdPool.delete(location.locationId);
      }
    });
  }

  if (locationsGroupedByDistance[0].length < 2) {
    locationsGroupedByDistance[0].forEach((location) => {
      if (
        results.isNearest === null &&
        locationIdPool.has(location.locationId)
      ) {
        results.isNearest = location.locationId;
        locationIdPool.delete(location.locationId);
      }
    });
  }

  if (locationsGroupedByProbability[0].length < 2) {
    locationsGroupedByProbability[0].forEach((location) => {
      if (
        results.isMostAvailable === null &&
        locationIdPool.has(location.locationId)
      ) {
        results.isMostAvailable = location.locationId;
        locationIdPool.delete(location.locationId);
      }
    });
  }

  return results;
};
