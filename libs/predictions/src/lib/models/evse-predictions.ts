import { PredictionCacheValue } from '../../../../../apps/cdk-apps/src/shared/domain/cache/prediction-cache-value';

export class EvsePredictions {
  private isEmpty = false;
  private isExpired = false;

  private validValues: PredictionCacheValue[] = [];
  private rawValues: PredictionCacheValue[] = [];

  constructor(cacheValue: Record<string, string>) {
    if (cacheValue) {
      Object.keys(cacheValue).forEach((timeframe) => {
        const prediction = PredictionCacheValue.createFromCacheValue({
          cacheValue: cacheValue[timeframe],
          timeframe: Number(timeframe),
        });

        this.rawValues.push(prediction);

        if (prediction.nonExpiredPredictions !== null) {
          this.validValues.push(prediction);
        }
      });

      this.isExpired = this.validValues.length < 1;
    } else {
        this.isEmpty = true;
    }
  }

  isCacheEmpty(): boolean {
    return this.isEmpty
  }

  isCacheExpired(): boolean {
    return this.isExpired;
  }

  values(): PredictionCacheValue[] {
    return this.validValues;
  }
}
