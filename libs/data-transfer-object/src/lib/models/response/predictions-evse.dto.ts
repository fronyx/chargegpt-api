import { Coordinate } from '../request/coordinate';

export class PredictionsEvseDto implements Readonly<PredictionsEvseDto> {
  evse: string;
  station_id: string;
  country: string;
  city: string;
  zipcode: string;
  street: string;
  longitude: number;
  latitude: number;
  charging_facility_type: string;
  current_type: string;
  plug_type: string;
  station_name: string;

  constructor(args: Partial<PredictionsEvseDto | unknown>) {
    Object.assign(this, args);
  }

  get coordinates(): Coordinate {
    return new Coordinate({lat: this.latitude, lng: this.longitude});
  }

  get location(): string {
    return `${this.street}, ${this.zipcode} ${this.city}`.trim();
  }
}
