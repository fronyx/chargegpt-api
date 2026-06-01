import { OcpiRegularHour } from './ocpi-regular-hour';
import { OcpiExceptionalPeriod } from './ocpi-exceptional-period';
import { isNull } from '../../../../utils/is-null.function';
import { isObjectEmpty } from '../../../../utils/is-object-empty.function';

export class OcpiHour implements Readonly<OcpiHour> {
  regular_hours: OcpiRegularHour[] = [];
  twentyfourseven: boolean;
  exceptional_openings: OcpiExceptionalPeriod[] = [];
  exceptional_closings: OcpiExceptionalPeriod[] = [];

  private constructor(args: Partial<OcpiHour>) {
    Object.assign(this, args);
  }

  static create(args: any) {
    if (isNull(args)) {
      return null;
    }

    const payload: any = {};
    payload.twentyfourseven = args.twentyfourseven;
    payload.regular_hours = (args.regular_hours ?? []).map((val: any) => OcpiRegularHour.create(val)).filter((val: any) => val !== null);
    payload.exceptional_openings = (args.exceptional_openings ?? []).map((val: any) => OcpiExceptionalPeriod.create(val)).filter((val: any) => val !== null);
    payload.exceptional_closings = (args.exceptional_closings ?? []).map((val: any) => OcpiExceptionalPeriod.create(val)).filter((val: any) => val !== null);

    if (isObjectEmpty(payload)) {
      return null;
    }

    return new OcpiHour(payload);
  }
}
