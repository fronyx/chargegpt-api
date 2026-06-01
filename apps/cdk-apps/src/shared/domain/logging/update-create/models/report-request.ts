import { EvseReportRequest } from './evse-report-request';

export class ReportRequest implements Readonly<ReportRequest> {
  email: string;
  created_at: Date;
  timeframe: number;
  human_readable_time_from_now: string;
  arrival_time: string;
  deliver_at: Date;
  location: string;
  evses: EvseReportRequest[];
  is_subscribe: boolean;

  constructor(args: ReportRequest) {
    Object.assign(this, args);

    this.created_at = new Date(args.created_at);
    this.deliver_at = new Date(args.deliver_at);
    this.evses = (args.evses ?? []).map(evse => new EvseReportRequest(evse));
  }
}
