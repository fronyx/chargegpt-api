import { AvailabilityEnum } from './availability.enum';
import { UpdatedAtDateValue } from '../../../../models/general/updated-at-date.value';

export class ProcessedPrediction implements Readonly<ProcessedPrediction> {
  evse: string; // evseID
  timeframe: number;
  is_available: boolean;
  probability: number;
  updated_at: Date;
  evse_primary_id: string;
  prediction_frequency: string;

  constructor(args: {
    evse: string;
    timeframe: number;
    is_available: boolean;
    probability: number;
    updated_at: Date;
    evse_primary_id: string;
    prediction_frequency: string;
  }) {
    Object.assign(this, args);

    this.updated_at = UpdatedAtDateValue.create(args.updated_at).value;
  }

  get status(): AvailabilityEnum {
    return this.is_available ? AvailabilityEnum.AVAILABLE : AvailabilityEnum.UNAVAILABLE;
  }
}
