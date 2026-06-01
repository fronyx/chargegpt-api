export class Coordinate {
  lat: number;
  lng: number;

  constructor(args: { lat: number, lng: number }) {
    this.lat = Number(args.lat);
    this.lng = Number(args.lng);
  }

  toString(): string {
    return `${this.lat},${this.lng}`;
  }

  toQueryParams(): string {
    return `lat=${this.lat}&lng=${this.lng}`;
  }
}
