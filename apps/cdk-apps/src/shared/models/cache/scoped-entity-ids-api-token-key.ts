import { ApiToken } from './api-token';

export class ScopedEntityIdsApiTokenKey {
  private readonly key: string;

  static keyPrefix = 'scope_entity_ids:project:api_token:';

  private constructor(key: string) {
    this.key = key;
  }

  get value(): string {
    return this.key;
  }

  static create(args: { apiToken: ApiToken; }): ScopedEntityIdsApiTokenKey {
    const key = `${this.keyPrefix}${args.apiToken.value}`;
    return new ScopedEntityIdsApiTokenKey(key);
  }
}
