import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChargingStation, LocationEntity, LocationFilter } from '../../../../../apps/cdk-apps/src/shared';

@Injectable()
export class CrawlingLocationsService {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly repo: Repository<LocationEntity>,
  ) {
  }

  async saveMany(args: {
    locations: ChargingStation[],
  }): Promise<void> {
    try {
      await this.repo.save(args.locations.map(val => LocationEntity.fromChargingStation(val)));
    } catch (err) {
      const message = `[CrawlingLocationsService.saveMany] ERROR caused by: ${err.message}, payload: ${JSON.stringify(args)}, stack: ${err.stack}`;
      console.error(message);
    }
  }

  async findByFilter_lean(args: { filters: LocationFilter[] }): Promise<any> {
    let queryBuilder = this.repo
      .createQueryBuilder('location')
      .select(['location.id', 'location.latitude', 'location.longitude']);

    (args.filters ?? []).forEach(({ attribute, value }, index) => {
      const operator = index === 0 ? 'where' : 'andWhere';
      queryBuilder = queryBuilder[operator](`location.${attribute} = :${attribute}`, { [attribute]: value });
    });

    return queryBuilder.getMany();
  }
}
