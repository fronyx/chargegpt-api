import { IsDateString, IsNumberString, IsString } from 'class-validator';
import { isNull } from '../../../../utils/is-null.function';
import {
  extractAvailablePropertyIntoPayload
} from '../../../../utils/extract-available-property-into-payload.function';
import { UpdatedAtDateValue } from '../../../../models/general/updated-at-date.value';
import { OcpiEvsePrimaryIdValue } from './ocpi-evse-primary-id-value';

export class OcpiStatusLog implements Readonly<OcpiStatusLog> {
  @IsString()
  evse_id: string;

  @IsString()
  uid: string;

  @IsString()
  evse_primary_id: string;

  @IsString()
  status: string;

  @IsDateString()
  last_updated: string | Date;

  @IsString()
  location_id: string;

  private constructor(args: Partial<OcpiStatusLog>) {
    Object.assign(this, args);
  }

  static create(args: Partial<OcpiStatusLog>) {
    if (isNull(args)) {
      throw new Error('Invalid input at OcpiStatusLog.createFromProcessedPredictionMessage.');
    }

    const {
      latitude,
      longitude,
      postal_code,
      city,
      country,
      ...payload
    } = extractAvailablePropertyIntoPayload(args) as any;
    if (payload.evse_primary_id) {
      payload.evse_primary_id = OcpiEvsePrimaryIdValue.createFromPrimaryId({
        primaryId: payload.evse_primary_id!,
      }).value;
    } else {
      payload.evse_primary_id = OcpiEvsePrimaryIdValue.create({
        locationId: payload.location_id!,
        uid: payload.uid!
      }).value;
    }
    
    payload.last_updated = UpdatedAtDateValue.create(args.last_updated).toString();

    return new OcpiStatusLog(payload);
  }
}
