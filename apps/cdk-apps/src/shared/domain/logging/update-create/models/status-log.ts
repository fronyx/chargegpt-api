import { NeutralPartnerCachedEvse } from './NeutralPartner-cached-evse';
import { ChargingStation } from './charging-station';
import { EvseDto } from './evse.dto';

export class StatusLog {
  evse_id: string;
  uid: string;
  status: string;
  last_updated: Date;
  location_id: string;
  latitude: number;
  longitude: number;
  postal_code: string;
  city: string;
  country: string;

  constructor(args: {
    evse_id: string;
    uid: string;
    status: string;
    last_updated: Date;
    location_id: string;
    latitude: number;
    longitude: number;
    postal_code: string;
    city: string;
    country: string;
  }) {
    Object.assign(this, args);
  }

  static fromChargingStationAndEvse(args: {
    location: ChargingStation,
    evse: EvseDto,
  }): StatusLog {
    return new StatusLog({
      evse_id: args.evse.evseid,
      uid: args.evse.evsename,
      status: args.evse.status,
      last_updated: args.evse.createdAt,
      location_id: args.location.stationid,
      latitude: args.location.latitude,
      longitude: args.location.longitude,
      postal_code: args.location.zipcode,
      city: args.location.city,
      country: args.location.country,
    });
  }

  toCachedEvse(): NeutralPartnerCachedEvse {
    return new NeutralPartnerCachedEvse({
      uid: this.uid,
      evse_id: this.evse_id,
      location_id: this.location_id,
      latitude: this.latitude,
      longitude: this.longitude,
      postal_code: this.postal_code,
      city: this.city,
      country: this.country,
    })
  }
}

