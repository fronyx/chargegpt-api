import { PredictionsEvseReport } from './predictions-evse-report';
import { PredictionsReport } from './predictions-report';

export class PredictionsReportRequest {
  id: number;
  duration_from_last_searched: string;
  location: string;
  arrival_time: string;
  email: string;
  timeframe: number;
  is_sent: boolean;
  created_at: Date;
  deliver_at: Date;
  evses: PredictionsEvseReport[];

  constructor(args: Partial<PredictionsReportRequest>) {
    Object.assign(this, args);
    this.evses = (args.evses ?? []).map(evse => new PredictionsEvseReport(evse));
  }

  isAfterArrivalTime(): boolean {
    const now = new Date().getTime();
    console.log(this.deliver_at);
    return now >= this.deliver_at.getTime();
  }

  toEmailReport(): PredictionsReport {
    return new PredictionsReport({
      durationFromLastSearched: this.duration_from_last_searched,
      location: this.location,
      arrivalTime: this.arrival_time,
      evses: this.evses.map(evse => evse.toEmailReport()),
      email: this.email,
    });
  }
}
