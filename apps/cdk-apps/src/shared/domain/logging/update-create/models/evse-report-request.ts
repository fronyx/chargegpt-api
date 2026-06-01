import { AvailabilityEnum } from './availability.enum';

export class EvseReportRequest {
  status: AvailabilityEnum;
  distance: number;
  evse: string;
  location: string;

  constructor(args: Partial<EvseReportRequest>) {
    Object.assign(this, args);
  }
}
