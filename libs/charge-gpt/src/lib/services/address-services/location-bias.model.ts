import { Coordinates } from '../../models/prompt';
import { CardinalDirections } from './cardinal-directions-utils.service';

type CoordinateString = string; // 'lat,lng'

export interface BoundingBox {
  topLeftPoint: CoordinateString;
  btmRightPoint: CoordinateString;
}

export interface LocationBiasOutput extends Coordinates {
  countryCode: string;
  cardinalDirection: CardinalDirections;
  boundingBox: BoundingBox;
}

export interface BoundingBoxCoordinates {
  topLeftPoint: { lat: any; lon: any };
  btmRightPoint: { lat: any; lon: any };
}