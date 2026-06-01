import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ToolkitScopedEvsesPrimaryIdsEntity,
  ToolkitScopedEvsesPrimaryIds
} from '../../../../../apps/cdk-apps/src/shared';
import { groupIntoChunk } from '../../../../../apps/cdk-apps/src/shared/utils/group-into-chunk';

@Injectable()
export class ToolkitScopedEvsesPrimaryIdsService {
  constructor(
    @InjectRepository(ToolkitScopedEvsesPrimaryIdsEntity)
    public readonly repo: Repository<ToolkitScopedEvsesPrimaryIdsEntity>,
  ) {
  }

  async saveMany(args: { scopedEvses: ToolkitScopedEvsesPrimaryIds[] }): Promise<void> {
    try {
      await this.repo.save(args.scopedEvses, { chunk: 100 });
    } catch {
      // NOOP
    }
  }

  async removeScopedEvsesByPrimaryIds(args: { primaryIds: string[]; }): Promise<void> {
    const chunks = groupIntoChunk({ data: args.primaryIds, chunkSize: 30000 });

    for (let i = 0; i < chunks.length; i++) {
      const primaryIds = chunks[i];
      await this.repo.delete(primaryIds);
    }
  }

  async removeScopedEvsesByLocationIds(args: { locationIds: string[]; }): Promise<void> {
    for (const locationId of args.locationIds) {
      await this.repo.delete({ location_id: locationId });
    }
  }

  async getAllScopedIds(isRealTime = false): Promise<ToolkitScopedEvsesPrimaryIdsEntity[]> {
    let query = this.repo
        .createQueryBuilder('evses')
        .select(['evses']);

    if (isRealTime) {
        query = query.where('evses.is_real_time = :isRealTime', { isRealTime });
    }
    const evses = await query.getMany();

    return evses;
  }

  async getAllPrimaryIds(isRealTime = false) {
    const evses = await this.getAllScopedIds(isRealTime);

    return evses.map(({ primary_id }) => ({ primary_id }));
  }

  async isLocationIdInScope(locationId: string): Promise<boolean> {
    const location = await this.repo.findOneBy({ location_id: locationId });

    return !!location;
  }
}
