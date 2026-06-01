import { ICoordinate } from './coordinate.interface';

export interface IGrid {
  topLeft: ICoordinate;
  topRight: ICoordinate;
  bottomLeft: ICoordinate;
  bottomRight: ICoordinate;
}
