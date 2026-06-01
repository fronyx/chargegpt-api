import { Coordinate } from './coordinate';

export class Address {
  name!: string;
  coordinate: Coordinate;

  constructor(args: { name: string; lat: number; lng: number; }) {
    Object.assign(this, args);
    this.coordinate = new Coordinate({ lat: args.lat, lng: args.lng });
  }
}
