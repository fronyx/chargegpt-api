import { BoundingBox, BoundingBoxCoordinates } from './location-bias.model';

export const boundingBox2String = (
  boundingBox: BoundingBoxCoordinates
): BoundingBox => {
  return {
    topLeftPoint: `${boundingBox.topLeftPoint.lat},${boundingBox.topLeftPoint.lon}`,
    btmRightPoint: `${boundingBox.btmRightPoint.lat},${boundingBox.btmRightPoint.lon}`,
  };
};

export const boundingBox2GoogleBoundingBox = (
  topLeft: string,
  btmRight: string
): any => {
  if (!topLeft || !btmRight) {
    return {
      southwest: '',
      northeast: '',
    };
  }
  const topLeftPoint = topLeft.split(',');
  const btmRightPoint = btmRight.split(',');

  return {
    southwest: `${btmRightPoint[0]},${topLeftPoint[1]}`,
    northeast: `${topLeftPoint[0]},${btmRightPoint[1]}`,
  };
};
