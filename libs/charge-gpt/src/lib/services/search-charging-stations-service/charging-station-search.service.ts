import { chooseAvailableLocations } from '../locations-selector.service';
import { Location } from '@fronyx/data-transfer-object';
import {
  BIGGEST_SEARCH_DISTANCE,
  getChargingStationSearchFunction,
  getNearestLocations,
} from '@fronyx/locations';
import {
  InvalidDateTimeRequestError,
  NoChargePointsAvailableError,
  NoChargePointsInDBError,
} from '../../../../../../apps/cdk-apps/src/shared';
import { ConversationHistory } from '../../models/conversation-history.model';
import {
  invalidDateTime,
  noChargePointsAvailable,
  noChargePointsInDB,
  noChargePointsAvailableWithinAddressOptions,
  noChargePointsInDBForAllAddressOptions,
  generateNoAvailableChargePointAlongRouteInDBText,
  generateNoAvailableChargePointAlongRouteText,
} from '../../models/charge-gpt-translation.assets';
import { isEmptyString } from '../../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { configService } from '@fronyx/configurations';
import { useTryAsync } from 'no-try';
import { ToolkitProject } from '@fronyx/toolkit';
import { Tracer } from '../tracer';

interface ProcessError {
  isError: boolean;
  error: ErrorMessage;
}

interface ErrorMessage {
  message?: string;
  internalMessage?: string;
}

interface NearbyLocationsResult {
  isError: boolean;
  error?: ErrorMessage;
  locations?: Location[];
}

export const searchForAvailableChargingStations = async (
  history: ConversationHistory,
  project: ToolkitProject,
  maxSearchDistance?: number,
  disableFallback?: boolean,
): Promise<{
  locations: Location[];
  error: any;
}> => {
  const tracer = new Tracer('chargingStationSearch', project.name);
  tracer.start();

  const { results: locations, error } = await searchChargingStations({
    history,
    project,
    maxSearchDistance,
    disableFallback,
  });

  tracer.end();

  return {
    locations,
    error,
  };
};

const searchChargingStations = async (payload: {
  project: ToolkitProject;
  history: ConversationHistory;
  maxSearchDistance?: number;
  disableFallback: boolean;
}): Promise<{
  results?: Location[];
  isError: boolean;
  error?: {
    message?: string;
    internalMessage?: string;
  };
}> => {
  if (isRequestingTimeInThePast(payload.history)) {
    return requestingTimeInThePastError(payload.history);
  }

  const { isError, error, locations } =
    await getAvailableNearbyChargingStations({
      history: payload.history,
      project: payload.project,
      maxSearchDistance: payload.maxSearchDistance,
      disableFallback: payload.disableFallback,
    });

  return {
    isError,
    error,
    results: locations ?? [],
  };
};

const getAvailableNearbyChargingStations = async (payload: {
  history: ConversationHistory;
  project: ToolkitProject;
  maxSearchDistance?: number;
  disableFallback?: boolean;
}): Promise<NearbyLocationsResult> => {
  const tracer = new Tracer(
    'getChargingStations_dbQuery',
    payload.project.name
  );
  tracer.start();

  const { isError, locations: allLocations } = await getLocations(payload);

  const isSearchRadiusIncreased =
    payload.maxSearchDistance === BIGGEST_SEARCH_DISTANCE;

  if (isError) {
    tracer.end();
    return noChargePointsInDBError(payload.history, isSearchRadiusIncreased);
  }

  const locations = await chooseAvailableLocations(
    manipulateLocationsAvailabilityByProject(allLocations, payload.project),
    payload.history.getClientTimestampAsDate(),
    new Date(payload.history.getRawDateTime() ?? Date.now())
  );

  if (!locations?.length) {
    tracer.end();
    return noChargePointsAvailableError(
      payload.history,
      allLocations,
      isSearchRadiusIncreased
    );
  }

  tracer.end();
  return {
    locations,
    isError: false,
  };
};

const getLocations = async (payload: {
  history: ConversationHistory;
  project: ToolkitProject;
  maxSearchDistance?: number;
  disableFallback?: boolean;
}): Promise<{
  isError: boolean;
  error?: string;
  locations?: Location[];
}> => {
  const operatorName = payload.history.getOperatorName() ?? null;
  const featureFlags = payload.project.getFeatureFlags(
    configService.isProduction()
  );

  const [err, locations] = await useTryAsync(() =>
    getNearestLocations(
      {
        latitude: payload.history.getLatitude(),
        longitude: payload.history.getLongitude(),
        operatorName,
        maxSearchDistance: payload.maxSearchDistance,
        powerType: payload.history.getPowerType(),
        minPower: payload.history.getMinPower(),
        maxPower: payload.history.getMaxPower(),
        connectorType: payload.history.getConnectorType(),
        isPowerTypeFallbackEnabled:
          featureFlags['chargegpt_recommendations_power_type_fallback'] ??
          false,
        dataSource: payload.project.data_source,
        disableFallback: payload.disableFallback,
      },
      getChargingStationSearchFunction(payload.project.data_source)
    )
  );

  if (err) {
    console.error(err);
    return {
      isError: true,
      error: `Error getting locations: ${err}`,
    };
  }

  if (!locations?.length) {
    return {
      isError: true,
      error: 'Could not get locations within range',
    };
  }

  return {
    isError: false,
    locations,
  };
};

export const getRequestedDateFromConversation = (
  requestedDateTime: unknown,
  clientTimestamp: Date
): Date => {
  return !isEmptyString(requestedDateTime as string)
    ? new Date(requestedDateTime as string)
    : clientTimestamp;
};

export const applyDateTimeOffset = (
  dateTime: Date,
  timezoneOffset: number
): Date => {
  if (isNaN(timezoneOffset)) {
    throw new Error('Invalid timezone offset');
  }

  return new Date(dateTime.getTime() - timezoneOffset * 60000);
};

export const requestingTimeInThePastError = (
  history: ConversationHistory
): ProcessError => {
  const offsettedDateTime = getRequestedDateFromConversation(
    history.getRawDateTime(),
    history.getClientTimestampAsDate()
  );

  const message = invalidDateTime({
    language: history.language,
    requestedDateTime: offsettedDateTime,
  });

  return {
    isError: true,
    error: {
      message: new InvalidDateTimeRequestError(message).message,
      internalMessage: new InvalidDateTimeRequestError(message).internalMessage,
    },
  };
};

export const noChargePointsInDBError = (
  history: ConversationHistory,
  isSearchRadiusIncreased = false
): ProcessError => {
  if (history.getOriginAddress() && history.getDestinationAddress()) {
    const message = generateNoAvailableChargePointAlongRouteInDBText(history);

    return {
      isError: true,
      error: new NoChargePointsInDBError(message),
    };
  }

  const message = history.getIsLocationsAreSearchBasedOnAddressOptions()
    ? noChargePointsInDBForAllAddressOptions(history)
    : noChargePointsInDB(history, isSearchRadiusIncreased);

  return {
    isError: true,
    error: new NoChargePointsInDBError(message),
  };
};

export const noChargePointsAvailableError = (
  history: ConversationHistory,
  locations: Location[],
  isSearchRadiusIncreased = false
): ProcessError => {
  const requestedPowerType = history.getPowerType();
  const filteredLocations =
    requestedPowerType !== 'both'
      ? locations.filter(
          (location) =>
            location.powerType?.toLowerCase() ===
            requestedPowerType.toLowerCase()
        )
      : locations;

  if (history.getOriginAddress() && history.getDestinationAddress()) {
    const message = generateNoAvailableChargePointAlongRouteText(
      history,
      filteredLocations.length,
      isSearchRadiusIncreased
    );

    return {
      isError: true,
      error: new NoChargePointsAvailableError(message),
    };
  }

  const message = history.getIsLocationsAreSearchBasedOnAddressOptions()
    ? noChargePointsAvailableWithinAddressOptions(
        history,
        filteredLocations.length
      )
    : noChargePointsAvailable(
        history,
        filteredLocations.length,
        isSearchRadiusIncreased
      );

  return {
    isError: true,
    error: new NoChargePointsAvailableError(message),
  };
};

export const isRequestingTimeInThePast = (
  history: ConversationHistory
): boolean => {
  let dateTime = new Date(history.getProcessedDateTime());

  // date-time processing
  if (!dateTime) {
    dateTime = history.getClientTimestampAsDate();
  }
  return dateTime < history.getClientTimestampAsDateWithBuffer();
};

const manipulateLocationsAvailabilityByProject = (
  locations: Location[],
  project: ToolkitProject
) => {
  if (project.data_source === 'MUV') {
    return locations.map((val) => ({
      ...val,
      isCurrentlyAvailable: true,
      probability: 0,
    }));
  }

  return locations;
};
