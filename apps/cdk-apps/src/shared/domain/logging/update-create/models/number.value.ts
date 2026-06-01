import { isNull } from '../../../../utils/is-null.function';

export class NumberValue {
  private _value: number;

  private constructor(args: any) {
    this._value = args;
  }

  get value(): number {
    return this._value;
  }

  static create(args: any) {
    if (isNull(args)) {
      return new NumberValue(undefined);
    }

    const parsedNumber = Number(args);
    if (isNaN(parsedNumber)) {
      return new NumberValue(undefined);
    }

    return new NumberValue(parsedNumber);
  }
}
