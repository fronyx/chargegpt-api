import { Coordinates } from '../../models/prompt';
import { LocationBiasOutput } from './location-bias.model';
import { boundingBox2String } from './location-bias.service';

export type CardinalDirections =
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'northeast'
  | 'southeast'
  | 'northwest'
  | 'southwest';

export interface CardinalDirectionsCoordinates {
  north: Coordinates;
  south: Coordinates;
  east: Coordinates;
  west: Coordinates;
  northwest: Coordinates;
  northeast: Coordinates;
  southeast: Coordinates;
  southwest: Coordinates;
}

const CardinalDirectionsRegex =
  /\b(northeast|northeastern|southeast|southeastern|northwest|northwestern|southwest|southwestern|north|northern|south|southern|east|eastern|west|western)\b/i;

export const removeCardinalDirectionFromTerm = (
  term: string
): {
  term: string;
  cardinalDirection: CardinalDirections | undefined;
} => {
  let sanitizedAddress = term.replace(/-/gi, '').toLowerCase();
  const match = sanitizedAddress.match(CardinalDirectionsRegex);

  if (!match) {
    return {
      term: sanitizedAddress,
      cardinalDirection: undefined,
    };
  }

  const [cardinalDirection] = match;

  sanitizedAddress = sanitizedAddress
    .replace(`${cardinalDirection}, `, '')
    .replace(`, ${cardinalDirection}`, '')
    .replace(cardinalDirection, '');

  return {
    term: sanitizedAddress,
    cardinalDirection: getProperCardinalDirection(cardinalDirection),
  };
};

export const getProperCardinalDirection = (
  cardinalDirection: string
): CardinalDirections => {
  if (!cardinalDirection) {
    return null;
  }

  const direction = cardinalDirection.replace('ern', '');
  return direction as CardinalDirections;
};

export const findCardinalDirectionFromTheAddress = (
  address: string
): CardinalDirections | null => {
  const sanitizedAddress = address.replace(/[/\s-/]/gi, '').toLowerCase();
  const match = sanitizedAddress.match(CardinalDirectionsRegex);

  if (!match) {
    return null;
  }

  return getProperCardinalDirection(match[0]) as CardinalDirections;
};

export const movePointToCardinalDirection = (
  cardinalDirection: CardinalDirections,
  countryCode: string,
  topLeftPoint: {
    lat: number;
    lon: number;
  },
  bottomRightPoint: { lat: number; lon: number }
): LocationBiasOutput => {
  const cardinalDirectionsBoundingBox = getBoundingBoxesOfCardinalDirections(
    topLeftPoint,
    bottomRightPoint
  )[cardinalDirection];

  const cardinalDirectionsCoordinates = calculateAllCardinalDirections(
    topLeftPoint,
    bottomRightPoint
  )[cardinalDirection];

  return {
    ...cardinalDirectionsCoordinates,
    countryCode,
    cardinalDirection,
    boundingBox: boundingBox2String({
      topLeftPoint: cardinalDirectionsBoundingBox.topLeft,
      btmRightPoint: cardinalDirectionsBoundingBox.bottomRight,
    }),
  };
};

export const calculateAllCardinalDirections = (
  topLeftPoint: { lat: number; lon: number },
  bottomRightPoint: {
    lat: number;
    lon: number;
  }
): CardinalDirectionsCoordinates => {
  const boundingBox = {
    topLeftPoint: { lat: topLeftPoint.lat, lng: topLeftPoint.lon },
    topRightPoint: { lat: topLeftPoint.lat, lng: bottomRightPoint.lon },
    bottomLeftPoint: { lat: bottomRightPoint.lat, lng: topLeftPoint.lon },
    bottomRightPoint: { lat: bottomRightPoint.lat, lng: bottomRightPoint.lon },
  };

  const intermediateCardinalDirections = {
    northeast: {
      lat:
        boundingBox.topRightPoint.lat -
        reduce2PointByPercentage(
          boundingBox.topRightPoint.lat,
          boundingBox.bottomRightPoint.lat
        ),
      lng:
        boundingBox.topRightPoint.lng -
        reduce2PointByPercentage(
          boundingBox.topRightPoint.lng,
          boundingBox.topLeftPoint.lng
        ),
    },
    northwest: {
      lat:
        boundingBox.topLeftPoint.lat -
        reduce2PointByPercentage(
          boundingBox.topLeftPoint.lat,
          boundingBox.bottomLeftPoint.lat
        ),
      lng:
        boundingBox.topLeftPoint.lng +
        reduce2PointByPercentage(
          boundingBox.topRightPoint.lng,
          boundingBox.topLeftPoint.lng
        ),
    },
    southeast: {
      lat:
        boundingBox.bottomRightPoint.lat +
        reduce2PointByPercentage(
          boundingBox.topRightPoint.lat,
          boundingBox.bottomRightPoint.lat
        ),
      lng:
        boundingBox.bottomRightPoint.lng -
        reduce2PointByPercentage(
          boundingBox.bottomRightPoint.lng,
          boundingBox.bottomLeftPoint.lng
        ),
    },
    southwest: {
      lat:
        boundingBox.bottomLeftPoint.lat +
        reduce2PointByPercentage(
          boundingBox.topLeftPoint.lat,
          boundingBox.bottomLeftPoint.lat
        ),
      lng:
        boundingBox.bottomLeftPoint.lng +
        reduce2PointByPercentage(
          boundingBox.bottomRightPoint.lng,
          boundingBox.bottomLeftPoint.lng
        ),
    },
  };

  const primaryCardinalDirections = {
    north: {
      lat: calculateBetween2Points(
        intermediateCardinalDirections.northwest.lat,
        intermediateCardinalDirections.northeast.lat
      ),
      lng: calculateBetween2Points(
        intermediateCardinalDirections.northwest.lng,
        intermediateCardinalDirections.northeast.lng
      ),
    },
    south: {
      lat: calculateBetween2Points(
        intermediateCardinalDirections.southwest.lat,
        intermediateCardinalDirections.southeast.lat
      ),
      lng: calculateBetween2Points(
        intermediateCardinalDirections.southwest.lng,
        intermediateCardinalDirections.southeast.lng
      ),
    },
    east: {
      lat: calculateBetween2Points(
        intermediateCardinalDirections.northeast.lat,
        intermediateCardinalDirections.southeast.lat
      ),
      lng: calculateBetween2Points(
        intermediateCardinalDirections.northeast.lng,
        intermediateCardinalDirections.southeast.lng
      ),
    },
    west: {
      lat: calculateBetween2Points(
        intermediateCardinalDirections.northwest.lat,
        intermediateCardinalDirections.southwest.lat
      ),
      lng: calculateBetween2Points(
        intermediateCardinalDirections.northwest.lng,
        intermediateCardinalDirections.southwest.lng
      ),
    },
  };

  return {
    ...intermediateCardinalDirections,
    ...primaryCardinalDirections,
  };
};

export const getBoundingBoxesOfCardinalDirections = (
  topLeftPoint,
  bottomRightPoint
): any => {
  const { lat: lat1, lon: lon1 } = topLeftPoint;
  const { lat: lat2, lon: lon2 } = bottomRightPoint;

  // Divide latitude and longitude into thirds
  const latDiff = (lat1 - lat2) / 3;
  const lngDiff = (lon2 - lon1) / 3;

  return {
    north: {
      topLeft: { lat: lat1, lon: lon1 },
      bottomRight: { lat: lat1 - latDiff, lon: lon2 },
    },
    south: {
      topLeft: { lat: lat2 + latDiff, lon: lon1 },
      bottomRight: { lat: lat2, lon: lon2 },
    },
    east: {
      topLeft: { lat: lat1, lon: lon2 - lngDiff },
      bottomRight: { lat: lat2, lon: lon2 },
    },
    west: {
      topLeft: { lat: lat1, lon: lon1 },
      bottomRight: { lat: lat2, lon: lon1 + lngDiff },
    },
    northeast: {
      topLeft: { lat: lat1, lon: lon2 - lngDiff },
      bottomRight: { lat: lat1 - latDiff, lon: lon2 },
    },
    northwest: {
      topLeft: { lat: lat1, lon: lon1 },
      bottomRight: { lat: lat1 - latDiff, lon: lon1 + lngDiff },
    },
    southeast: {
      topLeft: { lat: lat2 + latDiff, lon: lon2 - lngDiff },
      bottomRight: { lat: lat2, lon: lon2 },
    },
    southwest: {
      topLeft: { lat: lat2 + latDiff, lon: lon1 },
      bottomRight: { lat: lat2, lon: lon1 + lngDiff },
    },
  };
};

export const reduce2PointByPercentage = (
  firstPoint: number,
  secondPoint: number
): number => {
  return (firstPoint - secondPoint) * 0.3;
};

export const calculateBetween2Points = (
  firstPoint: number,
  secondPoint: number
): number => {
  return (firstPoint + secondPoint) / 2;
};

export function findCardinalDirectionFromTranslatedAddress(
  translatedAddress: string,
  untranslatedAddress: string,
  cardinalDirection: string
): string {
  const tAddress = translatedAddress.toLowerCase();
  const cDirection = cardinalDirection.toLowerCase();

  const pos = tAddress.indexOf(cDirection);
  return untranslatedAddress.substring(pos);
}
