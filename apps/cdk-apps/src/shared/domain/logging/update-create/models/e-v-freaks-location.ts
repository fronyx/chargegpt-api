import { UpdatedAtDateValue } from '../../../../models/general/updated-at-date.value';
import {
  OcpiLocation
} from './ocpi-location';
import { OcpiLocationCoordinates } from './ocpi-location-coordinates';
import { isNull } from '../../../../utils/is-null.function';

export class EVFreaksLocation implements Readonly<EVFreaksLocation> {
  id: string;
  peerID: string;
  partyID: string;
  countryCode: string;
  locationID: string;
  rank: number;
  operatorName: string;
  updatedAt: Date;
  powerLevel: number;
  powerLevels: string[];
  plugs: string[];
  location: OcpiLocationCoordinates;
  ocpi: OcpiLocation;
  name: string;
  _primary: boolean;

  constructor(args: Partial<EVFreaksLocation>) {
    Object.assign(this, args);

    if (isNull(args.locationID)) {
      this.locationID = args.id!;
      this.ocpi.id = args.id!;
    }

    this.location = new OcpiLocationCoordinates(args.location!);
    this.updatedAt = UpdatedAtDateValue.create(args.updatedAt).value;
    this.ocpi = OcpiLocation.createFromCreatePayload(args.ocpi!);
  }

  static createPartialDto(args: Partial<EVFreaksLocation>): EVFreaksLocation {
    if (isNull(args)) {
      throw new Error('Invalid input in EVFreaksLocation.createPartialDto');
    }

    const {
      location,
      powerLevels,
      plugs,
      peer,
      company,
      ocpi: {
        related_locations,
        evses,
        directions,
        facilities,
        opening_times,
        images,
        energy_mix,
        ...ocpiPayload
      },
      ...topLevelPayload
    } = new EVFreaksLocation(args) as any;

    const payload: EVFreaksLocation = {
      ...topLevelPayload,
      ocpi: ocpiPayload,
    } as unknown as EVFreaksLocation;

    return payload;
  }
}
