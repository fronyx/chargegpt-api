import { isEmptyString } from '../../utils/is-empty-string.function';

export class UtilisationStatusCacheKey {
  static keyPrefix: string = 'utilisation_status:group_';
  private readonly key: string;

  private constructor(key: string) {
    this.key = key;
  }

  get value(): string {
    return this.key;
  }

  static create(args: {
    groupNumber: number;
  }): UtilisationStatusCacheKey {
    if (isEmptyString(args.groupNumber.toString())) {
      throw new Error('Invalid evse primary id when creating UtilisationStatusCacheKey');
    }

    const key = `${this.keyPrefix}${args.groupNumber}`;
    return new UtilisationStatusCacheKey(key);
  }
}
