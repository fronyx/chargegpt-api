import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  LessThan,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  Brackets,
} from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { Location } from '../../../../../apps/cdk-apps/src/shared/models/general/models';
import { PaginatedResults } from '../../../../../apps/cdk-apps/src/shared/models/general/paginated-results.model';
import { groupIntoChunk } from '../../../../../apps/cdk-apps/src/shared/utils/group-into-chunk';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import {
  EvFreaksDuplicationLocationsByCoordinatesResponse,
  EVFreaksLocation,
  OcpiCoordinate,
  OcpiEntitiesPaginatedQueryParams,
  OcpiLocation,
  OcpiLocationEntity,
} from '../../../../../apps/cdk-apps/src/shared';
import { OcpiEvsesService } from './ocpi-evses.service';
import { generateUUID } from '../../../../../apps/cdk-apps/src/shared/models/general/generate-uuid';
import { writeFileSync } from 'fs';
import { ToolkitProject } from '@fronyx/toolkit';

interface GridCoordinates {
  topLeft: { lat: number; lng: number };
  topRight: { lat: number; lng: number };
  bottomLeft: { lat: number; lng: number };
  bottomRight: { lat: number; lng: number };
}

interface LocationWithCoordinates {
  id: string;
  latitude: number;
  longitude: number;
}

interface LocationWithEvseUid {
  id: string;
  evses: { uid: string }[];
}

interface LocationWithEvsePrimaryId {
  id: string;
  city: string;
  country: string;
  evses: {
    uid: string;
    evse_id: string;
    evse_id_stripped: string;
    primary_id: string;
    connectors: {
      power_type: string;
    }[];
  }[];
}

interface LocationForUtilisationRadar {
  id: string;
  latitude: number;
  longitude: number;
  evses: {
    uid: string;
    primary_id: string;
    locationId: string;
    status: string;
  }[];
}

@Injectable()
export class OcpiLocationsService {
  private readonly utilisationRadarServicelocationWithinGridCache: Record<string,
    LocationWithCoordinates[]> = {};
  private readonly evfreaksPollingLocationIdCache: Record<string, boolean> =
    {};
  private readonly evfreaksPollingLocationCoordinatesCache: Record<string,
    {
      lastUpdated: number;
      location: EvFreaksDuplicationLocationsByCoordinatesResponse;
    }> = {};

  constructor(
    @InjectRepository(OcpiLocationEntity)
    public readonly repo: Repository<OcpiLocationEntity>,
    private readonly evsesService: OcpiEvsesService,
  ) {
  }

  async saveEvFreaksLocation(args: { locations: EVFreaksLocation[] }): Promise<void> {
    const locations = args.locations.map(val => {
      return OcpiLocationEntity.fromEvfreaksPayload(val);
    });

    let isSuccessful = false, retryCount = 0;
    while (!isSuccessful && retryCount < 10) {
      retryCount++;

      try {
        await this.repo.upsert(locations, { conflictPaths: ['id'] });
        isSuccessful = true;
      } catch (err) {
        console.log('Failed saving locations to DB. Probabily because of the DB timeout issue. Retrying...');
        isSuccessful = false;
        await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));

        if (retryCount === 10) {
          console.error('Error upsert OcpiLocations.');
          throw err;
        }
      }
    }

    const evses = locations.flatMap(({ evses }) => evses ?? []);
    await this.evsesService.upsertMany(evses);
  }

  async updateEvfreaksLocation(args: {
    locations: EVFreaksLocation[];
  }): Promise<void> {
    const data = args.locations.map((val) => {
      return OcpiLocationEntity.fromEvfreaksPartialPayload(val);
    });

    const chunks = groupIntoChunk({ data, chunkSize: 5 });
    for (let i = 0; i < chunks.length; i++) {
      const locations = chunks[i];
      const requests = locations.map((location) => {
        return this.repo.update(
          {
            id: location.id,
            last_updated: LessThan(location.last_updated),
          },
          location
        );
      });

      await Promise.all(requests);
    }
  }

  async save(args: OcpiLocation): Promise<void> {
    await this.repo.save(OcpiLocationEntity.toEntityFromCreateDto(args));
  }

  async saveMany(args: OcpiLocation[]): Promise<void> {
    const data = args.map(val => OcpiLocationEntity.toEntityFromCreateDto(val));
    for (const location of data) {
      await this.repo.save(location);
    }
  }

  async upsertMany(args: OcpiLocation[]): Promise<void> {
    const data = args.map(val => OcpiLocationEntity.toEntityFromCreateDto(val));

    let isSuccessful = false, retryCount = 0;
    while (!isSuccessful && retryCount < 5) {
      retryCount++;

      try {
        await this.repo.upsert(data, { conflictPaths: ['id'] });
        isSuccessful = true;
      } catch (err) {
        console.log('Failed saving locations to DB. Probabily because of the DB timeout issue. Retrying...');
        isSuccessful = false;
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));

        if (retryCount === 5) {
          console.error('Error upsert OcpiLocations.');
          throw err;
        }
      }
    }

    const evses = data.flatMap(({ evses }) => evses ?? []);
    await this.evsesService.upsertMany(evses);
  }

  async update(args: OcpiLocation): Promise<void> {
    await this.repo.update({
      id: args.id,
      last_updated: LessThan(new Date(args.last_updated)),
    }, OcpiLocationEntity.toEntityFromUpdateDto(args));
  }

  async updateMany(args: { locations: OcpiLocation[] }): Promise<void> {
    const data = args.locations.map((val) =>
      OcpiLocationEntity.toEntityFromUpdateDto(val)
    );
    const chunks = groupIntoChunk({ data, chunkSize: 5 });
    for (let i = 0; i < chunks.length; i++) {
      const locations = chunks[i];
      const requests = locations.map((location) => {
        return this.repo.update(
          {
            id: location.id,
            last_updated: LessThan(location.last_updated),
          },
          location
        );
      });

      await Promise.all(requests);
    }
  }

  async findByCountry(args: {
    countryCode: string;
  }): Promise<OcpiLocation[]> {
    try {
      const results = await this.repo.find({ where: { country: args.countryCode } });

      return results.map((val) => new OcpiLocationEntity(val).toDto());
    } catch (err) {
      const message = `[OcpiLocationsService.findByCountry] ERROR caused by: ${
        err.message
      }, payload: ${JSON.stringify(args)}, stack: ${err.stack}`;
      console.error(message);
    }
  }

  async findEvseUidByLocationIdForPredictionsService(args: {
    locationId: string;
  }): Promise<LocationWithEvseUid> {
    const location = await this.repo
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.evses', 'evses')
      .select(['location.id', 'evses.uid'])
      .where('id = :locationId', args)
      .getOne();

    return location as unknown as LocationWithEvseUid;
  }

  async findLocationByCountry(args: {
    countryCode: string;
  }): Promise<LocationWithCoordinates[]> {
    const locations = await this.repo
      .createQueryBuilder('location')
      .select(['location.id', 'location.latitude', 'location.longitude'])
      .where('country = :countryCode', args)
      .getMany();

    return locations as unknown as LocationWithCoordinates[];
  }

  async findLocationsWithinGridForUtilisationRadarService(
    args: GridCoordinates
  ): Promise<LocationWithCoordinates[]> {
    const gridKey = `${args.topLeft.lat}_${args.topLeft.lng}_${args.topRight.lat}_${args.topRight.lng}_${args.bottomLeft.lat}_${args.bottomLeft.lng}_${args.bottomRight.lat}_${args.bottomRight.lng}`;

    if (
      this.utilisationRadarServicelocationWithinGridCache[gridKey] ===
      undefined
    ) {
      const locations = await this.repo
        .createQueryBuilder('location')
        .select([
          'location.id',
          'location.latitude',
          'location.longitude',
        ])
        .where('latitude <= :topLeftLatitude', {
          topLeftLatitude: args.topLeft.lat,
        })
        .andWhere('latitude >= :bottomRightLatitude', {
          bottomRightLatitude: args.bottomRight.lat,
        })
        .andWhere('longitude >= :topLeftLongitude', {
          topLeftLongitude: args.topLeft.lng,
        })
        .andWhere('longitude <= :topRightLongitude', {
          topRightLongitude: args.topRight.lng,
        })
        .getMany();

      this.utilisationRadarServicelocationWithinGridCache[gridKey] =
        locations as unknown as LocationWithCoordinates[];
    }

    return this.utilisationRadarServicelocationWithinGridCache[gridKey];
  }

  async findByIdForLocationPolling(args: {
    locationId: string;
  }): Promise<boolean> {
    if (
      this.evfreaksPollingLocationIdCache[args.locationId] === undefined
    ) {
      const location = await this.repo
        .createQueryBuilder('location')
        .select(['location.id'])
        .where('id = :locationId', args)
        .getOne();

      this.evfreaksPollingLocationIdCache[args.locationId] = !!location;
    }

    return this.evfreaksPollingLocationIdCache[args.locationId];
  }

  async findById(id: string): Promise<OcpiLocation> {
    const location = await this.repo.findOne({ where: { id }, relations: ['evses', 'evses.connectors'] });

    if (!location) {
      return null;
    }

    return new OcpiLocationEntity(location).toDto();
  }

  async loadAllLocationsWithStatusAndPowerType(): Promise<any> {
    const query = this.repo
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.evses', 'evses')
      .leftJoinAndSelect('evses.connectors', 'connectors')
      .select(['location.id', 'location.id_stripped', 'location.latitude', 'location.longitude', 'location.operator_name', 'location.frk_operator_name', 'location.owner_name', 'location.suboperator_name', 'evses.primary_id',
        'evses.uid',
        'evses.status',
        'connectors.power_type',]);

    const locations = await query.getMany();
    return locations;
  }

  async loadAllLocationsWithOperatorName(): Promise<any> {
    const query = this.repo
      .createQueryBuilder('location')
      .select(['location.id', 'location.operator_name', 'location.frk_operator_name']);

    const locations = await query.getMany();
    return locations;
  }

  async generateLocationsFileWithPowerTypes(): Promise<void> {
    const locations = await this.loadAllLocationsWithStatusAndPowerType();
    const locationsWithPowerType = locations.map(location => {
      return {
        id: location.id,
        id_stripped: location.id_stripped,
        latitude: location.latitude,
        longitude: location.longitude,
        power_type: Object.keys(location.evses
          .map(({ connectors }) => connectors)
          .reduce((acc, val) => [].concat(acc, val), [])
          .reduce((acc, { power_type }) => {
            acc[power_type] = true;
            return acc;
          }, {})),
      };
    });

    writeFileSync('./locations', JSON.stringify(locationsWithPowerType));
  }

  async findLocationCityById(locationId: string): Promise<string> {
    const location = await this.repo
      .createQueryBuilder('location')
      .select(['location.id', 'location.city'])
      .where('id = :locationId', { locationId })
      .getOneOrFail();

    return location.city;
  }

  async findByIdRaw(id: string): Promise<any> {
    return this.repo.findOne({ where: { id }, relations: ['evses', 'evses.connectors'] });
  }

  async findOcpiPaginated(args: OcpiEntitiesPaginatedQueryParams): Promise<{
    count: number;
    locations: OcpiLocation[];
  }> {
    const whereParams: any = {
      country: 'DEU',
    };

    if (args.getDateFrom() !== null && args.getDateTo() !== null) {
      whereParams.last_updated = Between(
        args.getDateFrom(),
        args.getDateTo()
      );
    } else {
      if (args.getDateFrom() !== null) {
        whereParams.last_updated = MoreThanOrEqual(args.getDateFrom());
      }

      if (args.getDateTo() !== null) {
        whereParams.last_updated = LessThanOrEqual(args.getDateTo());
      }
    }

    const [results, total] = await this.repo.findAndCount({
      where: whereParams,
      take: args.limit,
      skip: args.offset,
    });

    return {
      count: total,
      locations: results.map((val) =>
        new OcpiLocationEntity(val).toDto()
      ),
    };
  }

  async findPaginated_lean(args: {
    limit: number;
    page: number;
    queryBuilder: SelectQueryBuilder<any>;
  }): Promise<PaginatedResults<any>> {
    const page = args.page ?? 1;
    const limit = args.limit ?? 200;
    const pageIndex = page - 1;
    const offset = pageIndex * limit;

    const queryBuilder = args.queryBuilder.take(limit).skip(offset);

    const [results, totalCount] = await queryBuilder.getManyAndCount();

    const lastPage = Math.round(totalCount / limit);

    return {
      results,
      count: results.length,
      totalCount,
      currentPage: page,
      nextPage: page + (page + 1 >= lastPage ? 0 : 1),
      prevPage: Math.max(1, page - 1),
      lastPage,
    };
  }

  getQueryBuilder(): SelectQueryBuilder<any> {
    return this.repo
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.evses', 'evses')
      .leftJoinAndSelect('evses.connectors', 'connectors')
      .select([
        'location.id',
        'location.latitude',
        'location.longitude',
        'location.country',
        'location.postal_code',
        'location.city',
        'location.address',
        'location.last_updated',
      ]);
  }

  buildQueryBuilder(args: {
    projects: ToolkitProject[];
  }): SelectQueryBuilder<any> {
    const queryBuilder = this.getQueryBuilder();

    args.projects.forEach((project, projectIndex) => {
      const projectConditionOperator =
        projectIndex === 0 ? 'where' : 'orWhere';
      const filters = project?.filters ?? [];

      const powerTypesFilters = filters.filter(
        ({ attribute }) => attribute === 'power_type'
      );
      const countryFilters = filters.filter(
        ({ attribute }) => attribute === 'country'
      );
      const cityFilters = filters.filter(
        ({ attribute }) => attribute === 'city'
      );

      const sortedFilters = [
        {
          repo: 'connectors',
          attribute: 'power_type',
          values: Object.keys(
            powerTypesFilters
              .map(({ value }) => value)
              .reduce((acc, val) => {
                acc[val] = true;
                return acc;
              }, {})
          ),
        },
        {
          repo: 'location',
          attribute: 'country',
          values: Object.keys(
            countryFilters
              .map(({ value }) => value)
              .reduce((acc, val) => {
                acc[val] = true;
                return acc;
              }, {})
          ),
        },
        {
          repo: 'location',
          attribute: 'city',
          values: Object.keys(
            cityFilters
              .map(({ value }) => value)
              .reduce((acc, val) => {
                acc[val] = true;
                return acc;
              }, {})
          ),
        },
      ].filter(({ values }) => values.length > 0);

      queryBuilder[projectConditionOperator](
        new Brackets((attributeQb) => {
          sortedFilters.forEach((filter) => {
            attributeQb.andWhere(
              new Brackets((valQb) => {
                filter.values.forEach((value, subIndex) => {
                  const subOperator =
                    subIndex === 0 ? 'where' : 'orWhere';

                  const key = `${filter.attribute}_${generateUUID().replace(/-/g, '_')}`;

                  valQb[subOperator](
                    `${filter.repo}.${filter.attribute} = :${key}`,
                    { [key]: value }
                  );
                });
              })
            );
          });
        })
      );
    });

    return queryBuilder;
  }

  async isLocationExistsOnCoordinates(args: {
    coordinates: OcpiCoordinate;
  }): Promise<EvFreaksDuplicationLocationsByCoordinatesResponse> {
    const coordinateKey = `${args.coordinates.latitude}_${args.coordinates.longitude}`;

    const isOldCache =
      (Date.now() -
        (this.evfreaksPollingLocationCoordinatesCache[coordinateKey]
          ?.lastUpdated ?? Date.now())) /
      1000 >=
      30;

    if (this.evfreaksPollingLocationCoordinatesCache[coordinateKey] === undefined
      || isOldCache) {
      const location = await this.repo.findOne({
        where: {
          latitude: Number(args.coordinates.latitude),
          longitude: Number(args.coordinates.longitude)
        }
      });

      this.evfreaksPollingLocationCoordinatesCache[coordinateKey] = {
        lastUpdated: Date.now(),
        location: new EvFreaksDuplicationLocationsByCoordinatesResponse(
          {
            locationId: location?.id,
            coordinates: args.coordinates,
            isDuplicated:
              !!location && isEmptyString(location?.frk_peer_id),
            peerID: location?.frk_peer_id,
          }
        ),
      };
    }

    return this.evfreaksPollingLocationCoordinatesCache[coordinateKey]
      .location;
  }

  async findLocationEvsesForUtilisationRadarService(args: {
    locationId: string;
  }): Promise<LocationForUtilisationRadar> {
    const queryBuilder = this.repo
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.evses', 'evses')
      .select([
        'location.id',
        'location.latitude',
        'location.longitude',
        'evses.uid',
        'evses.status',
        'evses.primary_id',
        'evses.last_updated',
        'evses.locationId',
      ])
      .where('id = :locationId', args);

    const location = await queryBuilder.getOne();
    return location;
  }

  async findLocationsEvsesConnectorsByLocationId(args: { locationIds: string[]; }): Promise<any[]> {
    const query = this.repo
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.evses', 'evses')
      .leftJoinAndSelect('evses.connectors', 'connectors')
      .select([
        'location.id',
        'location.id_stripped',
        'location.latitude',
        'location.longitude',
        'location.operator_name',
        'location.frk_operator_name',
        'evses.primary_id',
        'evses.uid',
        'evses.status',
        'connectors.power_type',
      ])
      .where('location.id IN(:...locationIds)', args);

    const locations = await query.getMany();
    return locations;
  }

  async findOcpiRequiredValueByProjects(args: {
    projects: ToolkitProject[];
    page: number;
    limit: number;
  }): Promise<PaginatedResults<Location>> {
    let queryBuilder = this.buildQueryBuilder({ projects: args.projects });
    queryBuilder = queryBuilder.select([
      'location.id',
      'location.latitude',
      'location.longitude',
      'location.country',
      'location.postal_code',
      'location.city',
      'location.address',
      'location.last_updated',
      'evses.uid',
      'evses.evse_id',
      'evses.status',
      'evses.primary_id',
      'evses.last_updated',
      'connectors.evsePrimaryId',
      'connectors.id',
      'connectors.standard',
      'connectors.format',
      'connectors.power_type',
      'connectors.voltage',
      'connectors.amperage',
      'connectors.last_updated',
    ]);

    return this.findPaginated_lean({
      queryBuilder,
      limit: args.limit,
      page: args.page,
    });
  }

  async findOcpiLocationsByProjects(args: {
    projects: ToolkitProject[];
  }): Promise<LocationWithEvsePrimaryId[]> {
    const query = this.buildQueryBuilder(args).select([
      'location.id',
      'location.city',
      'location.country',
      'evses.uid',
      'evses.evse_id',
      'evses.primary_id',
      'evses.evse_id_stripped',
      'connectors.power_type',
    ]);

    try {
      const results = query.getMany();
      return results as unknown as LocationWithEvsePrimaryId[];
    } catch (err) {
      throw new Error(
        `Find ocpi locations by filters error: ${err.message}`
      );
    }
  }

  async findLocationsWithEVFreaksIdFormat(): Promise<{ id: string; evses: { uid: string }[] }[]> {
    const results = await this.repo
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.evses', 'evses')
      .select(['location.id', 'evses.uid'])
      .where('id LIKE :id', { id: '5e5d%' })
      .getMany();

    return results;
  }

  async deleteLocationsById(ids: string[] = []): Promise<void> {
    await this.repo.delete(ids);
  }

  async findAllLocationIdsFromOCPI(): Promise<{ id: string }[]> {
    const location = await this.repo
      .createQueryBuilder('location')
      .select(['location.id'])
      .where('frk_peer_id is NULL')
      .getMany();
    return location;
  }

  async findAllLocationsWithPeerIdAndCoordinates(): Promise<{ id: string; latitude: number; longitude: number; frk_peer_id: string; }[]> {
    const query = this.repo
        .createQueryBuilder('location')
        .leftJoinAndSelect('location.evses', 'evses')
        .leftJoinAndSelect('evses.connectors', 'connectors')
        .select(['location.id', 'location.latitude', 'location.longitude', 'location.frk_peer_id']);
  
      const locations = await query.getMany();
      return locations;
  }

  async fillInMissingStrippedId(): Promise<void> {
    const results = await this.repo
      .createQueryBuilder('location')
      .select(['location.id', 'location.last_updated', 'location.id_stripped'])
      .where('id_stripped IS NULL')
      .getMany();

    const locations = results.map((location) =>
      OcpiLocationEntity.toEntityFromUpdateDto({
        id: location.id,
        last_updated: new Date(location.last_updated).toISOString(),
      }),
    );

    const chunks = groupIntoChunk({ data: locations, chunkSize: 50 });
    let index = 0;
    for (const chunk of chunks) {
      console.log(`[${Date.now()}] Filling in id stripped for chunk ${index + 1}...`);
      await this.repo.upsert(chunk, { conflictPaths: ['id'] });
      index++;
    }
  }
}
