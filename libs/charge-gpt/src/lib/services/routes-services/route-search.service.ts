import { configService } from '@fronyx/configurations';
import { Location } from '@fronyx/data-transfer-object';
import axios from 'axios';
import { useTryAsync } from 'no-try';
import { distanceInMeterBetween2Locations } from '../address-services/poi-search-utils.service';
import { searchForAvailableChargingStations } from '../search-charging-stations-service/charging-station-search.service';
import { ConversationHistory } from '../../models/conversation-history.model';
import {
  getSupportedCountriesFromProject,
  ToolkitProject,
} from '@fronyx/toolkit';
import { getPotentialDestinations } from '../address-services/poi-search.service';
import { chargeGPTLogger } from '../../models/chat-utilities';
import {
  AddressNotFoundError,
  AddressOutOfScopeError,
} from '../../models/address-search-error';
import { searchRouteNeeds } from '../address-services/thin-search-poi.service';
import { Coordinates } from '../../models/prompt';
import { identifyAddressCharacteristics } from '../address-identifiers/address-characterisitics.service';
import { AddressOption } from '../address-services/models/address.model';
import { getTranslation } from '@fronyx/translations';
import { generateNoAvailableChargePointAlongRouteInDBText } from '../../models/charge-gpt-translation.assets';
import { Leg, Route } from './routes.model';
import { calculateChargingStationsScore } from '../scoring-services/recommendations-type.functions';
import { STANDARD_SEARCH_DISTANCE } from '@fronyx/locations';
import { ChargingStationWithScoreDetails } from '../../models/charging-stations.model';
import { validateCountryCodePermissionWithinProject } from '../conversations-helper.service';
import { AddressCharacteristics } from '../address-identifiers/address-characteristics.model';
import { LocationFilter } from '../../../../../../apps/cdk-apps/src/shared';

const START_METER_POINT = 5000;
const END_METER_POINT = 50000;

export const getRecommendedChargingStationsAlongRoute = async (
  project: ToolkitProject,
  history: ConversationHistory,
  origin: Coordinates,
  destination: Coordinates,
  routeNeed: string
): Promise<RoutesRecommendation> => {
  const [findAllStopsErr, legs] = await useTryAsync(() =>
    getAllStopsAlongRoute(origin, destination)
  );

  const allStops = legs[0].points;

  const routes: Route[] = [
    {
      legs: [{ points: allStops }],
    },
  ];

  history.setRouteLengthInMeters(legs[0].summary.lengthInMeters);

  if (findAllStopsErr) {
    return { error: findAllStopsErr, routes: [] };
  }

  if (!allStops || allStops.length < 1) {
    const message = getTranslation(
      history.language,
      'errorMessages.invalidRoute'
    );

    return {
      error: {
        message,
      },
      routes: [],
    };
  }

  const [err, chargingStations] = await useTryAsync(() =>
    getChargingStationsWithStopPoint(
      getChargingStopsInRange(allStops, destination),
      history,
      project,
      routes
    )
  );

  if (!chargingStations || chargingStations.length < 1 || err) {
    const errorMessage =
      generateNoAvailableChargePointAlongRouteInDBText(history);

    return {
      error: {
        message: err?.message ? err.message : errorMessage,
      },
      routes: [],
    };
  }

  return chooseSuitableChargingStations(
    chargingStations,
    routes,
    routeNeed,
    project,
    history,
    origin,
    destination
  );
};

interface ErrorMessage {
  message?: string;
  internalMessage?: string;
}
interface RecommendationSummary {
  latitude?: number;
  longitude?: number;
  nextStops?: StopPoint[];
  address?: string;
  locations?: Location[];
  error?: ErrorMessage;
}

interface ChargingStationWithStopPoint extends Location {
  stopPoint: StopPointWithNextStop;
}

type ChargingStationWithStopPointAndScoreDetails =
  ChargingStationWithStopPoint & ChargingStationWithScoreDetails;

const getTomTomApiClient = () => {
  return {
    getRoutes: async (stops: string[]) => {
      const client = axios.create({
        baseURL: 'https://api.tomtom.com/routing/1/calculateRoute',
      });

      const url = `/${stops.join(
        ':'
      )}/json?key=${configService.getTomtomApiKey()}`;

      console.info('External API Routing URL:', `${client.getUri()}${url}`);

      console.info('Routing URL:', `${client.getUri()}${url}`);

      const [err, res] = await useTryAsync(() => client.get(url));

      if (err) {
        throw err;
      }

      return res.data?.routes;
    },
  };
};

const queryRoutingPointsAlongRoute = async (
  origin: string,
  destination: string
) => {
  const client = getTomTomApiClient();
  const routes = await client.getRoutes([origin, destination]);

  if (!routes) {
    throw new Error(`Invalid routes provided: ${origin}:${destination}`);
  }

  return routes[0];
};

const getTravelDistance = async (stops: string[], retryCount = 0) => {
  const client = getTomTomApiClient();
  const [err, routes] = await useTryAsync(() => client.getRoutes(stops));

  if (err && retryCount < 10) {
    await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
    return getTravelDistance(stops, retryCount + 1);
  }

  if (!routes) {
    throw new Error(
      `Invalid routes provided for travel distance: ${stops.join(':')}`
    );
  }

  const route = routes[0];

  const [firstLeg] = route.legs;

  return firstLeg.summary.lengthInMeters;
};

interface StopPoint {
  latitude: number;
  longitude: number;
}

interface StopPointWithNextStop extends StopPoint {
  nextStops: StopPoint[];
}

const getChargingStopsInRange = (
  allStops: StopPoint[],
  destinationCoordinates: Coordinates
): StopPointWithNextStop[] => {
  const pointsAlongRoute = [...allStops];
  const stopPoints: StopPointWithNextStop[] = [];
  let totalDistanceSteps = 0;

  let anchorLocation = pointsAlongRoute.shift();

  for (let i = 0; i < pointsAlongRoute.length; i++) {
    const secondPoint = pointsAlongRoute[i + 1];

    if (!secondPoint) {
      if (stopPoints.length < 1) {
        const nextStops = pointsAlongRoute.slice(i + 2);
        nextStops.push(coordinatesToStopPoint(destinationCoordinates));
        stopPoints.push({
          ...pointsAlongRoute[i],
          nextStops,
        });
      }

      return stopPoints;
    }

    const distanceBetweenPoints = distanceInMeterBetween2Locations(
      anchorLocation.latitude,
      anchorLocation.longitude,
      secondPoint.latitude,
      secondPoint.longitude
    );

    if (
      totalDistanceSteps > END_METER_POINT ||
      distanceBetweenPoints > END_METER_POINT
    ) {
      return stopPoints;
    }

    if (distanceBetweenPoints > START_METER_POINT) {
      const nextStops = pointsAlongRoute.slice(i + 2);
      nextStops.push(coordinatesToStopPoint(destinationCoordinates));
      stopPoints.push({
        ...secondPoint,
        nextStops,
      });

      anchorLocation = secondPoint;
      totalDistanceSteps += distanceBetweenPoints;
    }
  }

  return stopPoints;
};

const coordinatesToStopPoint = (coordinates: Coordinates): StopPoint => {
  return {
    latitude: coordinates.lat,
    longitude: coordinates.lng,
  };
};

const getAvailableChargePointsAtPotentialChargingStops = async (
  stop: StopPointWithNextStop,
  project: ToolkitProject,
  history: ConversationHistory,
  disableFallback = true
): Promise<RecommendationSummary> => {
  const clonedHistory = new ConversationHistory(history.getJSON());
  clonedHistory.setLatitude(String(stop.latitude));
  clonedHistory.setLongitude(String(stop.longitude));

  const { locations, error } = await searchForAvailableChargingStations(
    clonedHistory,
    project,
    STANDARD_SEARCH_DISTANCE,
    disableFallback
  );

  if (error) {
    return {
      error,
    };
  }

  return {
    ...stop,
    nextStops: stop.nextStops,
    locations,
    error,
  };
};

const getAllStopsAlongRoute = async (
  origin: Coordinates,
  destination: Coordinates
): Promise<Leg[]> => {
  const originString = `${origin.lat},${origin.lng}`;
  const destinationString = `${destination.lat},${destination.lng}`;

  const [err, routes] = await useTryAsync(() =>
    queryRoutingPointsAlongRoute(originString, destinationString)
  );

  if (!routes.legs?.length) {
    throw err ? err : new Error('No legs found');
  }

  return routes.legs;
};

interface RoutesRecommendation {
  error?: ErrorMessage;
  chargingStations?: ChargingStationWithScoreDetails[];
  destination?: Coordinates & { address?: string };
  navigationLink?: string;
  routes: Route[];
}

const chooseSuitableChargingStations = async (
  chargingStations: ChargingStationWithStopPoint[],
  routes: Route[],
  routeNeed: string,
  project: ToolkitProject,
  history: ConversationHistory,
  originCoordinates: Coordinates,
  destinationCoordinates: Coordinates,
  maxTravelDistance = 3000
): Promise<RoutesRecommendation> => {
  const poiSearchResults: Record<
    string,
    AddressOptionsWithTravelDistance[] | null
  > = {};

  let routeCharacteristics = undefined;

  if (routeNeed) {
    routeCharacteristics = await identifyAddressCharacteristics(
      routeNeed,
      history.id,
      project.name,
      project.chargegpt_output_type,
      history.language.toLowerCase()
    );
  }

  for (const station of chargingStations) {
    if (routeNeed) {
      if (poiSearchResults[pointToString(station.stopPoint)] === undefined) {
        const possiblePois = await searchRouteNeeds(
          routeCharacteristics,
          String(station.lat),
          String(station.lng)
        );

        if (
          possiblePois &&
          possiblePois.addressOptions &&
          possiblePois.addressOptions.length > 0
        ) {
          poiSearchResults[pointToString(station.stopPoint)] =
            await enrichAddressOptionsWithTravelDistance(
              possiblePois.addressOptions,
              station
            );
        } else {
          poiSearchResults[pointToString(station.stopPoint)] = null;
        }
      }

      if (poiSearchResults[pointToString(station.stopPoint)] === null) {
        continue;
      }

      const possiblePois = poiSearchResults[pointToString(station.stopPoint)];
      if (possiblePois) {
        const poiFromChargingStations = possiblePois.map((poi) => ({
          ...poi,
          distance: distanceInMeterBetween2Locations(
            station.lat,
            station.lng,
            poi.lat,
            poi.lng
          ),
        }));
        poiFromChargingStations.sort(
          ({ distance: a }, { distance: b }) => a - b
        );

        const bestPoi = getBestPoiForChargingStation(
          poiFromChargingStations,
          station
        );

        const stationSideOfTravel = getSideOfTravelOfChargingStation(station);

        if (bestPoi) {
          return chargingStationToRecommendationSummary(
            station,
            getChargingStationsAtStopPoint(
              station.stopPoint,
              chargingStations
            ).filter(
              (otherStation) =>
                getSideOfTravelOfChargingStation(otherStation) ===
                stationSideOfTravel
            ),
            bestPoi,
            originCoordinates,
            destinationCoordinates,
            routes
          );
        }
      }
    } else {
      const travelDistance = await getTravelDistance(
        enrichedChargingStationToRoutes(station)
      );

      if (travelDistance < maxTravelDistance) {
        const sideOfTravel = getSideOfTravelOfChargingStation(station);

        const stationsAtSameStopPoint = getChargingStationsAtStopPoint(
          station.stopPoint,
          chargingStations
        ).filter(
          (otherStation) =>
            getSideOfTravelOfChargingStation(otherStation) === sideOfTravel
        );

        return chargingStationToRecommendationSummary(
          station,
          stationsAtSameStopPoint,
          null,
          originCoordinates,
          destinationCoordinates,
          routes
        );
      }

      if (maxTravelDistance < 5000) {
        return chooseSuitableChargingStations(
          chargingStations,
          routes,
          routeNeed,
          project,
          history,
          originCoordinates,
          destinationCoordinates,
          maxTravelDistance + 2000
        );
      }
    }
  }

  return {
    error: {
      message: generateNoAvailableChargePointAlongRouteInDBText(history),
    },
    routes: [],
  };
};

const getBestPoiForChargingStation = (
  addressOptions: AddressOptionsWithTravelDistance[],
  station: ChargingStationWithStopPoint,
  maxTravelDistance = 3000
): AddressOptionsWithTravelDistance => {
  const stationSideOfTravel = getSideOfTravelOfChargingStation(station);

  const bestPoi = addressOptions.find(
    ({ travelDistance, sideOfTravel }) =>
      sideOfTravel === stationSideOfTravel && travelDistance < maxTravelDistance
  );

  if (bestPoi) {
    return bestPoi;
  }

  if (maxTravelDistance < 10000) {
    return getBestPoiForChargingStation(
      addressOptions,
      station,
      maxTravelDistance + 2000
    );
  }

  return null;
};

const enrichAddressOptionsWithTravelDistance = async (
  addressOptions: AddressOption[],
  chargingStation: ChargingStationWithStopPoint
): Promise<AddressOptionsWithTravelDistance[]> => {
  const closestNextStop = getClosestNextStopToCoordinates(
    chargingStation.stopPoint.nextStops,
    { lat: chargingStation.lat, lng: chargingStation.lng }
  );

  const addressOptionsWithRoutes: AddressOptionsWithRouteString[] =
    addressOptions.map((option) => ({
      ...option,
      routes: [
        `${chargingStation.stopPoint.latitude},${chargingStation.stopPoint.longitude}`,
        `${option.lat},${option.lng}`,
        `${closestNextStop.latitude},${closestNextStop.longitude}`,
      ],
    }));
  const enrichRequests = addressOptionsWithRoutes.map((option) =>
    getTravelDistance(option.routes)
  );
  const enrichResults = await Promise.all(enrichRequests);
  return enrichResults.map((travelDistance, index) => ({
    ...addressOptionsWithRoutes[index],
    travelDistance,
    sideOfTravel: getSideOfTravelOfChargingStation({
      ...chargingStation,
      lat: addressOptionsWithRoutes[index].lat,
      lng: addressOptionsWithRoutes[index].lng,
    }),
  }));
};

const getClosestNextStopToCoordinates = (
  stopPoints: StopPoint[],
  targetCoordinates: Coordinates
): StopPoint => {
  const stopPointsWithDistance = stopPoints.map((stopPoint) => ({
    ...stopPoint,
    distance: distanceInMeterBetween2Locations(
      targetCoordinates.lat,
      targetCoordinates.lng,
      stopPoint.latitude,
      stopPoint.longitude
    ),
  }));
  const minDistance = Math.min(
    ...stopPointsWithDistance.map(({ distance }) => distance)
  );

  const closestStopPoint = stopPointsWithDistance.find(
    ({ distance }) => distance === minDistance
  );

  return {
    latitude: closestStopPoint.latitude,
    longitude: closestStopPoint.longitude,
  };
};

const getSideOfTravelOfChargingStation = (
  station: ChargingStationWithStopPoint
): 'left' | 'right' => {
  const closestNextStop = getClosestNextStopToCoordinates(
    station.stopPoint.nextStops,
    {
      lat: station.lat,
      lng: station.lng,
    }
  );
  return isRightOfLine(
    {
      a: {
        lat: station.stopPoint.latitude,
        lng: station.stopPoint.longitude,
      },
      b: {
        lat: closestNextStop.latitude,
        lng: closestNextStop.longitude,
      },
    },
    { lat: station.lat, lng: station.lng }
  )
    ? 'right'
    : 'left';
};

const getChargingStationsAtStopPoint = (
  targetStopPoint: StopPointWithNextStop,
  chargingStations: ChargingStationWithStopPoint[]
): ChargingStationWithStopPoint[] => {
  return chargingStations.filter(
    ({ stopPoint }) =>
      stopPoint.latitude === targetStopPoint.latitude &&
      stopPoint.longitude === targetStopPoint.longitude
  );
};

const chargingStationWithStopPointToScoreDetails = (
  chargingStation: ChargingStationWithStopPointAndScoreDetails
): ChargingStationWithScoreDetails => {
  const { stopPoint, ...rest } = chargingStation;
  return rest;
};

const chargingStationWithScoreDetailsToLocation = (
  chargingStation: ChargingStationWithScoreDetails
): Location => {
  const { score, primaryIds, ...rest } = chargingStation;
  return rest;
};

const chargingStationToRecommendationSummary = (
  targetChargingStation: ChargingStationWithStopPoint,
  otherChargingStations: ChargingStationWithStopPoint[],
  poi: AddressOption,
  originCoordinates: Coordinates,
  destinationCoordinates: Coordinates,
  routes: Route[]
): RoutesRecommendation => {
  otherChargingStations.sort(({ score: a }, { score: b }) => b - a);

  const destination = {
    lat: poi ? poi.lat : targetChargingStation.stopPoint.latitude,
    lng: poi ? poi.lng : targetChargingStation.stopPoint.longitude,
    address: poi ? poi.address : 'Stop point',
  };

  return {
    chargingStations: otherChargingStations.map(
      chargingStationWithStopPointToScoreDetails
    ),
    navigationLink: getNavigationFromOriginToDestinationWithChargePointStops(
      `${originCoordinates.lat},${originCoordinates.lng}`,
      `${destinationCoordinates.lat},${destinationCoordinates.lng}`,
      [targetChargingStation]
    ),
    destination,
    routes,
  };
};

const enrichedChargingStationToRoutes = (
  chargingStation: ChargingStationWithStopPoint
): string[] => {
  const endPoint =
    chargingStation.stopPoint.nextStops[
      chargingStation.stopPoint.nextStops.length - 1
    ];
  return [
    `${chargingStation.stopPoint.latitude},${chargingStation.stopPoint.longitude}`,
    `${chargingStation.lat},${chargingStation.lng}`,
    `${endPoint.latitude},${endPoint.longitude}`,
  ];
};

const calculateChargingStationsWithStopPointsScore = (
  chargingStations: ChargingStationWithStopPoint[]
): ChargingStationWithStopPointAndScoreDetails[] => {
  if (chargingStations.length < 1) {
    return [];
  }

  const scoredChargingStations =
    calculateChargingStationsScore(chargingStations);
  return scoredChargingStations as unknown as ChargingStationWithStopPointAndScoreDetails[];
};

// Get all charging stations ordered by scored and enriched with stop point
const getChargingStationsWithStopPoint = async (
  stopPoints: StopPointWithNextStop[],
  history: ConversationHistory,
  project: ToolkitProject,
  routes: Route[],
  isFallbackCycle = false
): Promise<ChargingStationWithStopPointAndScoreDetails[]> => {
  const stopWithChargingStationsQueries = stopPoints.map((stopPoint) =>
    getAvailableChargePointsAtPotentialChargingStops(
      stopPoint,
      project,
      history,
      !isFallbackCycle
    )
  );

  const potentialChargingStopsResults = await Promise.all(
    stopWithChargingStationsQueries
  );

  // enrich location with StopPoint
  const allStations = potentialChargingStopsResults.flatMap(
    mapSummaryToChargingStationWithStopPoint
  );

  if (allStations.length < 1 && !!isFallbackCycle) {
    const potentialError = potentialChargingStopsResults.find(
      ({ error }) => !!error
    );

    if (potentialError) {
      throw (potentialError as any).error;
    } else {
      throw new Error(
        'Unknown error when searching for potential charging stops'
      );
    }
  }

  const scoredChargingStations =
    calculateChargingStationsWithStopPointsScore(allStations);
  scoredChargingStations.sort((a, b) => b.score - a.score);

  const blockedLocationIds = history.getBlockedLocations();

  const chargingStations = scoredChargingStations.filter(
    ({ locationId }) => !blockedLocationIds.includes(locationId)
  );

  if (chargingStations.length > 0) {
    history.setAvailableChargingStations(
      chargingStations
        .map(chargingStationWithStopPointToScoreDetails)
        .map(chargingStationWithScoreDetailsToLocation)
    );
    return chargingStations;
  }

  if (chargingStations.length < 1 && isFallbackCycle) {
    const potentialError = potentialChargingStopsResults.find(
      ({ error }) => !!error
    );

    if (potentialError) {
      throw (potentialError as any).error;
    } else {
      throw new Error(
        'Unknown error when searching for potential charging stops'
      );
    }
  }

  return getChargingStationsWithStopPoint(
    stopPoints,
    history,
    project,
    routes,
    true
  );
};

const mapSummaryToChargingStationWithStopPoint = (
  summary: RecommendationSummary
): ChargingStationWithStopPoint[] => {
  if (summary.error) {
    return [];
  }

  return summary.locations.map((location) => ({
    ...location,
    stopPoint: {
      latitude: summary.latitude,
      longitude: summary.longitude,
      nextStops: summary.nextStops,
    },
  }));
};

const getNavigationFromOriginToDestinationWithChargePointStops = (
  originCoordinates: string,
  destinationCoordinates: string,
  chargingStops: Location[]
): string => {
  let waypoints = '';

  for (let i = 0; i < chargingStops.length; i++) {
    waypoints +=
      `${i > 0 ? '|' : ''}` + `${chargingStops[i].lat},${chargingStops[i].lng}`;
  }

  return `https://www.google.com/maps/dir/?api=1&origin=${originCoordinates}&destination=${destinationCoordinates}&waypoints=${waypoints}&travelmode=driving`;
};

const getAddressCharacteristics = async (
  history: ConversationHistory,
  project: ToolkitProject,
  address: string
): Promise<AddressCharacteristics | null> => {
  const addressCharacteristicsOutput = await identifyAddressCharacteristics(
    address,
    history.id,
    project.name,
    project.chargegpt_output_type,
    history.language.toLowerCase()
  );

  history.setLastAddressQueryString(address);
  history.setIsAddressInvalid(false);

  return addressCharacteristicsOutput;
};

export const getAddressDetails = async (
  history: ConversationHistory,
  project: ToolkitProject,
  address: string,
  disableCountryScopeValidation = false
): Promise<AddressOption> => {
  const addressCharacteristicsOutput = await getAddressCharacteristics(
    history,
    project,
    address
  );
  const { error, addressOptions, isPoiSearch } = await getPotentialDestinations(
    addressCharacteristicsOutput,
    {
      isNearbyRequested: false,
      currentCoordinates: null,
      language: history.language,
      supportedCountries: getSupportedCountriesFromProject(project),
      projectName: project.name,
      disableCountryScopeValidation,
    }
  );

  history.setIsDestinationAPOI(isPoiSearch);

  if (error) {
    chargeGPTLogger(
      history.id,
      history.projectName,
      'POISearchServiceError',
      error.internalMessage
    );

    history.setDestinationAddress('');
    history.setOriginAddress('');
    history.setLatitude('');
    history.setLongitude('');

    if (error instanceof AddressOutOfScopeError) {
      throw error;
    }

    throw new AddressNotFoundError(
      error.internalMessage,
      addressCharacteristicsOutput.addressSummary
    );
  }
  return addressOptions[0];
};

interface AddressOptionsWithRouteString extends AddressOption {
  routes: string[];
}

interface AddressOptionsWithTravelDistance
  extends AddressOptionsWithRouteString {
  travelDistance: number;
  sideOfTravel: 'left' | 'right';
}

const pointToString = (point: StopPoint): string => {
  return `${point.latitude},${point.longitude}`;
};

export const isRoutingUseCase = (origin, destination) => origin && destination;

interface Point {
  lat: number;
  lng: number;
}

interface Line {
  a: Point;
  b: Point;
}

export const isRightOfLine = (line: Line, point: Point): any => {
  return (
    (line.b.lng - line.a.lng) * (point.lat - line.a.lat) -
      (line.b.lat - line.a.lat) * (point.lng - line.a.lng) <=
    0
  );
};
