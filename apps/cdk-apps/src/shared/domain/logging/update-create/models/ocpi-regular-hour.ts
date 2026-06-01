import { isNull } from '../../../../utils/is-null.function';

export class OcpiRegularHour implements Readonly<OcpiRegularHour> {
  weekday: number;
  period_begin: string;
  period_end: string;

  private constructor(args: any) {
    Object.assign(this, args);
  }

  static create(args: any): OcpiRegularHour | null {
    const mandatoryFields = ['weekday', 'period_begin', 'period_end'];

    if (mandatoryFields.some(isNull)) {
      return null;
    }

    if (isNaN(args.weekday)) {
      return null;
    }

    const payload: any = {};
    Object.assign(payload, args);
    payload.weekday = Number(args.weekday);

    return new OcpiRegularHour(payload);
  }
}
