import { Injectable } from '@nestjs/common';
import {
  OcpiStatusLog,
} from '../../../../../apps/cdk-apps/src/shared';
import { TimestreamService } from '@fronyx/timestream';
import { groupIntoChunk } from '../../../../../apps/cdk-apps/src/shared/utils/group-into-chunk';
import { CacheService } from '@fronyx/cache';
import { EvseStatusCacheKey } from '../../../../../apps/cdk-apps/src/shared/models/cache/evse-status-cache-key';

@Injectable()
export class OcpiStatusLogsService {
  constructor(
    private readonly timestream: TimestreamService,
    private readonly cache: CacheService,
  ) {
  }

  async save(args: OcpiStatusLog): Promise<void> {
    try {
      await this.timestream.storeStatusLogs([args]);
    } catch (err) {
      console.error(`Error storing status log to timestream: ${JSON.stringify(err)}`);
    }
  }

  async saveMany(args: { statusLogs: OcpiStatusLog[]; }): Promise<void> {
    try {
      for (const logs of groupIntoChunk({
        data: args.statusLogs,
        chunkSize: 100,
      })) {
        await this.timestream.storeStatusLogs(logs);
      }

      for (const logs of args.statusLogs) {
        await this.cache.hSet(EvseStatusCacheKey.create({ locationId: logs.location_id }).value, logs.evse_primary_id, logs.status);
      }
    } catch (err) {
      console.error(`Error storing status logs to timestream: ${JSON.stringify(err)}`);
    }
  }

  async getLogsForPredictionsProcessing(primaryIds: string[]): Promise<OcpiStatusLog[]> {
    return this.timestream.getLogsForPredictionsProcessing(primaryIds.map(primary_id => ({ primary_id })));
  }

  async getLogsForLastMinute(): Promise<OcpiStatusLog[]> {
    return this.timestream.getLogsForLastMinute();
  }
}
