import { EvseReportResult } from './evse-report-result';

export class PredictionsReport {
  durationFromLastSearched: string;
  location: string;
  arrivalTime: string;
  evses: EvseReportResult[];
  email: string;

  constructor(args: Partial<PredictionsReport>) {
    Object.assign(this, args);
  }
}
