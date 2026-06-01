import { isEmptyString } from '../../utils/is-empty-string.function';

export class PartyId {
  private readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  get value(): string {
    return this.id;
  }

  static create(args: { partyId: string; }): PartyId {
    if (isEmptyString(args.partyId)) {
      throw new Error('Invalid party id');
    }

    return new PartyId(args.partyId);
  }
}
