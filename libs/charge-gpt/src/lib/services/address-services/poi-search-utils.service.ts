import { Coordinates } from '../../models/prompt';
import { AddressCharacteristics } from '../address-identifiers/address-characteristics.model';
import { DestinationSearchConversationContext } from './poi-search.service';

export const distanceInMeterBetween2Locations = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  if (
    lat1 === undefined ||
    lng1 === undefined ||
    lat2 === undefined ||
    lng2 === undefined ||
    lat1 === null ||
    lng1 === null ||
    lat2 === null ||
    lng2 === null
  ) {
    throw new Error('Invalid coordinates.');
  }
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};

export const filterOptionsTooCloseFromEachOther = (
  inputOptions: any[],
  mainPointIndex = 0
) => {
  const addressOptions = [...inputOptions];
  const [mainPoint] = addressOptions.splice(mainPointIndex, 1);

  const filteredPoints = addressOptions.filter((point) => {
    const distance = distanceInMeterBetween2Locations(
      mainPoint.lat,
      mainPoint.lng,
      point.lat,
      point.lng
    );

    return distance > 300;
  });

  const combinedPointsWithMainPoint = [
    ...filteredPoints.slice(0, mainPointIndex),
    mainPoint,
    ...filteredPoints.slice(mainPointIndex),
  ];

  if (mainPointIndex !== combinedPointsWithMainPoint.length - 1) {
    return filterOptionsTooCloseFromEachOther(
      combinedPointsWithMainPoint,
      mainPointIndex + 1
    );
  }

  return combinedPointsWithMainPoint;
};

// Not sorting if there is no current coordinates
export const sortOptionsByDistanceFromCurrentCoordinates = (
  addressOptionsInput: any[],
  currentCoordinates: { lat: string; lng: string } | null
) => {
  if (currentCoordinates === null) {
    return addressOptionsInput;
  }

  const currentLatitude = Number(currentCoordinates.lat);
  const currentLongitude = Number(currentCoordinates.lng);

  const options = [...addressOptionsInput];

  for (let i = 0; i < options.length; i++) {
    const distance = distanceInMeterBetween2Locations(
      currentLatitude,
      currentLongitude,
      Number(options[i].position.lat),
      Number(options[i].position.lon)
    );

    options[i].distance = distance;
  }

  options.sort((a, b) => a.distance - b.distance);
  return options;
};

export const getCurrentCoordinatesAccordingToConversationContext = (
  addressCharateristics: Partial<AddressCharacteristics>,
  conversationContext: DestinationSearchConversationContext | null
): Coordinates | undefined => {
  if (!conversationContext) {
    return undefined;
  }

  if (
    conversationContext.isNearbyRequested &&
    conversationContext.currentCoordinates
  ) {
    return conversationContext.currentCoordinates;
  }

  if (
    conversationContext.isNearbyRequested &&
    !conversationContext.currentCoordinates
  ) {
    return undefined;
  }

  if (
    !conversationContext.isNearbyRequested &&
    !conversationContext.currentCoordinates
  ) {
    return undefined;
  }

  if (!conversationContext.currentCoordinates) {
    return undefined;
  }

  if (
    (addressCharateristics.poiName ||
      addressCharateristics.poiCategories?.length > 0) &&
    addressCharateristics.city
  ) {
    return undefined;
  }

  if (
    (addressCharateristics.poiName ||
      addressCharateristics.poiCategories?.length > 0) &&
    !addressCharateristics.city
  ) {
    return conversationContext.currentCoordinates;
  }

  if (
    (addressCharateristics.poiName ||
      addressCharateristics.poiCategories?.length < 1) &&
    addressCharateristics.city
  ) {
    return undefined;
  }

  if (
    (addressCharateristics.poiName ||
      addressCharateristics.poiCategories?.length < 1) &&
    !addressCharateristics.city
  ) {
    return conversationContext.currentCoordinates;
  }

  if (
    (!addressCharateristics.poiName ||
      addressCharateristics.poiCategories?.length > 0) &&
    addressCharateristics.city
  ) {
    return undefined;
  }

  if (
    (!addressCharateristics.poiName ||
      addressCharateristics.poiCategories?.length > 0) &&
    !addressCharateristics.city
  ) {
    return conversationContext.currentCoordinates;
  }

  if (
    (!addressCharateristics.poiName ||
      addressCharateristics.poiCategories?.length < 1) &&
    addressCharateristics.city
  ) {
    return undefined;
  }

  if (
    (!addressCharateristics.poiName ||
      addressCharateristics.poiCategories?.length < 1) &&
    !addressCharateristics.city
  ) {
    return undefined;
  }

  throw new Error('Unsupoorted current coordinates case.');
};
