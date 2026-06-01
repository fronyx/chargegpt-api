import { PartyId } from './party-id';

export class ScopedEntityIdsPartyIdKey {
  private readonly key: string;

  static keyPrefix = 'scope_entity_ids:cpo:party_id:';

  private constructor(key: string) {
    this.key = key;
  }

  get value(): string {
    return this.key;
  }

  static create(args: { partyId: PartyId; }): ScopedEntityIdsPartyIdKey {
    const key = `${this.keyPrefix}${args.partyId.value}`;
    return new ScopedEntityIdsPartyIdKey(key);
  }
}
