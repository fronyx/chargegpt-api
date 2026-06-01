import { PredictionDetails } from '../../index';

export class EvsePrediction {
  evseId?: string;
  uid?: string;
  locationId?: string;
  predictions: PredictionDetails[];

  constructor(args: {
    evseId?: string;
    uid?: string;
    locationId?: string;
    predictions: PredictionDetails[];
  }) {
    Object.assign(this, args);
  }
}
