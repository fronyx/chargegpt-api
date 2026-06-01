import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
import {
  EvseStatusValue,
  OcpiEvse,
  OcpiEvseEntity,
  OcpiEvsePrimaryIdValue,
  OcpiStatusLog,
} from '../../../../../apps/cdk-apps/src/shared';
import { groupIntoChunk } from '../../../../../apps/cdk-apps/src/shared/utils/group-into-chunk';
import { UpdatedAtDateValue } from '../../../../../apps/cdk-apps/src/shared/models/general/updated-at-date.value';
import { OcpiStatusLogsService } from './ocpi-status-logs.service';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { OcpiConnectorsService } from './ocpi-connectors.service';

interface EvseForReportGenerator extends EvseWithStatus {
  evse_id: string;
}

interface EvseWithStatus {
  uid: string;
  status: string;
  locationId: string;
}

interface EvseWithPowerType extends EvseWithStatus {
  connectors: {
    power_type: string;
    evsePrimaryId: string;
    power_kw: number;
    standard: string;
  }[];
  primary_id: string;
  evse_id: string;
}

@Injectable()
export class OcpiEvsesService {
  constructor(
    @InjectRepository(OcpiEvseEntity)
    public readonly repo: Repository<OcpiEvseEntity>,
    private readonly connectorsService: OcpiConnectorsService,
    private readonly statusLogsService: OcpiStatusLogsService,
  ) {
  }

  async findByIdsForReportGenerator(args: { ids: string[]; }): Promise<EvseForReportGenerator[]> {
    const results = await this.repo
      .createQueryBuilder('evse')
      .select(['evse.evse_id', 'evse.uid', 'evse.status'])
      .where('evse.evse_id IN(:...ids)', args)
      .getMany();

    return results;
  }

  async findEvseIdByPrimaryId(args: {
    locationId: string;
    uid: string;
  }): Promise<EvseForReportGenerator> {
    try {
      const primaryIdKey = OcpiEvsePrimaryIdValue.create(args);
      const results = await this.repo
        .createQueryBuilder('evse')
        .select(['evse.uid', 'evse.status', 'evse.evse_id'])
        .where('evse.primary_id = :primaryId', { primaryId: primaryIdKey.value })
        .getOne();

      return results;
    } catch (err) {
      console.log(`Invalid arguments: ${err.message}, arguments: ${JSON.stringify(args, null, 2)}`);
      throw err;
    }
  }

  async findByLocation(args: { locationId: string; }): Promise<OcpiEvse[]> {
    const evses = await this.repo.find({ where: { location: { id: args.locationId } } });
    return evses.map(val => new OcpiEvseEntity(val).toDto());
  }

  async findManyByPrimaryId(args: { primaryId: string; }): Promise<any> {
    return this.repo
      .createQueryBuilder('evse')
      .select(['evse.evse_id', 'evse.primary_id', 'evse.uid'])
      .where('evse.primary_id = :primaryId', args)
      .getRawMany()
      .then(results => results.map(val => ({
        evse_id: val.evse_evse_id,
        primary_id: val.evse_primary_id,
        uid: val.evse_uid,
      })));
  }

  async deleteByEvseId(args: { evseId: string; }): Promise<void> {
    await this.repo.delete({ evse_id: args.evseId });
  }

  async findPrimaryIdByEvseId(args: { evseId: string; }): Promise<any> {
    let result = this.repo
      .createQueryBuilder('evse')
      .select(['evse.evse_id', 'evse.primary_id'])
      .where('evse.evse_id = :evseId', args)
      .getOne();

    if (isObjectEmpty(result)) {
      result = this.repo
        .createQueryBuilder('evse')
        .select(['evse.evse_id', 'evse.primary_id'])
        .where('evse.evse_id_stripped = :evseIdStripped', { evseIdStripped: OcpiEvseEntity.cleanEvseId(args.evseId) })
        .getOne();
    }
    return result;
  }

  async findManyPrimaryIdsByEvseId(args: { evseIds: string[]; }): Promise<any> {
    return this.repo.find({
      select: ['evse_id', 'primary_id'],
      where: {
        evse_id: In(args.evseIds),
      },
      loadRelationIds: true,
    });
  }

  async findByUidAndLocationId(args: {
    uid: string;
    locationId: string;
  }): Promise<OcpiEvse> {
    const evse = await this.repo.findOne({
      where: { uid: args.uid, location: { id: args.locationId } },
      relations: ['connectors']
    });

    if (!evse) {
      return null;
    }

    return new OcpiEvseEntity(evse).toDto();
  }

  async findByLocationIds_lean(args: { ids: string[] }): Promise<any> {
    return this.repo
      .createQueryBuilder('evse')
      .leftJoinAndSelect('evse.location', 'location')
      .select(['evse.evse_id', 'location.id'])
      .where('evse.locationId IN(:...ids)', { ids: args.ids })
      .getMany();
  }

  async findStatusByPrimaryIdsForUtilisationRadarService(args: { primaryIds: string[]; }): Promise<EvseWithStatus[]> {
    const evses = this.repo
      .createQueryBuilder('evse')
      .select(['evse.uid', 'evse.status', 'evse.locationId'])
      .where('evse.primary_id IN(:...primaryIds)', args)
      .getMany();

    return evses as unknown as EvseWithStatus[];
  }

  async findPowerTypeForEvseForUtilisationRadarService(args: { primaryId: string; }): Promise<EvseWithPowerType> {
    const evse = await this.repo
      .createQueryBuilder('evse')
      .leftJoinAndSelect('evse.connectors', 'connectors')
      .select([
        'evse.primary_id',
        'evse.uid',
        'evse.status',
        'evse.evse_id',
        'evse.locationId',
        'connectors.evsePrimaryId',
        'connectors.power_type',
      ])
      .where('evse.primary_id = :primaryId', args)
      .getOne();

    return evse as unknown as EvseWithPowerType;
  }

  async findPowerTypesByEvsePrimaryIds(args: { primaryIds: string[]; }): Promise<EvseWithPowerType[]> {
    const query = await this.repo
      .createQueryBuilder('evse')
      .leftJoinAndSelect('evse.connectors', 'connectors')
      .select([
        'evse.primary_id',
        'evse.uid',
        'evse.status',
        'evse.evse_id',
        'evse.locationId',
        'connectors.evsePrimaryId',
        'connectors.power_type',
        'connectors.power_kw',
        'connectors.standard',
      ])
      .where('evse.primary_id IN(:...primaryIds)', args);

    try {
      const results = await query.getMany();
      return results as unknown as EvseWithPowerType[];
    } catch (err) {
      throw new Error(`Error querying power types: ${err.message}`);
    }
  }

  async save(args: OcpiEvse): Promise<void> {
    await this.repo.save(OcpiEvseEntity.toEntityFromCreateDto(args));
  }

  async saveMany(args: OcpiEvse[]): Promise<void> {
    const data = args.map(val => OcpiEvseEntity.toEntityFromCreateDto(val));
    const chunks = groupIntoChunk({ data, chunkSize: 5 });
    for (let i = 0; i < chunks.length; i++) {
      await this.repo.save(chunks[i]);
    }
  }

  async upsertMany(args: OcpiEvseEntity[]): Promise<void> {
    let isSuccessful = false, retryCount = 0;
    while (!isSuccessful && retryCount < 5) {
      retryCount++;

      try {
        await this.repo.upsert(args, { conflictPaths: ['primary_id'] });
        isSuccessful = true;
      } catch (err) {
        console.log('Failed saving evses to DB. Probabily because of the DB timeout issue. Retrying...');
        isSuccessful = false;
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));

        if (retryCount === 5) {
          console.error('Error upsert EVSES.');
          throw err;
        }
      }
    }

    const connectors = args.flatMap(({ connectors }) => connectors ?? []);
    await this.connectorsService.upsertMany(connectors);
  }

  async updateMany(args: { evses: OcpiEvse[]; }): Promise<{ affectedEvses: OcpiEvse[]; }> {
    const data = args.evses.map(val => OcpiEvseEntity.toEntityFromUpdateDto(val));
    const response = { affectedEvses: [] };

    for (let i = 0; i < data.length; i++) {
      const evse = data[i];
      const results = await this.repo.update({
        primary_id: evse.primary_id,
        last_updated: LessThan(evse.last_updated),
      }, evse);

      if (results.affected > 0) {
        response.affectedEvses.push(evse);
      }
    }

    return response;
  }

  async updateStatusAndCreateLogs(args: { evses: OcpiEvse[]; }): Promise<{ affectedEvses: OcpiEvse[]; }> {
    const data = args.evses.map(val => OcpiEvseEntity.toEntityFromUpdateDto(val));

    const logs = [];
    const response = { affectedEvses: [] };

    for (let i = 0; i < data.length; i++) {
      const evse = data[i];
      const results = await this.repo.update({
        primary_id: evse.primary_id,
        last_updated: LessThan(evse.last_updated),
      }, evse);

      if (results.affected > 0) {
        logs.push(OcpiStatusLog.create({
          location_id: evse.locationId,
          uid: evse.uid,
          evse_id: evse.evse_id,
          status: EvseStatusValue.create(evse.status).value,
          last_updated: UpdatedAtDateValue.create(evse.last_updated).toString(),
        }));
        response.affectedEvses.push(evse);
      }
    }

    if (logs.length > 0) {
      await this.statusLogsService.saveMany({ statusLogs: logs });
    }

    return response;
  }
}
