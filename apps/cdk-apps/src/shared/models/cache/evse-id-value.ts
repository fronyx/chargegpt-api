import { isEmptyString } from '../../utils/is-empty-string.function';
import { ApiTokenCacheValue } from './api-token-cache-value';

export class EvseIDValue extends ApiTokenCacheValue {
  static prefix: string = 'evse_id:';

  static create(args: { value?: string; }): EvseIDValue {
    if (isEmptyString(args.value)) {
      return new EvseIDValue(this.prefix);
    }

    return new EvseIDValue(`${this.prefix}${args.value}`);
  }
}
