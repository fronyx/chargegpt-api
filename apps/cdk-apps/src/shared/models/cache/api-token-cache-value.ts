import { isEmptyString } from '../../utils/is-empty-string.function';

export class ApiTokenCacheValue {
  private readonly internalValue: string;

  protected constructor(value: string) {
    this.internalValue = value;
  }

  get value(): string {
    return this.internalValue;
  }

  static create(args: any): ApiTokenCacheValue {
    if (isEmptyString(args)) {
      throw new Error('Invalid input for ApiTokenCacheValue.createFromProcessedPredictionMessage');
    }

    return new ApiTokenCacheValue(args);
  }
}
