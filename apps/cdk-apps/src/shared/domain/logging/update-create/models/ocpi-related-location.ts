import { OcpiDisplayText } from './ocpi-display-text';
import { IsNumberString, IsString } from 'class-validator';
import { extractPropertyIntoPayload } from '../../../../utils/extract-property-into-payload.function';
import { isObjectEmpty } from '../../../../utils/is-object-empty.function';
import { isNull } from '../../../../utils/is-null.function';

export class OcpiRelatedLocation implements Readonly<OcpiRelatedLocation> {
  @IsString()
  id: string;

  @IsNumberString()
  longitude: string | number;

  @IsNumberString()
  latitude: string | number;

  name: OcpiDisplayText[];

  constructor(args: Partial<OcpiRelatedLocation>) {
    Object.assign(this, args);
  }

  static create(args: Partial<OcpiRelatedLocation>) {
    const payload = extractPropertyIntoPayload({
      properties: ['id', 'longitude', 'latitude', 'name'],
      data: args,
    });

    if (isObjectEmpty(payload)) {
      return null;
    }

    if (!isNull(payload.latitude)) {
      payload.latitude = String(payload.latitude);
    }

    if (!isNull(payload.longitude)) {
      payload.longitude = String(payload.longitude);
    }

    return new OcpiRelatedLocation(args);
  }
}
