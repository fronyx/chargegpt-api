import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CrawlingEvse, EvseEntity } from '../../../../../apps/cdk-apps/src/shared';

@Injectable()
export class CrawlingEvsesService {
  constructor(
    @InjectRepository(EvseEntity)
    private readonly repo: Repository<EvseEntity>,
  ) {
  }

  async findByIds(ids: string[]): Promise<CrawlingEvse[]> {
    const results = await this.repo.find({ where: { evse_id: In(ids) } });
    return results.map(val => val.toDto());
  }

  async updateStatus(args: CrawlingEvse): Promise<void> {
    try {
      await this.repo.update(
        { uid: args.uid },
        {
          status: args.status,
          last_updated: args.last_updated,
        });
    } catch (err) {
      const message = `[CrawlingEvsesService.updateStatus] ERROR caused by: ${err.message}, payload: ${JSON.stringify(args)}, stack: ${err.stack}`;
      console.error(message);
    }
  }

  async findByLocationId(args: { locationId: string; }): Promise<CrawlingEvse[]> {
    const results = await this.repo.find({ where: { location: { id: args.locationId } } });
    return results.map(val => val.toDto());
  }

  async findByLocationIds_lean(args: { ids: string[] }): Promise<any> {
    return this.repo
      .createQueryBuilder('evse')
      .leftJoinAndSelect('evse.location', 'location')
      .select(['evse.evse_id', 'location.id'])
      .where('evse.locationId IN(:...ids)', { ids: args.ids })
      .getMany();
  }
}
