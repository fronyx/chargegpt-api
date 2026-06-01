import { Injectable } from '@nestjs/common';
import { alpha3to2Map } from '@fronyx/data-transfer-object';
import { Location } from '../../../../../apps/cdk-apps/src/shared/models/general/models';
import { OcpiLocationsService } from './ocpi-locations.service';
import {
  IsValidLocationResult,
  LocationValue, OcpiLocation, OcpiLocationEntity
} from '../../../../../apps/cdk-apps/src/shared';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { PaginatedResults } from '../../../../../apps/cdk-apps/src/shared/models/general/paginated-results.model';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface RawLocation {
  id: string;
  coordinates: Coordinates;
  evseIds: string[];
}

enum ProjectDataSource {
  NeutralPartner = 'NeutralPartner',
  OCPI = 'ocpi',
}

@Injectable()
export class PredictionsLocationService {
  constructor(
    private readonly ocpiLocationsService: OcpiLocationsService,
  ) {
  }

  async getLocationsByProject(args: { project: any, page?: number; }): Promise<RawLocation[]> {
    if (args.project.data_source === ProjectDataSource.NeutralPartner) {
      const limit = 100;
      let offset = 0;
      const query = `${this.getQueryFromProject(args)} LIMIT ${limit}`;

      let locations = [];
      let isNextPageAvailable = true;
      do {
        const paginatedQuery = `${query} OFFSET ${offset}`;
        const rawData = await this.ocpiLocationsService.repo.manager.connection.query(paginatedQuery);
        const parsedLocations = this.parseRawData({ rawData });
        locations = [].concat(locations, parsedLocations);
        offset += limit;

        isNextPageAvailable = !!parsedLocations.length;
      } while (isNextPageAvailable)

      return locations;
    }

    return await this.retrieveLocationsFromOcpi(args) as any;
  }

  private async retrieveLocationsFromOcpi(args: { project: any; page?: number; }): Promise<PaginatedResults<Location>> {
    const limit = 200;
    return await this.ocpiLocationsService.findOcpiRequiredValueByProjects({
      page: args.page ?? 1,
      limit,
      projects: [args.project],
    });
  }

  private getQueryFromProject(args: { project: any }): string {
    const filters: string[] = [];
    args.project.filters.forEach(({ attribute, value }: any) => {
      if (attribute === 'country') {
        filters.push(`evse.country = '${this.getCountryId({ dataSource: args.project.data_source, value })}'`);
      }

      if (attribute === 'city') {
        filters.push(`evse.city = '${value}'`);
      }
    });
    const sqlQuery = `SELECT evse.evse AS       evse_id,
                             evse.station_id AS location_id,
                             evse.latitude AS   latitude,
                             evse.longitude AS  longitude
                      FROM evse evse
                      WHERE ${filters.join(' AND ')}`;

    return sqlQuery;
  }

  private getCountryId(args: {
    dataSource: string;
    value: string;
  }): string {
    if (args.dataSource === 'ocpi') {
      return args.value;
    } else {
      return alpha3to2Map[args.value];
    }
  }

  // TODO update return format from RawLocation into ../../../../../apps/cdk-apps/lib/scope-api-token-to-locations/models/models/Location
  private parseRawData(args: { rawData: any }): RawLocation[] {
    return Object.values(
      args.rawData.reduce((acc: any, val: any) => {
        acc[val.location_id] = acc[val.location_id] ?? [];
        acc[val.location_id].push(val);
        return acc;
      }, {}),
    )
      .map((evses: any) => {
        const location: any = {
          id: null,
          coordinates: {
            latitude: 0,
            longitude: 0,
          },
          evseIds: [],
        };
        evses.forEach(({ location_id, latitude, longitude, evse_id }: any) => {
          location.evseIds.push(evse_id);
          location.id = location_id;
          location.coordinates.latitude = latitude;
          location.coordinates.longitude = longitude;
        });
        return location;
      }) ?? [];
  }

  async getPaginatedOcpiLocations(args: {
    limit: number;
    page: number;
  }): Promise<PaginatedResults<OcpiLocation>> {
    let page = 1;
    if (!isEmptyString(args.page as any)) {
      page = Number(args.page);
    }

    let limit = 200;
    if (!isEmptyString(args.limit as any)) {
      limit = Number(args.limit);
    }
    const pageIndex = page - 1;
    const offset = (pageIndex * limit);

    const [results, totalCount] = await this.ocpiLocationsService.repo.findAndCount({
      take: limit,
      skip: offset,
    });

    const lastPage = Math.round(totalCount / limit);

    return {
      results: results.map(val => new OcpiLocationEntity(val).toDto()),
      count: results.length,
      totalCount,
      currentPage: page,
      nextPage: page + (page + 1 >= lastPage ? 0 : 1),
      prevPage: Math.max(1, page - 1),
      lastPage,
    }
  }

  async isValidLocation(args: { locationId: string; }): Promise<IsValidLocationResult> {
    const location = await this.ocpiLocationsService.findByIdRaw(args.locationId);

    const locationValue = LocationValue.create(location).value;

    return {
      isValid: !!locationValue,
      location,
    }
  }
}

