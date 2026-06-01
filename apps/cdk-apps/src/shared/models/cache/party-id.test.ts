import { PartyId } from './party-id';

describe('PartyId', () => {
  test('value contain party id', () => {
    const partyId = 'dummypartyId';
    expect(PartyId.create({ partyId }).value).toEqual(partyId);
  });

  test('exception is thrown ', () => {
    expect(() => PartyId.create({ partyId: null as any })).toThrow();
    expect(() => PartyId.create({ partyId: '' })).toThrow();
    expect(() => PartyId.create({ partyId: undefined as any})).toThrow();
  });
});
