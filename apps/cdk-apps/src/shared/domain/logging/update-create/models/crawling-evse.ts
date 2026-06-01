export class CrawlingEvse implements Readonly<CrawlingEvse> {
  evse_id: string;
  uid: string;
  status: string;
  charging_facility_type: string;
  current_type: string;
  is_bookable: boolean;
  plugs: string;
  payments: string;
  last_updated: Date;

  constructor(args: {
    evse_id: string;
    uid: string;
    status: string;
    charging_facility_type: string;
    current_type: string;
    is_bookable: boolean;
    plugs: string;
    payments: string;
    last_updated: Date;
  }) {
    Object.assign(this, args);
  }
}
