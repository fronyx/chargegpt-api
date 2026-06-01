import { StatusLogKey } from '../../models/cache/status-log-key';
import { StatusLogCache } from '../../models/cache/status-log-cache';
import { OcpiStatusLog } from '../../domain/logging/update-create/models/ocpi-status-log';
import { isEmptyArray } from '../is-empty-array.function';

export async function saveStatusLogsInCache(args: {
  statusLogs: OcpiStatusLog[];
  cache: any;
}): Promise<void> {
  if (isEmptyArray(args.statusLogs)) {
    return;
  }

  const cacheValues = args.statusLogs.map(val => ({
    key: StatusLogKey.create({ locationId: val.location_id, uid: val.uid, }),
    value: StatusLogCache.create({ lastUpdated: val.last_updated, status: val.status }),
  }));

  for (let i = 0; i < cacheValues.length; i++) {
    const cacheValue = cacheValues[i];
    await args.cache.hSet(cacheValue.key.value, cacheValue.value.timestamp, cacheValue.value.status);
  }
}
