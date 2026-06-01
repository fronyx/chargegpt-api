import { PredictionDetails } from './prediction-details';

export class PredictionsMessage implements Readonly<PredictionsMessage> {
  calculation_time: string;
  predictions: PredictionDetails[] = [];

  constructor(args: {
    calculation_time: string;
    predictions: PredictionDetails[];
  }) {
    Object.assign(this, args);
    this.predictions = args.predictions.map(val => new PredictionDetails(val));
  }
}
