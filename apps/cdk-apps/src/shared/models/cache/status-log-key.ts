import { isEmptyString } from '../../utils/is-empty-string.function';

export class StatusLogKey {
  private readonly key: string;
  private readonly data: {
    locationId?: string;
    uid?: string;
  } = {};

  private constructor(args: {
    key: string;
    locationId: string;
    uid: string;
  }) {
    this.key = args.key;
    this.data.locationId = args.locationId;
    this.data.uid = args.uid;
  }

  get value(): string {
    return this.key;
  }

  get locationId(): string {
    return this.data.locationId!;
  }

  get uid(): string {
    return this.data.uid!;
  }

  toString(): string {
    return `Location ID: ${this.locationId}, UID: ${this.uid}`;
  }

  static create(args: { locationId: string; uid: string; }): StatusLogKey {
    if (isEmptyString(args.locationId) || isEmptyString(args.uid)) {
      throw new Error('Invalid input value for status log key.');
    }

    return new StatusLogKey({
      key: `ocpi:status_logs:location_id:${args.locationId}:uid:${args.uid}`,
      locationId: args.locationId,
      uid: args.uid,
    });
  }
}
