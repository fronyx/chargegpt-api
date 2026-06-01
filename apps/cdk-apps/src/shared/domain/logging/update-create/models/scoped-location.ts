interface Location {
  id: string;
  coordinates: { latitude: number; longitude: number; };
  evseIds: string[];
}

export class ScopedLocation implements Readonly<ScopedLocation> {
  locations: Location[] = [];

  static getKey(args: { apiToken: string; }): string {
    return `scoped_locations_${args.apiToken}`;
  }

  constructor(args: {
    locations: Location[];
  }) {
    Object.assign(this, args);
  }
}
