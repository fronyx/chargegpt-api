import { PartyId } from './party-id';
import { ScopedEntityIdsPartyIdKey } from './scoped-entity-ids-party-id-key';

describe('ScopedEntityIdsPartyIdKey', () => {
  test('key is in the correct format', () => {
    const id = 'dummypartyId';
    const partyId = PartyId.create({ partyId: id });

    const key = ScopedEntityIdsPartyIdKey.create({ partyId });

    expect(key.value).toEqual(`${ScopedEntityIdsPartyIdKey.keyPrefix}${id}`);
  });
});
