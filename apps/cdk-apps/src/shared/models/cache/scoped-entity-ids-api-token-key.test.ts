import { ScopedEntityIdsApiTokenKey } from './scoped-entity-ids-api-token-key';
import { ApiToken } from './api-token';

describe('ScopedEntityIdsApiTokenKey', () => {
  test('key is in the correct format', () => {
    const token = 'dummytoken';
    const apiToken = ApiToken.create({ token });

    const key = ScopedEntityIdsApiTokenKey.create({ apiToken });

    expect(key.value).toEqual(`${ScopedEntityIdsApiTokenKey.keyPrefix}${token}`);
  });
});
