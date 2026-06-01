import {
  getSupportedCountriesFromProject,
  ToolkitProject,
} from '@fronyx/toolkit';
import { ConversationHistory } from '../../models/conversation-history.model';
import { AddressCharacteristics } from '../address-identifiers/address-characteristics.model';
import {
  distanceInMeterBetween2Locations,
  getCurrentCoordinatesAccordingToConversationContext,
} from '../address-services/poi-search-utils.service';
import { Coordinates } from '../../models/prompt';
import {
  getCategoryQueryTerm,
  getLocationBias,
  isAirportSearch,
  isMainTrainStationSearch,
  processQueryResults,
  queryPlacesByCategory,
} from '../address-services/search-poi.service';
import { useTryAsync } from 'no-try';
import {
  getDestinationAndSetToHistory,
  setSelectedAddressOptionToHistory,
} from '../conversation-destination-search.service';
import {
  searchForAvailableChargingStations,
  noChargePointsAvailableError,
  noChargePointsInDBError,
} from '../search-charging-stations-service/charging-station-search.service';
import { BIGGEST_SEARCH_DISTANCE } from '@fronyx/locations';
import { calculateChargingStationsScore } from '../scoring-services/recommendations-type.functions';
import { getClusterSummarizer } from '../address-services/clustering-locations-utils.service';
import {
  NoChargePointsAvailableError,
  NoChargePointsInDBError,
} from '../../../../../../apps/cdk-apps/src/shared';
import { AddressNotFoundError } from '../../models/address-search-error';
import {
  getConversationContextForNotShowingAddressOptionsUseCase,
  isNotShowingAddressOptionsUseCase,
} from '../business-name-request-utils.service';
import { Location } from '@fronyx/data-transfer-object';
import { TomTomLocation } from '../address-services/models/address.model';
import { ChargingStationWithScoreDetails } from '../../models/charging-stations.model';

const SMALL_SEARCH_RADIUS = 1500;

export const searchDestinationBasedOnChargingStations = async (
  history: ConversationHistory,
  project: ToolkitProject,
  addressCharacteristics: Partial<AddressCharacteristics>,
  isLocationAlreadyConfirmed: boolean
) => {
  const conversationContext = {
    isNearbyRequested: history.getIsNearbyRequested(),
    currentCoordinates: history.getCurrentCoordinates(),
    language: history.language,
    supportedCountries: getSupportedCountriesFromProject(project),
    projectName: project.name,
    disableCountryScopeValidation: false,
  };

  const currentCoordinates =
    getCurrentCoordinatesAccordingToConversationContext(
      addressCharacteristics,
      conversationContext
    );

  const searchPoint = await getSearchPointCoordinates(
    currentCoordinates,
    addressCharacteristics
  );

  let lat, lng;
  if (!currentCoordinates) {
    lat = searchPoint.lat;
    lng = searchPoint.lng;
  }

  if (
    await isPoiCountTooSmall(
      addressCharacteristics.poiCategories,
      lat,
      lng,
      searchPoint.topLeft,
      searchPoint.btmRight
    )
  ) {
    return getDestinationAndSetToHistory(
      history,
      project,
      addressCharacteristics,
      isLocationAlreadyConfirmed
    );
  }

  const clonedHistory = new ConversationHistory(history.getJSON());
  clonedHistory.setLatitude(String(searchPoint.lat));
  clonedHistory.setLongitude(String(searchPoint.lng));

  const { locations, error } = await searchForAvailableChargingStations(
    clonedHistory,
    project,
    getChargingStationSearchRadius(addressCharacteristics)
  );

  if (error) {
    return handleNoChargingStationsErrors(
      error,
      history,
      addressCharacteristics.addressSummary
    );
  }
  const searchTermPoiCategories = getCategoryQueryTerm(
    addressCharacteristics.poiCategories
  );

  const chargingStationPositions = await getPositionsWithPoi(
    searchTermPoiCategories,
    addressCharacteristics.countryCode,
    sortAndFlattenCluster(
      scoreClusters(clusterChargingStationsByDistance(locations))
    )
  );

  if (chargingStationPositions.length < 1) {
    throw new AddressNotFoundError(
      'Address is invalid',
      addressCharacteristics.addressSummary
    );
  }

  if (
    chargingStationPositions.length > 1 &&
    isNotShowingAddressOptionsUseCase(
      addressCharacteristics,
      {
        min_power: history.getMinPower(),
        max_power: history.getMaxPower(),
        operator_name: history.getOperatorName(),
        connector_type: history.getConnectorType(),
        power_type: history.getPowerType(),
      },
      getConversationContextForNotShowingAddressOptionsUseCase(
        addressCharacteristics,
        {
          isNearbyRequested: history.getIsNearbyRequested(),
          currentCoordinates: history.getCurrentCoordinates(),
          language: history.language,
          supportedCountries: getSupportedCountriesFromProject(project),
          projectName: project.name,
          disableCountryScopeValidation: false,
        }
      ),
      history.getDestinationAddress(),
      history.getOriginAddress()
    )
  ) {
    return showNoLocationsOptionsToUser(chargingStationPositions, history);
  }

  if (chargingStationPositions.length > 1) {
    return showLocationsOptionsToUser(chargingStationPositions, history);
  }

  return setLocationAsDestination(history, chargingStationPositions[0]);
};

const getChargingStationSearchRadius = (
  addressCharacteristics: Partial<AddressCharacteristics>
) => {
  return addressCharacteristics.cardinalDirection ||
    addressCharacteristics.isCityCenter
    ? SMALL_SEARCH_RADIUS
    : BIGGEST_SEARCH_DISTANCE;
};

const handleNoChargingStationsErrors = (
  expectedError,
  history: ConversationHistory,
  address: string
) => {
  history.setAddress(address);
  history.setLocationsAreSearchBasedOnAddressOptions(true);

  if (expectedError instanceof NoChargePointsInDBError) {
    const { error } = noChargePointsInDBError(history, false);
    throw error;
  } else if (expectedError instanceof NoChargePointsAvailableError) {
    const { error } = noChargePointsAvailableError(history, [], false);
    throw error;
  } else {
    console.error(
      'Error searching for charging stations from charging stations service.'
    );
    console.error(expectedError);
  }

  throw expectedError;
};

const setLocationAsDestination = (history: ConversationHistory, location) => {
  const poiQueryResults = processQueryResults(
    'searchDestinationBasedOnChargingStations',
    {
      status: 200,
      data: {
        status: 'OK',
        candidates: [location],
      },
    }
  );

  setSelectedAddressOptionToHistory(history, poiQueryResults.addressOptions[0]);
};

const showNoLocationsOptionsToUser = (
  candidates: any[],
  history: ConversationHistory
) => {
  const poiQueryResults = processQueryResults(
    'searchDestinationBasedOnChargingStations',
    {
      status: 200,
      data: {
        status: 'OK',
        candidates,
      },
    }
  );

  history.setLocationsAreSearchBasedOnAddressOptions(true);
  history.setAddressOptions(poiQueryResults.addressOptions);
  history.setIsAddressConfirmationNecessary(false);
  history.setAddressOptionsDecisionNecessary(false);
};

const showLocationsOptionsToUser = (
  candidates: any[],
  history: ConversationHistory
) => {
  const poiQueryResults = processQueryResults(
    'searchDestinationBasedOnChargingStations',
    {
      status: 200,
      data: {
        status: 'OK',
        candidates,
      },
    }
  );

  history.setLocationsAreSearchBasedOnAddressOptions(false);
  history.setAddressOptions(poiQueryResults.addressOptions);
  history.setIsAddressConfirmationNecessary(false);
  history.setAddressOptionsDecisionNecessary(true);
};

const isPoiCountTooSmall = async (
  poiCategories: string[],
  lat: number,
  lng: number,
  topLeft: string,
  btmRight: string
): Promise<boolean> => {
  if (!poiCategories || poiCategories.length < 1) {
    return true;
  }

  const searchTerm = getCategoryQueryTerm(poiCategories);

  const categoryResults = await queryPlacesByCategory({
    term: searchTerm,
    lat: lat?.toString(),
    lng: lng?.toString(),
    radius: 0,
    topLeft,
    btmRight,
  });

  return categoryResults.length < 10;
};

const getLocationBiasQueryTerm = (
  addressCharacteristics: Partial<AddressCharacteristics>
) => {
  return [
    addressCharacteristics.addressLine,
    addressCharacteristics.district,
    addressCharacteristics.city,
  ]
    .filter(Boolean)
    .join(' ');
};

const getSearchPointCoordinates = async (
  currentCoordinates: Coordinates,
  addressCharacteristics: Partial<AddressCharacteristics>
): Promise<{
  lat: number;
  lng: number;
  topLeft?: string;
  btmRight?: string;
}> => {
  if (currentCoordinates) {
    return currentCoordinates;
  }

  if (!addressCharacteristics.city) {
    throw new Error('City is required to get the coordinates');
  }

  // get the coordinates of the city
  const [err, locationBiasRes] = await useTryAsync(() =>
    getLocationBias(
      getLocationBiasQueryTerm(addressCharacteristics),
      addressCharacteristics.cardinalDirection
    )
  );

  if (err) {
    console.error(err);
    throw new Error(
      'Error getting the coordinates of the city for search based on charging stations.'
    );
  }

  return {
    lat: locationBiasRes.lat,
    lng: locationBiasRes.lng,
    topLeft: locationBiasRes.boundingBox.topLeftPoint,
    btmRight: locationBiasRes.boundingBox.btmRightPoint,
  };
};

const sortAndFlattenCluster = (
  clusteredChargingStations: ChargingStationWithScoreDetails[][]
): any[] => {
  return flattenCluster(clusteredChargingStations).sort(
    ({ score: a }, { score: b }) => b - a
  );
};

const scoreClusters = (
  clusteredChargingStations: Location[][]
): ChargingStationWithScoreDetails[][] => {
  const scoredCluster = clusteredChargingStations.map((cluster) => {
    return calculateChargingStationsScore(cluster);
  });

  return scoredCluster;
};

const CLUSTER_DISTANCE = 300;
export const clusterChargingStationsByDistance = (
  chargingStations: Location[],
  clusteredChargingStations: Location[][] = []
): Location[][] => {
  if (!chargingStations) {
    return [];
  }

  if (chargingStations.length < 1) {
    return clusteredChargingStations;
  }

  const currentCluster = [];
  const anchor = chargingStations.shift();

  currentCluster.push(anchor);

  chargingStations.forEach((neighbour, index) => {
    const distance = distanceInMeterBetween2Locations(
      anchor.lat,
      anchor.lng,
      neighbour.lat,
      neighbour.lng
    );

    neighbour.distance = distance;

    if (distance <= CLUSTER_DISTANCE) {
      currentCluster.push(neighbour);
      chargingStations[index] = null;
    }
  });

  clusteredChargingStations.push(currentCluster);
  const remainingChargingStations = chargingStations.filter(Boolean);

  return clusterChargingStationsByDistance(
    remainingChargingStations,
    clusteredChargingStations
  );
};

const flattenCluster = (clusteredChargingStations: any[]): any[] => {
  return clusteredChargingStations.map((chargingStations) => {
    const averageScore =
      chargingStations.reduce((acc, { score }) => {
        return acc + score;
      }, 0) / chargingStations.length;

    return {
      ...chargingStations[0],
      score: averageScore,
    };
  });
};

const MAX_POSITION_COUNT = 3;
const MAX_PARALLEL_SEARCH = 3;
const getPositionsWithPoi = async (
  poiCategory: string,
  languageCountryCode: string,
  chargingStations: ChargingStationWithScoreDetails[]
): Promise<TomTomLocation[]> => {
  let count = 0;
  const positionsWithPoi = [];
  while (
    positionsWithPoi.length < MAX_POSITION_COUNT &&
    count < chargingStations.length
  ) {
    const positions = chargingStations.slice(
      count,
      count + MAX_PARALLEL_SEARCH
    );
    const queries = positions.map(({ lat, lng }) =>
      queryPlacesByCategory({
        term: poiCategory,
        lat: lat ? String(lat) : null,
        lng: lng ? String(lng) : null,
        radius: SMALL_SEARCH_RADIUS,
      })
    );

    const [err, queriedPositions] = await useTryAsync(() =>
      Promise.all(queries)
    );

    if (!err) {
      positionsWithPoi.push(
        ...getClusterSummarizer(languageCountryCode)(
          queriedPositions
            .filter((pois) => pois.length > 0)
            .map((pois) => pois.slice(0, MAX_POSITION_COUNT))
        )
      );
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    count += MAX_PARALLEL_SEARCH;
  }

  return positionsWithPoi;
};

export const isSpecialPoiCategories = (
  addressCharacteristics: Partial<AddressCharacteristics>
) => {
  return (
    isMainTrainStationSearch(
      addressCharacteristics.poiName,
      addressCharacteristics.poiCategories
    ) ||
    isAirportSearch(
      addressCharacteristics.poiName,
      addressCharacteristics.poiCategories
    )
  );
};
