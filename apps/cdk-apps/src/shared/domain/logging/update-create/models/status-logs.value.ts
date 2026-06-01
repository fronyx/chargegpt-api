import { Result } from '../../../../models/general/result';
import { OcpiStatusLog } from './ocpi-status-log';
import { UpdatedAtDateValue } from '../../../../models/general/updated-at-date.value';
import { validateSync } from 'class-validator';

export class StatusLogsValue {
  private readonly values: Result<OcpiStatusLog>[] = [];

  private constructor(values: any) {
    this.values = values;
  }

  get value(): OcpiStatusLog[] {
    return this.values
      .filter(val => val.isSuccess)
      .map(val => val.getValue());
  }

  static createFromOcpiLocation(args: { location: any }): StatusLogsValue {
    const logs = args.location.ocpi.evses.map((evse: any) =>
      OcpiStatusLog.create({
        evse_id: evse.evse_id,
        uid: evse.uid,
        status: evse.status,
        last_updated: UpdatedAtDateValue.create(args.location.updatedAt).toString(),
        location_id: args.location.ocpi.id,
      }),
    );

    const results: Result<OcpiStatusLog>[] = [];

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];

      const errors = validateSync(log);
      if (errors.length < 1) {
        results.push(Result.ok<OcpiStatusLog>(log));
      } else {
        const errorMessage = errors.map(({ constraints }) => JSON.stringify(constraints)).join(' ');
        results.push(Result.fail<OcpiStatusLog>(errorMessage));
      }
    }

    return new StatusLogsValue(results);
  }
}
