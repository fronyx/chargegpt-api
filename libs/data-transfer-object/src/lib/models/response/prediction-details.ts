import {
  AvailabilityEnum
} from '../../../../../../apps/cdk-apps/src/shared';

export class PredictionDetails implements Readonly<PredictionDetails> {
  evse_id: string;
  predicted_status: AvailabilityEnum;
  predicted_change_time: string;

  constructor(args: {
    evse_id: string;
    predicted_status: AvailabilityEnum;
    predicted_change_time: string;
  }) {
    Object.assign(this, args);
  }

  static fromPayload(args: {
    evse_id: string;
    predicted_status: AvailabilityEnum;
    calculation_time: number;
    timeframe: number;
  }): PredictionDetails {
    return new PredictionDetails({
      evse_id: args.evse_id,
      predicted_status: args.predicted_status,
      predicted_change_time: new Date(args.calculation_time + (args.timeframe * 60 * 1000)).toISOString(),
    });
  }
}
