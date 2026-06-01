import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { configService } from '@fronyx/configurations';
import { firstValueFrom, map } from 'rxjs';
import { Coordinates, Location } from '../../models/prompt';
import * as Sentry from '@sentry/minimal';
import { AddressNotFoundError } from '../../models/address-search-error';

@Injectable()
export class GoogleApiService {
  constructor(private readonly http: HttpService) {}
  async getRouteLegs(
    originCoordinate: string,
    destinationCoordinate: string
  ): Promise<{
    legs: RouteLeg[];
  }> {
    let legs = [];
    const url = `https://maps.googleapis.com/maps/api/directions/json?destination=${destinationCoordinate}&origin=${originCoordinate}&key=${configService.getGoogleApiToken()}`;

    try {
      const results = await firstValueFrom(
        this.http.post<any>(url).pipe(map(({ data }) => data))
      );

      if (results && results.routes?.length > 0) {
        legs = results.routes[0].legs;
      }

      if (!legs || legs.length === 0) {
        throw new AddressNotFoundError('No legs found');
      }

      return { legs };
    } catch (err) {
      Sentry.captureException(err);
      throw new AddressNotFoundError(
        `Couldn't get route legs on URL ${url}: ${JSON.stringify(err)}`
      );
    }
  }
}

export const getNavigationLink = (
  originCoordinates: string,
  destinationCoordinates: string,
  chargingStops: Location[]
): string => {
  let waypoints = '';

  for (let i = 0; i < chargingStops.length; i++) {
    waypoints +=
      `${i > 0 ? '|' : ''}` +
      `${chargingStops[i].lat},${chargingStops[i].lng}`;
  }

  return `https://www.google.com/maps/dir/?api=1&origin=${originCoordinates}&destination=${destinationCoordinates}&waypoints=${waypoints}&travelmode=driving`;
};

export interface RouteLeg {
  distance: RouteValue;
  duration: RouteValue;
  end_address: string;
  end_location: Coordinates;
  start_address: string;
  start_location: Coordinates;
  steps: RouteLegStep[];
}

export interface RouteLegStep {
  distance: RouteValue;
  duration: RouteValue;
  end_location: Coordinates;
  start_location: Coordinates;
  travel_mode: string;
}

export interface RouteValue {
  text: string;
  value: number;
}

