export class NeutralPartnerCachedEvse {
  uid: string;
  evse_id: string;
  location_id: string;
  latitude: number;
  longitude: number;
  postal_code: string;
  city: string;
  country: string;

  constructor(args: {
    uid: string;
    evse_id: string;
    location_id: string;
    latitude: number;
    longitude: number;
    postal_code: string;
    city: string;
    country: string;
  }) {
    Object.assign(this, args);
    this.latitude = Number(args.latitude);
    this.longitude = Number(args.longitude);
  }

  get key(): string {
    return `NeutralPartner_${this.uid}`;
  }
}

