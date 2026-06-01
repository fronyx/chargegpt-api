import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cpo, OcpiCpoEntity } from '../../../../../apps/cdk-apps/src/shared';

@Injectable()
export class OcpiCposService {
  private readonly thirtyMinutes = 60 * 30 * 1000;
  private cacheRequest = {
    lastUpdated: null,
    data: [],
  };

  constructor(
    @InjectRepository(OcpiCpoEntity)
    private readonly repo: Repository<OcpiCpoEntity>,
  ) {
  }

  async save(args: Cpo): Promise<Cpo> {
    const entity = await this.repo.save(OcpiCpoEntity.toEntity(args));
    return new OcpiCpoEntity(entity).toDto();
  }

  async findById(id: string): Promise<Cpo> {
    const entity = await this.repo.findOne({ where: { party_id: id } });
    return new OcpiCpoEntity(entity).toDto();
  }

  async findByTokenB(token: string): Promise<Cpo> {
    const entity = await this.repo.findOne({ where: { token_b: token } })
    return new OcpiCpoEntity(entity).toDto();
  }

  async findAll(): Promise<Cpo[]> {
    if (this.cacheRequest.lastUpdated === null || (Date.now() - this.cacheRequest.lastUpdated) >= this.thirtyMinutes) {
      const results = await this.repo.find({});
      this.cacheRequest.data = results.map(val => new OcpiCpoEntity(val).toDto());
    }

    return this.cacheRequest.data;
  }

  async findByPartyId(args: { partyId: string; }): Promise<Cpo> {
    const cpos = await this.findAll();
    return cpos.find(({ party_id }) => party_id === args.partyId);
  }

  async findAllActive(): Promise<any> {
    const query = this.repo
    .createQueryBuilder('cpo')
    .select(['cpo.token', 'cpo.locations_url', 'cpo.versions_url', 'cpo.party_id'])
    .where(`cpo.is_sending_active = :isActive`, { isActive: true });
    return query.getMany();
  }
}
