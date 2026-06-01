import { isNull } from '../../utils/is-null.function';

export class UpdatedAtDateValue {
  private _value: Date;

  private constructor(args: any) {
    this._value = args;
  }

  get value(): Date {
    return this._value;
  }

  toString(): string {
    return this._value.toISOString();
  }

  toTimestamp(): number {
    return this._value.getTime();
  }

  static create(args: any): UpdatedAtDateValue {
    if (isNull(args)) {
      return new UpdatedAtDateValue(new Date());
    }

    if (this.isValidDate(args)) {
      return new UpdatedAtDateValue(new Date(args));
    }

    if (this.isValidDate(args['$date'])) {
      return new UpdatedAtDateValue(new Date(args['$date']));
    }

    if (!isNaN(args)) {
      return new UpdatedAtDateValue(new Date(Number(args)));
    }

    return new UpdatedAtDateValue(new Date());
  }

  static isValidDate(args: any): boolean {
    const d: any = new Date(args);
    return Object.prototype.toString.call(d) === '[object Date]' && isFinite(d);
  }
}
