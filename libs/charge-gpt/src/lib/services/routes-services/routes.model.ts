export interface Route {
  legs: Leg[];
}

export interface Leg {
  points: Point[];
  summary?: {
    lengthInMeters: number;
  };
}

interface Point {
  latitude: number;
  longitude: number;
}
