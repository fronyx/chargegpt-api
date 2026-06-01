import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { chargingStationsClient } from '@fronyx/persistence';
import { Location, SUPPORTED_PEER_ID } from '@fronyx/data-transfer-object';
import {
  NeutralPartnerData,
  GetNearestLocationsArguments,
  SearchChargingStationFn,
} from '../interfaces/NeutralPartner-data.model';

const getValidPowerType = (powerType: string): string | undefined => {
  if (!powerType) {
    return undefined;
  }

  if (powerType === 'all' || powerType === 'both' || powerType === 'null') {
    return undefined;
  }

  return powerType.toUpperCase() === 'DC' ? 'DC' : 'AC';
};

const getValidOperatorName = (operatorName: string): string | undefined => {
  if (!operatorName) {
    return undefined;
  }

  if (operatorName === 'all') {
    return undefined;
  }

  return operatorName;
};

export const getNearestLocations = async (
  args: GetNearestLocationsArguments,
  searchFn: SearchChargingStationFn
): Promise<Location[]> => {
  const queryPayload = {
    dataSource: args.dataSource ?? 'FRK',
    longitude: args.longitude,
    latitude: args.latitude,
    maxSearchDistance: args.maxSearchDistance,
    minPower: args.minPower,
    maxPower: args.maxPower,
    connectorType: args.connectorType,
    powerType: getValidPowerType(args.powerType),
    operatorName: getValidOperatorName(args.operatorName),
    disableFallback: !!args.disableFallback,
  };

  // if disableFallback is true, don't fallback and ignore FF
  // if disableFallback is false, follow FF

  const isFallbackEnabled =
    args.disableFallback === true ? false : args.isPowerTypeFallbackEnabled;

  const chargePoints = await searchFn(
    queryPayload.dataSource,
    queryPayload.longitude,
    queryPayload.latitude,
    queryPayload.maxSearchDistance,
    queryPayload.minPower,
    queryPayload.maxPower,
    queryPayload.connectorType,
    queryPayload.powerType,
    queryPayload.operatorName,
    isFallbackEnabled
  );

  if (chargePoints.length < 1 && queryPayload.powerType && isFallbackEnabled) {
    return getNearestLocations(
      {
        ...queryPayload,
        isPowerTypeFallbackEnabled: false,
        powerType: undefined,
        minPower: undefined,
        maxPower: undefined,
      },
      getChargingStationSearchFunction(queryPayload.dataSource)
    );
  }

  if (
    chargePoints.length < 1 &&
    isNumber(queryPayload.minPower) &&
    isNumber(queryPayload.maxPower) &&
    isFallbackEnabled
  ) {
    return getNearestLocations(
      {
        ...queryPayload,
        isPowerTypeFallbackEnabled: false,
        powerType: undefined,
        minPower: undefined,
        maxPower: undefined,
      },
      getChargingStationSearchFunction(queryPayload.dataSource)
    );
  }

  return sortNearbyLocations({
    locations: chargePoints,
    powerType: queryPayload.powerType,
    minPower: !isNaN(Number(args.minPower)) ? Number(args.minPower) : undefined,
    maxPower: !isNaN(Number(args.maxPower)) ? Number(args.maxPower) : undefined,
    connectorType: queryPayload.connectorType,
  });
};

const isNumber = (value: any): boolean => {
  return typeof value === 'number';
};

const sortNearbyLocations = (args: {
  locations: any[];
  powerType?: string;
  minPower?: number;
  maxPower?: number;
  connectorType?: string;
}): any[] => {
  if (args.locations.length < 1) {
    return [];
  }

  //TODO need to sort by connectorType as well and checks for all charging needs instead of just one.

  if (!isEmptyString(args.powerType)) {
    const locationsWithDesiredPowerType = args.locations
      .filter(
        (location) =>
          location.powerType.toLowerCase() === args.powerType.toLowerCase()
      )
      .sort(({ distance: a }, { distance: b }) => a - b);

    const fallbackLocations = args.locations
      .filter(
        (location) =>
          location.powerType.toLowerCase() !== args.powerType.toLowerCase()
      )
      .sort(({ distance: a }, { distance: b }) => a - b);

    return locationsWithDesiredPowerType.concat(fallbackLocations);
  }

  if (!isNaN(args.minPower) && !isNaN(args.maxPower)) {
    const locationsWithDesiredPowerValue = args.locations
      .filter(
        (location) =>
          location.powerKw >= args.minPower && location.powerKw <= args.maxPower
      )
      .sort(({ distance: a }, { distance: b }) => a - b);

    const fallbackLocations = args.locations
      .filter(
        (location) =>
          location.powerKw < args.minPower || location.powerKw > args.maxPower
      )
      .sort(({ distance: a }, { distance: b }) => a - b);

    return locationsWithDesiredPowerValue.concat(fallbackLocations);
  }

  return args.locations.sort(({ distance: a }, { distance: b }) => a - b);
};

const createGoogleMapLink = (latitude: string, longitude: string): string => {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
};

const searchNearbyChargingStations = async (
  partyId: string,
  longitude: number,
  latitude: number,
  maxDistance = STANDARD_SEARCH_DISTANCE,
  minPower: number,
  maxPower: number,
  connectorStandard: string,
  powerType: string,
  operatorName: string,
  isPowerFallbackEnabled: boolean
): Promise<Location[]> => {
  const queryArray = [
    'SELECT ST_DISTANCE(r.location, @compareLocation) distance, r.ocpi location, r.powerTypes, r.powerLevels, r.plugs, r.lastUsed',
    'FROM root r',
    'WHERE r.partyId = @partyId',
    'AND ST_DISTANCE(r.location, @compareLocation) <= @maxDistance',
  ];
  const parameters = [
    {
      name: '@partyId',
      value: partyId,
    },
    {
      name: '@maxDistance',
      value: maxDistance,
    },
    {
      name: '@compareLocation',
      value: {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)],
      },
    },
  ];

  if (!isPowerFallbackEnabled) {
    if (powerType) {
      queryArray.push('AND ARRAY_CONTAINS(r.powerTypes, @powerType)');
      parameters.push({
        name: '@powerType',
        value: powerType,
      });
    } else if (minPower && maxPower) {
      queryArray.push(
        'AND ((r.powerLevels[0] >= @minPower AND r.powerLevels[0] <= @maxPower) OR (r.powerLevels[1] >= @minPower AND r.powerLevels[1] <= @maxPower))'
      );
      parameters.push({
        name: '@minPower',
        value: minPower,
      });
      parameters.push({
        name: '@maxPower',
        value: maxPower,
      });
    }
  }

  if (operatorName) {
    queryArray.push(
      'AND (RegexMatch(r.ocpi.operator.name, @operatorName, "i") OR RegexMatch(r.ocpi.suboperator.name, @operatorName, "i"))'
    );
    parameters.push({
      name: '@operatorName',
      value: operatorName,
    });
  }

  if (connectorStandard) {
    queryArray.push('AND ARRAY_CONTAINS(r.plugs, @connectorStandard)');
    parameters.push({
      name: '@connectorStandard',
      value: connectorStandard.toUpperCase(),
    });
  }

  const query = queryArray.join(' ');

  const querySpec = {
    query,
    parameters,
  };

  console.info('Querying charging stations with:', JSON.stringify(querySpec));

  const { resources } = await chargingStationsClient
    .query(querySpec)
    .fetchAll();

  return resources.map((val) => chargingStationToLocation(powerType, val));
};

const searchNearbySkodaChargingStations = async (
  partyId: string,
  longitude: number,
  latitude: number,
  maxDistance = STANDARD_SEARCH_DISTANCE,
  minPower: number,
  maxPower: number,
  connectorStandard: string,
  powerType: string,
  operatorName: string,
  isPowerTypeFallbackEnabled: boolean
): Promise<Location[]> => {
  const queryArray = [
    'SELECT ST_DISTANCE(r.location, @compareLocation) distance, r.location, r.id, r.charging.charge_point_operator.name, r.charging.charging_devices',
    'FROM root r',
    'WHERE r.partyId = @partyId',
    'AND ST_DISTANCE(r.location, @compareLocation) <= @maxDistance',
  ];
  const parameters = [
    {
      name: '@partyId',
      value: 'NeutralPartner',
    },
    {
      name: '@maxDistance',
      value: maxDistance,
    },
    {
      name: '@compareLocation',
      value: {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)],
      },
    },
  ];

  if (!isPowerTypeFallbackEnabled) {
    if (powerType) {
      queryArray.push('AND ARRAY_CONTAINS(r.powerTypes, @powerType)');
      parameters.push({
        name: '@powerType',
        value: powerType,
      });
    } else if (minPower && maxPower) {
      queryArray.push(
        'AND ((r.powerLevels[0] >= @minPower AND r.powerLevels[0] <= @maxPower) OR (r.powerLevels[1] >= @minPower AND r.powerLevels[1] <= @maxPower))'
      );
      parameters.push({
        name: '@minPower',
        value: minPower,
      });
      parameters.push({
        name: '@maxPower',
        value: maxPower,
      });
    }
  }

  if (operatorName) {
    queryArray.push(
      'AND (RegexMatch(r.charging.charge_point_operator.name, @operatorName, "i") OR RegexMatch(r.brand, @operatorName, "i"))'
    );
    parameters.push({
      name: '@operatorName',
      value: operatorName,
    });
  }

  if (connectorStandard) {
    queryArray.push('AND ARRAY_CONTAINS(r.plugs, @connectorStandard)');
    parameters.push({
      name: '@connectorStandard',
      value: connectorStandard.toUpperCase(),
    });
  }

  const query = queryArray.join(' ');

  const querySpec = {
    query,
    parameters,
  };

  console.info(
    'Querying NeutralPartner charging stations with:',
    JSON.stringify(querySpec)
  );

  const { resources } = await chargingStationsClient
    .query(querySpec)
    .fetchAll();

  const locations = [];

  for (const resource of resources) {
    locations.push(
      await mapSkodaChargingStationToLocation(resource, powerType)
    );
  }

  const flattenedLocations = locations.flat();

  if (!flattenedLocations) {
    return [];
  }

  const filteredChargingStations = filterNeutralPartnerLocationBasedOnChargingNeeds(
    flattenedLocations,
    minPower,
    maxPower,
    connectorStandard,
    powerType
  );

  return filteredChargingStations;
};

const chargingStationToLocation = (
  requestedPowerType,
  chargingStation: any
) => {
  if (!chargingStation) {
    return null;
  }

  const { distance, location, plugs, powerTypes, powerLevels } =
    chargingStation;
  const isCurrentlyAvailable = aggregateCurrentAvailability(location);
  const probability = isCurrentlyAvailable ? 0 : 1;
  const lastUsed = chargingStation.lastUsed
    ? new Date(chargingStation.lastUsed).getTime()
    : null;
  return {
    locationId: location.id,
    link: createGoogleMapLink(
      addMissingDecimalPlace(location.coordinates.latitude),
      addMissingDecimalPlace(location.coordinates.longitude)
    ),
    distance,
    lat: Number(addMissingDecimalPlace(location.coordinates.latitude)),
    lng: Number(addMissingDecimalPlace(location.coordinates.longitude)),
    powerType: getBestPowerType(requestedPowerType, powerTypes),
    powerKw: Math.max(...powerLevels),
    connectorTypes: plugs,
    primaryIds: getPrimaryIdsFromLocation(chargingStation.location),
    isCurrentlyAvailable,
    probability,
    operatorName: getOperatorName(location),
    lastUsed,
  };
};

const mapSkodaChargingStationToLocation = async (
  val: NeutralPartnerData,
  requestedPowerType: string
) => {
  if (!val) {
    return null;
  }

  // TODO need to figure out the right endpoint to call without rate limits
  // const [err, chargePoints] = await useTryAsync(() =>
  //   getUpToDateNeutralPartnerChargingDevices(val.id)
  // );

  // if (err || !chargePoints?.length) {
  //   return null;
  // }

  const chargePoints = val.charging_devices;

  return chargePoints.map((device, index) => {
    // const isCurrentlyAvailable = aggregateNeutralPartnerCurrentAvailability(device); // TODO need  to figure out the right endpoint to call without rate limits
    const isCurrentlyAvailable = true;
    const probability = isCurrentlyAvailable ? 0 : 1;
    const evses = device.charging_points;
    const powerTypes = evses
      .map((evse) => evse.current_type.toUpperCase())
      .reduce((acc, val) => acc.concat(val), []);
    const connectorTypes = evses
      .map((evse) => {
        return convertConncetorTypeToStandard(evse.connectors);
      })
      .reduce((acc, val) => acc.concat(val), []);
    const powerLevels = evses
      .map((evse) => evse.power_specs.nominal_power_output)
      .reduce((acc, val) => acc.concat(val), []);

    return {
      locationId: val.id + '_' + index,
      link: createGoogleMapLink(
        addMissingDecimalPlace(val.location.coordinates[1]),
        addMissingDecimalPlace(val.location.coordinates[0])
      ),
      distance: val.distance,
      lat: Number(addMissingDecimalPlace(val.location.coordinates[1])),
      lng: Number(addMissingDecimalPlace(val.location.coordinates[0])),
      powerType: getBestPowerType(requestedPowerType, powerTypes),
      powerKw: Math.max(...powerLevels),
      connectorTypes: connectorTypes,
      primaryIds: getPrimaryIdsFromLocation(val), //TODO need to fix this
      isCurrentlyAvailable,
      probability,
      operatorName: val.name,
    };
  });
};

const getPrimaryIdsFromLocation = (location: any): string[] => {
  if (!location) {
    return [];
  }

  const evses = location.evses;
  if (!Array.isArray(evses) || evses.length < 1) {
    return [];
  }

  return evses.map((evse) => `${location.id}_${evse.uid}`);
};

const aggregateCurrentAvailability = (location: any): boolean => {
  if (!location) {
    return false;
  }

  const evses = location.evses;
  if (!Array.isArray(evses) || evses.length < 1) {
    return false;
  }

  return evses.some((evse) => evse.status === 'AVAILABLE');
};

const aggregateNeutralPartnerCurrentAvailability = (location: any): boolean => {
  if (!location) {
    return false;
  }

  const evses = location.charging_points;
  if (!Array.isArray(evses) || evses.length < 1) {
    return false;
  }

  return evses.some((evse) => evse.live_availability_status === 'available');
};

const getBestPowerType = (requestedPowerType: string, powerTypes: string[]) => {
  if (requestedPowerType) {
    return powerTypes.includes(requestedPowerType)
      ? requestedPowerType
      : powerTypes[0];
  }

  return powerTypes.includes('DC') ? 'DC' : powerTypes[0];
};

const addMissingDecimalPlace = (coordinate) => {
  return Number(coordinate).toFixed(6);
};

export const BIGGEST_SEARCH_DISTANCE = 15000;
export const STANDARD_SEARCH_DISTANCE = 1500;

export const getOperatorName = (location: any): string => {
  if (!isEmptyString(location?.operator?.name)) {
    return location.operator.name;
  } else if (!isEmptyString(location?.suboperator?.name)) {
    return location.suboperator.name;
  } else if (!isEmptyString(location?.owner?.name)) {
    return location.owner.name;
  } else {
    return '';
  }
};

export const filterLocationsByPowerType = (
  chargePoint: Location,
  requestedPowerType
) => {
  return (
    chargePoint.powerType.toUpperCase() === requestedPowerType.toUpperCase()
  );
};

export const filterLocationsByConnectorType = (
  chargePoint: Location,
  requestedConnectorType
) => {
  return chargePoint.connectorTypes.includes(
    requestedConnectorType.toUpperCase()
  );
};

export const filterLocationsByPower = (
  chargePoint: Location,
  minPower: number,
  maxPower: number
) => {
  return chargePoint.powerKw >= minPower && chargePoint.powerKw <= maxPower;
};

export const NeutralPartnerConnectorNametoStandardConnectorType: Record<
  string,
  string
> = {
  type2: 'IEC_62196_T2',
  type2_ccs: 'IEC_62196_T2_COMBO',
  chademo: 'CHADEMO',
  schuko: 'DOMESTIC_F',
};

export const convertConncetorTypeToStandard = (
  connectorTypes: any[]
): string[] => {
  if (!connectorTypes) {
    return [];
  }

  const connectorTyes = connectorTypes.map((connector) => {
    return NeutralPartnerConnectorNametoStandardConnectorType[connector.toLowerCase()];
  });

  return connectorTyes;
};

const filterNeutralPartnerLocationBasedOnChargingNeeds = (
  chargePoints,
  minPower,
  maxPower,
  connectorType,
  powerType
) => {
  return chargePoints
    .filter((cp) => {
      if (isNaN(Number(minPower)) && isNaN(Number(maxPower))) {
        return true;
      }

      return filterLocationsByPower(cp, minPower, maxPower);
    })
    .filter((cp) => {
      if (!powerType) {
        return true;
      }

      return filterLocationsByPowerType(cp, powerType);
    })
    .filter((cp) => {
      if (!connectorType) {
        return true;
      }

      return filterLocationsByConnectorType(cp, connectorType);
    });
};

export const getChargingStationSearchFunction = (
  dataSource: SUPPORTED_PEER_ID
): SearchChargingStationFn => {
  if (dataSource === 'NeutralPartner') {
    return searchNearbySkodaChargingStations;
  }

  return searchNearbyChargingStations;
};

