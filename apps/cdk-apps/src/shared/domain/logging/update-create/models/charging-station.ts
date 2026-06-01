import { EvseDto } from './evse.dto';

export class ChargingStation implements Readonly<ChargingStation> {
  stationid: string;
  stationname: string;
  country: string;
  city: string;
  zipcode: string;
  street: string;
  longitude: number;
  latitude: number;
  accessibility: string;
  hotlinenum: string;
  ispublic: boolean;
  chargepointoperator: string;
  operatorvunumber: number;
  evses: EvseDto[];
  createdAt: Date;

  constructor(args: {
    stationid: string;
    stationname: string;
    country: string;
    city: string;
    zipcode: string;
    street: string;
    longitude: number;
    latitude: number;
    accessibility: string;
    hotlinenum: string;
    ispublic: boolean;
    chargepointoperator: string;
    operatorvunumber: number;
    evses: EvseDto[];
    createdAt: Date;
  }) {
    Object.assign(this, args);
    this.longitude = Number(this.longitude);
    this.latitude = Number(this.latitude);
    if (args.operatorvunumber) {
      this.operatorvunumber = Number(args.operatorvunumber);
    }
  }
}
