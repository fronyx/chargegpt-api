import { ArrayContains, IsArray, IsBoolean } from 'class-validator';
import { OcpiRegularHour } from './ocpi-regular-hour';
import { OcpiExceptionalPeriod } from './ocpi-exceptional-period';
import { isNull } from '../../../../utils/is-null.function';
import { isObjectEmpty } from '../../../../utils/is-object-empty.function';

export class OcpiOpeningTime implements Readonly<OcpiOpeningTime> {
  @IsArray()
  @ArrayContains([OcpiRegularHour])
  regular_hours: OcpiRegularHour[] = [];

  @ArrayContains([OcpiExceptionalPeriod])
  exceptional_openings: OcpiExceptionalPeriod[] = [];

  @ArrayContains([OcpiExceptionalPeriod])
  exceptional_closings: OcpiExceptionalPeriod[] = [];

  @IsBoolean()
  twentyfourseven: boolean;

  private constructor(args: Partial<OcpiOpeningTime>) {
    Object.assign(this, args);
  }

  static create(args: any) {
    if (isNull(args)) {
      return null;
    }

    const payload: any = {};

    payload.twentyfourseven = args.twentyfourseven;
    payload.regular_hours = (args.regular_hours ?? [])
      .map((val: any) => OcpiRegularHour.create(val))
      .filter((val: any) => !isNull(val));
    payload.exceptional_openings = (args.exceptional_openings ?? [])
      .map((val: any) => OcpiExceptionalPeriod.create(val))
      .filter((val: any) => !isNull(val));
    payload.exceptional_closings = (args.exceptional_closings ?? [])
      .map((val: any) => OcpiExceptionalPeriod.create(val))
      .filter((val: any) => !isNull(val));

    if (isObjectEmpty(payload)) {
      return null;
    }

    return new OcpiOpeningTime(payload);
  }
}
