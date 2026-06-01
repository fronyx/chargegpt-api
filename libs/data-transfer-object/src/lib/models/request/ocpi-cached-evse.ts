export class OcpiCachedEvse {
  uid: string;
  evse_id: string;
  status: string;
  location_id: string;
  latitude: number;
  longitude: number;
  postal_code: string;
  city: string;
  country: string;

  constructor(args: {
    uid: string;
    evse_id: string;
    status: string;
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
    return OcpiCachedEvse.getKey({ locationId: this.location_id, uid: this.uid });
  }

  static getKey(args: { locationId: string; uid: string; }): string {
    return `${OcpiCachedEvse.getPrefix()}${args.locationId}_${args.uid}`
  }

  static getPrefix(): string {
    return 'ocpi_evse_';
  }
}

