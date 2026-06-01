import { isEmptyString } from '../../utils/is-empty-string.function';

export class OcpiLocationEvseListKey {
  private readonly key: string;

  static keyPrefix = 'ocpi:location:';
  static keySuffix = ':evses';

  private constructor(key: string) {
    this.key = key;
  }

  get value(): string {
    return this.key;
  }

  static create(args: { locationId: string; }): OcpiLocationEvseListKey {
    if (isEmptyString(args.locationId)) {
      throw new Error('Invalid location id');
    }

    const key = `${this.keyPrefix}${args.locationId}${this.keySuffix}`;
    return new OcpiLocationEvseListKey(key);
  }
}
