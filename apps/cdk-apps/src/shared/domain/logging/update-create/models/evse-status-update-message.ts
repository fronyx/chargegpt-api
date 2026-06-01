import { CrawlingEvse } from './crawling-evse';

export class EvseStatusUpdateMessage {
  name: string;
  status: string;
  createdAt: Date;

  constructor(args: {
    name: string;
    status: string;
    createdAt: Date;
  }) {
    Object.assign(this, args);
    this.createdAt = new Date(args.createdAt);
  }

  toCrawlingEvse(): CrawlingEvse {
    return new CrawlingEvse({
      status: this.status,
      uid: this.name,
      evse_id: '',
      last_updated: this.createdAt,
      charging_facility_type: '',
      current_type: '',
      is_bookable: false,
      payments: '',
      plugs: '',
    })
  }
}
