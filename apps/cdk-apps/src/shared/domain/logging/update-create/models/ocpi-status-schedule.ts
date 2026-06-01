import { isNull } from '../../../../utils/is-null.function';
import { UpdatedAtDateValue } from '../../../../models/general/updated-at-date.value';
import { isObjectEmpty } from '../../../../utils/is-object-empty.function';

export class OcpiStatusSchedule implements Readonly<OcpiStatusSchedule> {
  period_begin: Date | null;
  period_end: Date | null;
  status: string | null;

  private constructor(args: Partial<OcpiStatusSchedule>) {
    Object.assign(this, args);
  }

  static create(args: any): OcpiStatusSchedule | null {
    if (isNull(args)) {
      return null;
    }

    const payload: any = {
      period_begin: args.period_begin ? UpdatedAtDateValue.create(args.period_begin).value : null,
      period_end: args.period_end ? UpdatedAtDateValue.create(args.period_end).value : null,
      status: args.status,
    };

    if (isObjectEmpty(payload)) {
      return null;
    }

    return new OcpiStatusSchedule(payload);
  }

}
