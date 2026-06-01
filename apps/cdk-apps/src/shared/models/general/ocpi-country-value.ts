import { isNull } from '../../utils/is-null.function';
import { alpha2to3Map } from '../../variables';

export class OcpiCountryValue {
  private _value: string;

  private constructor(args: any) {
    this._value = args;
  }

  get value(): string {
    return this._value;
  }

  static create(args: any): OcpiCountryValue {
    if (isNull(args)) {
      throw new Error('Invalid country value!');
    }

    const countryValue = args.toUpperCase();

    if (args.length === 2) {
      return new OcpiCountryValue(alpha2to3Map[countryValue]);
    }

    return new OcpiCountryValue(countryValue);
  }
}
