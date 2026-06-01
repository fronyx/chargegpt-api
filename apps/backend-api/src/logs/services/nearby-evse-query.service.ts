import { Injectable } from '@nestjs/common';
import {
  CachedAddressSearch,
  Coordinate,
  GoogleDistanceMatrixRow,
  NearbyEvse,
  PredictionsEvseDto
} from '@fronyx/data-transfer-object';
import { HttpService } from '@nestjs/axios';
import { configService } from '@fronyx/configurations';
import { CacheService } from '@fronyx/cache';

@Injectable()
export class NearbyEvseQueryService {
  private readonly distanceMatrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?key=${configService.getGoogleApiToken()}&mode=walking`;

  constructor(
    private readonly cache: CacheService,
    private readonly http: HttpService,
  ) {
  }

  async getNearbyEvses(origins: Coordinate): Promise<NearbyEvse[]> {
    const cachedData = await this.cache.get({
      key: CachedAddressSearch.getKey(origins),
    });

    if (cachedData) {
      const cachedAddress = new CachedAddressSearch(cachedData);
      return cachedAddress.evses;
    }

    const evsesInDortmund: PredictionsEvseDto[] = [];

    if (evsesInDortmund.length < 1) {
      return [];
    }

    const urls: string[] = evsesInDortmund.map(evse => {
      return `${this.distanceMatrixUrl}&destinations=${evse.coordinates.toString()}&origins=${origins.toString()}`;
    });

    const chunkSize = 20;
    const chunkedUrls = [];
    for (let i = 0; i < urls.length; i += chunkSize) {
      chunkedUrls.push(urls.slice(i, i + chunkSize));
    }

    const chunkedResults = [];
    for (let i = 0; i < chunkedUrls.length; i++) {
      const results = await Promise.all(chunkedUrls[i].map(url => this.http.axiosRef.get(url)));
      chunkedResults.push(
        results
          .map(({ data: { rows } }) => rows)
          .map(row => new GoogleDistanceMatrixRow(row)),
      );
    }

    const distances = chunkedResults.reduce((acc, val) => [].concat(acc, val), []);
    const nearbyEvses = distances
      .map((distance, index) => [distance, evsesInDortmund[index]])
      .filter(([distanceRow]) => distanceRow.distance <= 800)
      .map(([distanceRow, evseRow]) => new NearbyEvse({
        evse: evseRow.evse,
        location: evseRow.location,
        distance: distanceRow.distance,
      }));

    const cachedAddress = new CachedAddressSearch({
      latitude: origins.lat,
      longitude: origins.lng,
      evses: nearbyEvses,
    });

    await this.cache.set({
      key: cachedAddress.key,
      value: cachedAddress,
      ttl: 0,
    });

    return nearbyEvses;
  }
}
