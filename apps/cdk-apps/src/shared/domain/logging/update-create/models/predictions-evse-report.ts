import {
  AvailabilityEnum
} from './availability.enum';
import { EvseReportResult } from './evse-report-result';

export class PredictionsEvseReport implements Readonly<PredictionsEvseReport> {
  id: number;
  evse: string;
  distance: number;
  predicted_status: string;
  current_status: string;
  location: string;
  created_at: Date;

  constructor(args: Partial<PredictionsEvseReport | unknown>) {
    Object.assign(this, args);
  }

  toEmailReport(): EvseReportResult {
    const it = new EvseReportResult();

    it.walkingDistance = this.distance;
    it.location = this.location;
    it.predictedStatus = this.predicted_status as AvailabilityEnum;
    it.currentStatus = this.current_status as AvailabilityEnum;

    return it;
  }
}
