import { isEmptyString } from '../../utils/is-empty-string.function';
import { ApiTokenCacheValue } from './api-token-cache-value';

export class LocationIDValue extends ApiTokenCacheValue {
  static prefix: string = 'location:id:';

  static create(args: { id?: string; }): LocationIDValue {
    if (isEmptyString(args.id)) {
      throw new Error('Invalid id');
    }

    return new LocationIDValue(`${this.prefix}${args.id}`);
  }
}
