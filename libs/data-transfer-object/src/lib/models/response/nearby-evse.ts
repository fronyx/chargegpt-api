export class NearbyEvse implements Readonly<NearbyEvse> {
  evse: string;
  location: string;
  distance: number;

  constructor(args: Partial<NearbyEvse>) {
    Object.assign(this, args);
  }
}
