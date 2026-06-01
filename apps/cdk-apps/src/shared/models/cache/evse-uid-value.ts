import { isEmptyString } from '../../utils/is-empty-string.function';
import { ApiTokenCacheValue } from './api-token-cache-value';

export class EvseUIDValue extends ApiTokenCacheValue {
  static prefix: string = 'evse:evse_uid:';

  static create(args: { uid?: string; }): EvseUIDValue {
    if (isEmptyString(args.uid)) {
      throw new Error('Invalid uid');
    }

    return new EvseUIDValue(`${this.prefix}${args.uid}`);
  }
}
