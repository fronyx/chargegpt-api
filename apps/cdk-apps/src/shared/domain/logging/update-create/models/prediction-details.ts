import { AvailabilityEnum } from './availability.enum';

export class PredictionDetails {
  status: AvailabilityEnum;
  probability?: number;
  timestamp: string; // ISO string

  constructor(args: {
    probability?: number;
    status?: AvailabilityEnum;
    timeframe?: number;
    timestamp: string;
  }) {
    Object.assign(this, args);

    this.status = args.status === AvailabilityEnum.AVAILABLE ? AvailabilityEnum.AVAILABLE : AvailabilityEnum.UNAVAILABLE;
    this.timestamp = new Date(args.timestamp).toISOString();
  }
}
