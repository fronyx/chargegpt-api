import { AvailabilityEnum, EvsePrediction, PredictionDetails } from '../../index';

export class ChargingStationPrediction {
  id: string;
  predictions: PredictionDetails[] = [];

  constructor(args: {
    id: string;
    evses: EvsePrediction[];
  }) {
    this.id = args.id;
    this.predictions = this.aggregatePredictions(args);
  }

  private aggregatePredictions(args: {
    evses: EvsePrediction[];
  }): PredictionDetails[] {
    const locationPredictions: Record<string, {
      timestamp: string;
      status: string;
      probability?: number;
    }[]> = {};

    args.evses.forEach(evse => {
      evse.predictions.forEach(({ timestamp, status, probability }) => {
        const key = String(new Date(timestamp).getTime());

        locationPredictions[key] = locationPredictions[key] ?? [];
        locationPredictions[key].push({
          timestamp,
          status,
          probability
        });
      });
    });

    return Object.keys(locationPredictions).map(timestamp => {
      const payload: any = {};
      const isoTimestamp = new Date(Number(timestamp)).toISOString();
      const key = String(new Date(Number(timestamp)).getTime());

      function calculateAverage(predictions: { probability?: number }[] = []) {
        return predictions.map(({ probability }) => Number(probability)).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) / predictions.length;
      }

      let probability;

      const availablePredictions = locationPredictions[key].filter(({ status }) => status === 'AVAILABLE');
      probability = calculateAverage(availablePredictions.length > 0 ? availablePredictions : locationPredictions[key]);

      payload.timestamp = isoTimestamp;
      payload.status = locationPredictions[key].some(({ status }) => status === 'AVAILABLE') ? AvailabilityEnum.AVAILABLE : AvailabilityEnum.UNAVAILABLE;

      if (!!probability) {
        payload.probability = probability;
      }

      return new PredictionDetails(payload);
    });
  }
}
