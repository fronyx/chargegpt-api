import { CacheService } from '@fronyx/cache';
import { OcpiEvsesService } from '@fronyx/persistence';

import { Injectable } from '@nestjs/common';
import {
  DuplicatedEvseError,
  OcpiEvse,
  OcpiEvseEntity,
  OcpiLocation
} from '../../../../../../apps/cdk-apps/src/shared';

@Injectable()
export class EvseDictionaryService {
  private dict: EvseIdDictionary;

  constructor(
    private readonly cache: CacheService,
    private readonly evsesService: OcpiEvsesService,
  ) {
    this.dict = new EvseIdDictionary(this.cache);
  }

  async getPrimaryIds(evseId: string): Promise<string[]> {
    let primaryIds = await this.dict.getPrimaryIdByEvseId({ evseId });

    if (primaryIds.length < 1) {
      const evse = await this.evsesService.findPrimaryIdByEvseId({ evseId });

      if (evse) {
        primaryIds = [evse.primary_id];
        this.addPrimaryIdFromEvses({ evses: [evse] });
      }
    }

    return primaryIds;
  }

  async addPrimaryFromLocations(args: { locations: OcpiLocation[] }): Promise<void> {
    const evses = args.locations.map((location) => location.evses)
      .reduce((acc, val) => [].concat(acc, val), []);

    await this.addPrimaryIdFromEvses({ evses });
  }

  async addPrimaryIdFromEvses(args: { evses: OcpiEvse[] }): Promise<void> {
    const dictionaryEvseIdToPrimaryId = new EvseIdDictionary(this.cache);
    await dictionaryEvseIdToPrimaryId.addPrimaryId(args);
  }
}

class EvseIdDictionary {
  private readonly prefix = 'dictionary:';
  private cache: CacheService;


  constructor(cacheService: CacheService) {
    this.cache = cacheService;
  }

  private getKey(type: string): string {
    return `${this.prefix}:${type}`;
  }

  async addPrimaryId(args: { evses: OcpiEvse[] }): Promise<void> {
    for (const evse of args.evses) {
      const evseId = evse.evse_id;
      const primaryId = evse.primary_id;
      const evseIdStripped = OcpiEvseEntity.cleanEvseId(evse.evse_id);

      await this.cache.sAdd(this.getKey(`evse_id_to_primary_id:${evseId}`), primaryId);
      await this.cache.sAdd(this.getKey(`evse_id_stripped_to_primary_id:${evseIdStripped}`), primaryId);
    }
  }

  async getPrimaryIdByEvseId(args: { evseId: string; }): Promise<string[]> {
    let primaryIds = [];

    try {
      primaryIds = await this.cache.sMembers({ key: this.getKey(`evse_id_to_primary_id:${args.evseId}`) });

      if (primaryIds.length < 1) {
        const evseIdStripped = OcpiEvseEntity.cleanEvseId(args.evseId);
        primaryIds = await this.cache.sMembers({ key: this.getKey(`evse_id_stripped_to_primary_id:${evseIdStripped}`) });
      }

      return primaryIds;
    } catch (err) {
      console.error('Error getting primary id by evse id:');
      console.error(err);
      throw new DuplicatedEvseError(args.evseId);
    }
  }
}
