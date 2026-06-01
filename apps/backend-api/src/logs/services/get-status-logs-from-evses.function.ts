import { isNull } from '../../../../cdk-apps/src/shared/utils/is-null.function';
import { EvseStatusValue, OcpiStatusLog, OcpiEvse } from '../../../../cdk-apps/src/shared';
import { UpdatedAtDateValue } from '../../../../cdk-apps/src/shared/models/general/updated-at-date.value';

export function getStatusLogsFromEvses(evses: OcpiEvse[] = []): OcpiStatusLog[] {
  const statusLogs = evses
    .filter(({ status }) => !isNull(status))
    .map(val => OcpiStatusLog.create({
      location_id: val.locationId,
      uid: val.uid,
      status: EvseStatusValue.create(val.status).value,
      last_updated: UpdatedAtDateValue.create(val.last_updated).toString(),
    }));

  return statusLogs.filter(val => !isNull(val));
}
