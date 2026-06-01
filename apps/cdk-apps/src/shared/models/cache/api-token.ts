import { isEmptyString } from '../../utils/is-empty-string.function';

export class ApiToken {
  private readonly token: string;

  private constructor(token: string) {
    this.token = token;
  }

  get value(): string {
    return this.token;
  }

  static create(args: { token: string; }): ApiToken {
    if (isEmptyString(args.token)) {
      throw new Error('Invalid api token');
    }

    return new ApiToken(args.token);
  }
}
