import { OcpiConnector } from './ocpi-connector';
import { OcpiCoordinate } from './ocpi-coordinate';
import { OcpiImage } from './ocpi-image';
import { OcpiStatusSchedule } from './ocpi-status-schedule';
import { OcpiDisplayText } from './ocpi-display-text';
import { OcpiEvsePrimaryIdValue } from './ocpi-evse-primary-id-value';
import { UpdatedAtDateValue } from '../../../../models/general/updated-at-date.value';
import { isNull } from '../../../../utils/is-null.function';
import { validatePropertyOrThrowError } from '../../../../utils/validate-property-or-throw-error';
import { extractPropertyIntoPayload } from '../../../../utils/extract-property-into-payload.function';
import { EvseStatusValue } from './evse-status.value';
import {
  extractAvailablePropertyIntoPayload
} from '../../../../utils/extract-available-property-into-payload.function';

export class OcpiEvse implements Readonly<OcpiEvse> {
  primary_id: string;
  uid: string;
  evse_id: string;
  status: string;
  status_schedule: OcpiStatusSchedule[];
  capabilities: string[];
  connectors: OcpiConnector[];
  floor_level: string;
  coordinates: OcpiCoordinate;
  physical_reference: string;
  directions: OcpiDisplayText[];
  parking_restrictions: string[];
  images: OcpiImage[];
  last_updated: Date;
  locationId: string;

  private constructor(args: Partial<OcpiEvse>) {
    Object.assign(this, args);
  }

  static createFromCreatePayload(args: Partial<OcpiEvse>): OcpiEvse {
    if (isNull(args)) {
      throw new Error('Invalid input in OcpiEvse.fromCreatePayload');
    }

    validatePropertyOrThrowError({ data: args, properties: ['uid', 'locationId'] });

    const payload = extractPropertyIntoPayload({
      properties: ['uid', 'evse_id', 'floor_level', 'physical_reference', 'locationId'],
      data: args,
    });
    payload.status = EvseStatusValue.create(args.status).value;
    payload.primary_id = OcpiEvsePrimaryIdValue.create({ locationId: args.locationId!, uid: args.uid! }).value;
    payload.last_updated = UpdatedAtDateValue.create(args.last_updated ?? (args as any).updatedAt).value;
    payload.parking_restrictions = args.parking_restrictions ?? [];
    payload.capabilities = args.capabilities ?? [];
    payload.coordinates = OcpiCoordinate.create(args.coordinates);

    payload.connectors = (args.connectors ?? [])
      .map((val: any) => OcpiConnector.createFromCreatePayload({
        ...val,
        locationId: args.locationId,
        uid: args.uid,
        last_updated: val.last_updated ?? ((args as any).createdAt ?? payload.last_updated),
      }))
      .filter((val: any) => !isNull(val));

    payload.images = (args.images ?? [])
      .map((val: any) => OcpiImage.create(val))
      .filter((val: any) => !isNull(val));

    payload.directions = (args.images ?? [])
      .map((val: any) => OcpiDisplayText.create(val))
      .filter((val: any) => !isNull(val));

    payload.status_schedule = (args.status_schedule ?? [])
      .map((val: any) => OcpiStatusSchedule.create(val))
      .filter((val: any) => !isNull(val));

    return new OcpiEvse(payload);
  }

  static createFromUpdatePayload(args: Partial<OcpiEvse>): OcpiEvse {
    const createPayload = this.createFromCreatePayload(args);
    return new OcpiEvse(extractAvailablePropertyIntoPayload(createPayload));
  }

  static createPartialDto(args: Partial<OcpiEvse>): OcpiEvse {
    if (isNull(args)) {
      throw new Error('Invalid input in OcpiEvse.fromCreatePayload');
    }

    const {
      connectors,
      status_schedule,
      capabilities,
      coordinates,
      directions,
      parking_restrictions,
      images,
      ...payload
    } = this.createFromUpdatePayload(args);

    return new OcpiEvse(payload);
  }
}
