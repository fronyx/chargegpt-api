import { isEmptyString } from '../../utils/is-empty-string.function';

export class EvseStatusCacheKey {
  static keyPrefix: string = 'current_location_status:';
  private readonly key: string;
  static value: string;

  private constructor(key: string) {
    this.key = key;
  }

  get value(): string {
    return this.key;
  }

  static create(args: {
    locationId: string;
  }): EvseStatusCacheKey {
    if (isEmptyString(args.locationId)) {
      throw new Error('Invalid location id when creating EvseStatusCacheKey');
    }

    const key = `${this.keyPrefix}${args.locationId}`;
    return new EvseStatusCacheKey(key);
  }
}
