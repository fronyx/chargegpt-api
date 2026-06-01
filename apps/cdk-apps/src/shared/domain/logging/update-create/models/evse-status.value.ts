import { isEmptyString } from '../../../../utils/is-empty-string.function';
import { AvailabilityEnum } from './availability.enum';

export class EvseStatusValue {
  private readonly _value: AvailabilityEnum;

  private constructor(args: any) {
    this._value = args;
  }

  get value(): AvailabilityEnum {
    return this._value;
  }

  static create(args?: string): EvseStatusValue {
    if (isEmptyString(args)) {
      return new EvseStatusValue(AvailabilityEnum.UNKNOWN);
    }

    return new EvseStatusValue(args);
  }
}
