import { OcpiLocation } from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-location';
import { OcpiStatusLog } from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-status-log';
import { isNull } from '../../../../cdk-apps/src/shared/utils/is-null.function';
import { getStatusLogsFromEvses } from './get-status-logs-from-evses.function';

export function getStatusLogsFromLocations(locations: OcpiLocation[] = []): OcpiStatusLog[] {
  return locations
    .filter(({ evses }) => {
      if (isNull(evses)) {
        return false;
      }

      if (!Array.isArray(evses)) {
        return false;
      }

      return evses.length > 0;
    })
    .map(location => getStatusLogsFromEvses(location.evses))
    .reduce((acc, val) => [].concat(acc, val), [])
    .filter(val => !isNull(val));
}
