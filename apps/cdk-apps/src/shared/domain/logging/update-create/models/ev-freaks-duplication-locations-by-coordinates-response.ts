import { OcpiCoordinate } from './ocpi-coordinate';

export class EvFreaksDuplicationLocationsByCoordinatesResponse implements Readonly<EvFreaksDuplicationLocationsByCoordinatesResponse> {
  coordinates: OcpiCoordinate;
  locationId: string;
  peerID: string;
  isDuplicated: boolean;

  constructor(args: Partial<EvFreaksDuplicationLocationsByCoordinatesResponse>) {
    Object.assign(this, args);
  }
}
