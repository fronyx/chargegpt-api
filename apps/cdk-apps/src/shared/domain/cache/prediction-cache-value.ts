import { isNull } from '../../utils/is-null.function';
import { AvailabilityEnum, ProcessedPrediction } from '../logging';
import { UpdatedAtDateValue } from '../../models/general/updated-at-date.value';
import { isEmptyString } from '../../utils/is-empty-string.function';

export class PredictionCacheValue {
  status: AvailabilityEnum;
  probability: number;
  updated_at: Date;
  timeframe: number;

  private constructor(args: any) {
    Object.assign(this, args);
  }

  static createFromProcessedPredictionMessage(args: { prediction: ProcessedPrediction }): PredictionCacheValue {
    if (isNull(args.prediction)) {
      throw new Error('Invalid prediction value for PredictionCacheValue.createFromProcessedPredictionMessage');
    }

    return new PredictionCacheValue({
      probability: args.prediction.probability,
      status: args.prediction.status,
      updated_at: UpdatedAtDateValue.create(args.prediction.updated_at).value,
      timeframe: args.prediction.timeframe,
    });
  }

  static createFromCacheValue(args: {
    cacheValue: string;
    timeframe: number;
  }): PredictionCacheValue {
    if (isEmptyString(args.cacheValue)) {
      throw new Error('Invalid input for PredictionCacheValue.createFromCacheValue.');
    }

    const values = args.cacheValue.split(':');

    return new PredictionCacheValue({
      status: values[0] === 'OCCUPIED' ? AvailabilityEnum.UNAVAILABLE : values[0],
      probability: values[1],
      updated_at: UpdatedAtDateValue.create(values[2]).value,
      timeframe: Number(args.timeframe),
    });
  }

  get value(): string {
    return `${this.status}:${this.probability}:${this.updated_at.getTime()}`;
  }

  get nonExpiredPredictions(): PredictionCacheValue | null {
    if ((Date.now() - this.updated_at.getTime()) > 20 * 60 * 1000) {
      return null;
    }

    return this;
  }
}


