import { Injectable } from '@nestjs/common';
import { PredictionInCacheExpiredError } from '../../../../../../apps/cdk-apps/src/shared/';
import { EvsePredictions } from '../../models/evse-predictions';

@Injectable()
export class EvsePredictionsService {
  async get(locationId: string, uid: string, predictionFrequency: string): Promise<EvsePredictions> {
    // TODO skipping searching in redis now since predictions is turned off

    throw new PredictionInCacheExpiredError(`${locationId}_${uid}`);

    // const key = PredictionsClassificationKey.create({ locationId, uid, predictionFrequency }).value;
    // const cacheValue = await this.cache.hGetAll(key);

    // const prediction = new EvsePredictions(cacheValue);

    // if (prediction.isCacheExpired() || prediction.isCacheEmpty()) {
    //   const error = prediction.isCacheExpired() ? new PredictionInCacheExpiredError(`${locationId}_${uid}`) : new NoPredictionInCacheError(`${locationId}_${uid}`);
    //   throw error;
    // }

    // return prediction;
  }
}
