import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/minimal';
import {
  getChargingStationSearchFunction,
  getNearestLocations,
} from '@fronyx/locations';
import {
  RecommendationInternalServerError,
  RecommendationForbiddenRequestError,
} from '../../../../../../apps/cdk-apps/src/shared';
import { configService } from '@fronyx/configurations';
import { isEmptyString } from '../../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { isObjectEmpty } from '../../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { firstValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { OcpiCountryValue } from '../../../../../../apps/cdk-apps/src/shared/models/general/ocpi-country-value';
import { getPotentialDestinations } from '../address-services/poi-search.service';
import { chooseAvailableLocations } from '../locations-selector.service';
import { Coordinates } from '../../models/prompt';
import { getJSONLog } from '../../models/chat-utilities';
import { labelAndScoreRecommendedChargingStations } from './recommendations-type.functions';
import { SUPPORTED_PEER_ID, Location } from '@fronyx/data-transfer-object';
import { ToolkitProject } from '@fronyx/toolkit';
import { getRecommendedChargingStationsAlongRoute } from '../routes-services/route-search.service';
import { ConversationHistory } from '../../models/conversation-history.model';

@Injectable()
export class RecommendationService {
  constructor(private readonly http: HttpService) {}

  async searchDestinationRecommendation(args: {
    project: ToolkitProject;
    timestamp: number;
    coordinates?: Coordinates;
    address?: string;
    powerType?: string;
    operatorName?: string;
    connectorType?: string;
    minPower?: number;
    maxPower?: number;
  }): Promise<Location[]> {
    const featureFlags = args.project.getFeatureFlags(
      configService.isProduction()
    );

    if (!isEmptyString(args.address) && isObjectEmpty(args.coordinates)) {
      const { addressOptions, error } = await getPotentialDestinations(
        { addressLine: args.address },
        null
      );

      const lat = addressOptions[0].lat;
      const lng = addressOptions[0].lng;

      if (error) {
        throw new RecommendationInternalServerError(
          'Sorry, there is an issue while attempting to locate the address or point of interest (POI) you entered. Please provide a different address or POI.'
        );
      }

      return await this.getAvailableNearbyLocations({
        lat,
        lng,
        timestamp: args.timestamp,
        powerType: args.powerType,
        operatorName: args.operatorName,
        connectorType: args.connectorType,
        minPower: args.minPower,
        maxPower: args.maxPower,
        featureFlags,
        dataSource: args.project.data_source,
      });
    } else {
      await this.checkIfCoordinateIsWithinScope(args.project, args.coordinates);
      return await this.getAvailableNearbyLocations({
        lat: args.coordinates.lat,
        lng: args.coordinates.lng,
        timestamp: args.timestamp,
        powerType: args.powerType,
        operatorName: args.operatorName,
        connectorType: args.connectorType,
        minPower: args.minPower,
        maxPower: args.maxPower,
        featureFlags,
        dataSource: args.project.data_source,
      });
    }
  }

  private async checkIfCoordinateIsWithinScope(
    project: ToolkitProject,
    coordinates: Coordinates
  ): Promise<void> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
      coordinates.lat
    },${
      coordinates.lng
    }&key=${configService.getGoogleApiToken()}&result_type=country`;
    try {
      const result = await firstValueFrom(
        this.http.get<any>(url).pipe(map(({ data }) => data))
      );
      if (isObjectEmpty(result) || result?.results.length < 1) {
        throw new RecommendationInternalServerError(
          'Sorry, there is an issue while attempting to locate the coordinates you entered. Please provide a different coordinates, address or POI.'
        );
      }

      const countryFilters = project.filters
        .filter(({ attribute }) => attribute === 'country')
        .map(({ value }) => value.toLowerCase());

      const countryCodeISO3 = OcpiCountryValue.create(
        result.results[0].address_components[0]?.short_name
      ).value.toLowerCase();

      if (!countryFilters.includes(countryCodeISO3)) {
        throw new RecommendationForbiddenRequestError(
          `Missing permission(s) to the following feature(s): Data access to country ${countryCodeISO3.toUpperCase()}. Please contact support@example.com for more information.`
        );
      }
    } catch (error) {
      console.log(
        getJSONLog(
          '',
          '',
          'Error getting address/POI/coordinates information:',
          error
        )
      );

      if (error instanceof RecommendationForbiddenRequestError) {
        throw error;
      }

      Sentry.captureException(error);
      throw new RecommendationInternalServerError(
        'Sorry, there is an issue while attempting to locate the coordinates you entered. Please provide a different coordinates, address or POI.'
      );
    }
  }

  private async getAvailableNearbyLocations(args: {
    lat: number;
    lng: number;
    timestamp: number;
    powerType?: string;
    operatorName?: string;
    connectorType?: string;
    minPower?: number;
    maxPower?: number;
    featureFlags: Record<string, boolean>;
    dataSource?: SUPPORTED_PEER_ID;
  }): Promise<Location[]> {
    const dateTime = new Date(args.timestamp);
    const requestedDateTimeWith5MinBuffer = new Date(
      new Date().getTime() - 5 * 60000
    );

    if (dateTime < requestedDateTimeWith5MinBuffer) {
      throw new RecommendationInternalServerError(
        'Request for charging in the past are not possible. Please try again with a valid, current date and time or a future date and time.'
      );
    }

    const chargingStations = await this.getLocations(args);

    const locations = await chooseAvailableLocations(
      chargingStations,
      dateTime,
      requestedDateTimeWith5MinBuffer
    );

    if (!locations?.length) {
      throw new RecommendationInternalServerError(
        'Sorry, there are no charging stations available near the specified location for the requested date and time. Please try again with a different date and time.'
      );
    }

    const results = {
      locations,
      nr_recommendations: locations.length,
    };

    const powerType = isEmptyString(args.powerType) ? 'both' : args.powerType;

    return labelAndScoreRecommendedChargingStations({
      locations: results.locations,
      language: 'en',
      powerType,
      minPower: args.minPower,
      maxPower: args.maxPower,
    });
  }

  private async getLocations(args: {
    lat: number;
    lng: number;
    timestamp?: number;
    powerType?: string;
    minPower?: number;
    maxPower?: number;
    connectorType?: string;
    operatorName?: string;
    featureFlags: Record<string, boolean>;
    dataSource?: SUPPORTED_PEER_ID;
  }): Promise<Location[]> {
    const locationsMap: Record<string, Location> = {};
    try {
      const locations = (await getNearestLocations(
        {
          latitude: args.lat,
          longitude: args.lng,
          powerType: args.powerType,
          operatorName: args.operatorName,
          connectorType: args.connectorType,
          minPower: args.minPower,
          maxPower: args.maxPower,
          isPowerTypeFallbackEnabled:
            args.featureFlags[
              'chargegpt_recommendations_power_type_fallback'
            ] ?? false,
          dataSource: args.dataSource,
        },
        getChargingStationSearchFunction(args.dataSource)
      )) as unknown as Location[];

      if (locations.length < 1) {
        throw new RecommendationInternalServerError(
          'Sorry, it appears that there are no charging stations found near the requested location. Please consider entering a different address, point of interest (POI), or coordinates in your next search.'
        );
      }

      locations.forEach(
        (location) => (locationsMap[location.locationId] = location)
      );
    } catch (error) {
      console.log(
        getJSONLog('', '', 'Error getting charging stations:', error)
      );
      throw error;
    }

    return Object.values(locationsMap);
  }

  async searchRoutingRecommendation(args: {
    project: ToolkitProject;
    originAddress?: string;
    destinationAddress?: string;
    originCoordinates?: Coordinates;
    destinationCoordinates?: Coordinates;
    distance?: number;
    maxSearchDistance?: number;
    routeNeed?: string;
  }): Promise<{
    chargingStations: Location[];
    navigationLink?: string;
  }> {
    const now = new Date();
    let destinationCoordinates: Coordinates;
    let originCoordinates: Coordinates;

    if (
      !isObjectEmpty(args.originCoordinates) &&
      !isObjectEmpty(args.destinationCoordinates)
    ) {
      originCoordinates = args.originCoordinates;
      destinationCoordinates = args.destinationCoordinates;
    } else {
      const { addressOptions: addressOptionsOrigin } =
        await getPotentialDestinations(
          {
            addressLine: args.originAddress,
          },
          null
        );
      originCoordinates = {
        lat: addressOptionsOrigin[0].lat,
        lng: addressOptionsOrigin[0].lng,
      };

      const { addressOptions: addressOptionsDestination } =
        await getPotentialDestinations(
          { addressLine: args.destinationAddress },
          null
        );
      destinationCoordinates = {
        lat: addressOptionsDestination[0].lat,
        lng: addressOptionsDestination[0].lng,
      };
    }

    const clonedHistory = new ConversationHistory({
      projectName: args.project.name,
      id: '1',
      clientTimestamp: Date.now(),
      timezoneOffset: -480,
      language: 'en',
      assistantName: 'Fronyx',
      companyName: 'Fronyx',
    });

    const { error, chargingStations, navigationLink } =
      await getRecommendedChargingStationsAlongRoute(
        args.project,
        clonedHistory,
        originCoordinates,
        destinationCoordinates,
        args.routeNeed
      );

    if (error) {
      throw new RecommendationInternalServerError(error.message);
    }

    return {
      chargingStations,
      navigationLink,
    };
  }
}

