import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
import {
  EVSEPowerType,
  OcpiConnector, OcpiConnectorEntity, OcpiConnectorPrimaryId
} from '../../../../../apps/cdk-apps/src/shared';
import { groupIntoChunk } from '../../../../../apps/cdk-apps/src/shared/utils/group-into-chunk';

@Injectable()
export class OcpiConnectorsService {
  constructor(
    @InjectRepository(OcpiConnectorEntity)
    private readonly repo: Repository<OcpiConnectorEntity>,
  ) {
  }

  async updateEvsePrimaryIdByConnectorPrimaryId(args: { connectorPrimaryId: string; evsePrimaryId: string; }): Promise<void> {
    await this.repo.update({ primary_id: args.connectorPrimaryId }, { evsePrimaryId: args.evsePrimaryId });
  }

  async findPowerTypes(args: { evsePrimaryIds: string[]; }): Promise<EVSEPowerType[]> {
    return this.repo.find({
      select: ['power_type', 'evse'],
      where: {
        evse: In(args.evsePrimaryIds),
      },
      loadRelationIds: true,
    }) as any;
  }

  async findByIdAndEvse(args: { id: string, evseId: string }): Promise<OcpiConnector> {
    try {
      const connector = await this.repo.findOne({ where: { id: args.id, evse: { evse_id: args.evseId } } });

      if (!connector) {
        return null;
      }

      return new OcpiConnectorEntity(connector).toDto();
    } catch (err) {
      const message = `[OcpiConnectorsService.findByIdAndEvse] ERROR caused by: ${err.message}, payload: ${JSON.stringify(args)}, stack: ${err.stack}`;
      console.error(message);
    }
  }

  async findByUidAndEvse(args: { id: string, evseUID: string }): Promise<OcpiConnector> {
    try {
      const connector = await this.repo.findOne({
        where: { id: args.id, evse: { uid: args.evseUID } },
        relations: ['evse']
      });

      if (!connector) {
        return null;
      }

      return new OcpiConnectorEntity(connector).toDto();
    } catch (err) {
      const message = `[OcpiConnectorsService.findByUidAndEvse] ERROR caused by: ${err.message}, payload: ${JSON.stringify(args)}, stack: ${err.stack}`;
      console.error(message);
    }
  }

  async getConnector(args: { primaryId: OcpiConnectorPrimaryId }): Promise<OcpiConnector> {
    const connector = await this.repo.findOne({ where: { primary_id: args.primaryId.value } });

    if (connector === undefined) {
      return null;
    }

    return new OcpiConnectorEntity(connector).toDto();
  }

  async saveMany(args: OcpiConnector[]): Promise<void> {
    const data = args.map(val => OcpiConnectorEntity.toEntity(OcpiConnector.createFromCreatePayload(val)));
    const chunks = groupIntoChunk({ data, chunkSize: 5 });
    for (let i = 0; i < chunks.length; i++) {
      await this.repo.save(chunks[i]);
    }
  }

  async upsertMany(args: OcpiConnectorEntity[]): Promise<void> {
    let isSuccessful = false, retryCount = 0;
    while (!isSuccessful && retryCount < 5) {
      retryCount++;

      try {
        await this.repo.upsert(args, { conflictPaths: ['primary_id'] });
        isSuccessful = true;
      } catch (err) {
        console.log('Failed saving connectors to DB. Probabily because of the DB timeout issue. Retrying...');
        isSuccessful = false;
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));

        if (retryCount === 5) {
          console.error('Error upsert OcpiConnectors.');
          throw err;
        }
      }
    }
  }

  async save(args: OcpiConnector): Promise<void> {
    await this.repo.save(OcpiConnectorEntity.toEntity(OcpiConnector.createFromCreatePayload(args)));
  }

  async deleteByPrimaryId(args: { primaryId: OcpiConnectorPrimaryId }): Promise<void> {
    await this.repo.delete({ primary_id: args.primaryId.value });
  }

  async updateMany(args: { connectors: OcpiConnector[]; }): Promise<void> {
    const data = args.connectors.map(val => OcpiConnectorEntity.toEntity(OcpiConnector.createFromUpdatePayload(val)));
    const chunks = groupIntoChunk({ data, chunkSize: 5 });
    for (let i = 0; i < chunks.length; i++) {
      const connectors = chunks[i];
      const requests = connectors.map(connector => {
        return this.repo.update({
          id: connector.id,
          last_updated: LessThan(connector.last_updated),
        }, connector);
      });
      await Promise.all(requests);
    }
  }

  async findAllConnectorsWithExpandedEvse(): Promise<any> {
    return this.repo.find({
      select: ['evse', 'id'],
      where: {
        last_updated: null,
      },
      loadRelationIds: true,
    });
  }
}
