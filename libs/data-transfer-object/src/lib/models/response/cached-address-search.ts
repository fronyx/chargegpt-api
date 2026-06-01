import { NearbyEvse } from './nearby-evse';
import { Md5 } from 'ts-md5';

export class CachedAddressSearch implements Readonly<CachedAddressSearch> {
  evses: NearbyEvse[];

  longitude: number;

  latitude: number;

  constructor(args: {
    evses: NearbyEvse[];
    longitude: number;
    latitude: number;
  }) {
    Object.assign(this, args);
    this.evses = (args.evses || []).map(val => new NearbyEvse(val));
  }

  get key(): string {
    return CachedAddressSearch.getKey({ lng: this.longitude, lat: this.latitude });
  }

  static getKey(args: { lng: number; lat: number; }): string {
    const suffix = `${args.lng}_${args.lat}`;
    const hash = Md5.hashStr(suffix);
    return `${CachedAddressSearch.cachePrefix()}-${hash}`;
  }

  static cachePrefix(): string {
    return 'fro_address_cached';
  }
}

