import { AvailabilityEnum } from './availability.enum';

export class EvseReportResult {
  walkingDistance: number;
  location: string;
  predictedStatus: AvailabilityEnum;
  currentStatus: AvailabilityEnum;
}
