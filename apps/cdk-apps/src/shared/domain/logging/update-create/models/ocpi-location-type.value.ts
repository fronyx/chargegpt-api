import { isEmptyString } from '../../../../utils/is-empty-string.function';

export class OcpiLocationTypeValue {
  private readonly _value: string;

  private constructor(args: any) {
    this._value = args;
  }

  get value(): string {
    return this._value;
  }

  static create(args?: string): OcpiLocationTypeValue {
    if (isEmptyString(args)) {
      return new OcpiLocationTypeValue('UNKNOWN');
    }

    return new OcpiLocationTypeValue(args);
  }
}
