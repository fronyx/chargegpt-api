import { OcpiEvse } from './ocpi-evse';
import {
  OcpiCoordinate
} from './ocpi-coordinate';
import {
  OcpiBusinessDetails
} from './ocpi-business-details';
import {
  OcpiRelatedLocation
} from './ocpi-related-location';
import {
  OcpiDisplayText
} from './ocpi-display-text';
import {
  OcpiEnergyMix
} from './ocpi-energy-mix';
import { OcpiImage } from './ocpi-image';
import { UpdatedAtDateValue } from '../../../../models/general/updated-at-date.value';
import {
  OcpiOpeningTime
} from './ocpi-opening-time';
import { isNull } from '../../../../utils/is-null.function';
import { validatePropertyOrThrowError } from '../../../../utils/validate-property-or-throw-error';
import { extractPropertyIntoPayload } from '../../../../utils/extract-property-into-payload.function';
import {
  extractAvailablePropertyIntoPayload
} from '../../../../utils/extract-available-property-into-payload.function';
import { isEmptyString } from '../../../../utils/is-empty-string.function';
import { EvsesValue } from './evses.value';
import { isEmptyArray } from '../../../../utils/is-empty-array.function';
import { OcpiCountryValue } from '../../../../models/general/ocpi-country-value';
import { getCityForLocationFunction } from '../../../../utils/get-city-for-location.function';

export class OcpiLocation implements Readonly<OcpiLocation> {
  id: string;
  type: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  coordinates: OcpiCoordinate | null;
  related_locations: OcpiRelatedLocation[];
  evses: OcpiEvse[];
  directions: OcpiDisplayText[];
  operator: OcpiBusinessDetails | null;
  suboperator: OcpiBusinessDetails | null;
  owner: OcpiBusinessDetails | null;
  facilities: string[];
  time_zone: string;
  opening_times: OcpiOpeningTime | null;
  charging_when_closed: boolean | null;
  images: OcpiImage[];
  energy_mix: OcpiEnergyMix | null;
  last_updated: string;

  static readonly requiredProperties = ['id', 'city', 'country', 'address', 'coordinates', 'last_updated'];

  private constructor(args: Partial<OcpiLocation>) {
    Object.assign(this, args);
  }

  static createFromCreatePayload(args: Partial<OcpiLocation>): OcpiLocation {
    validatePropertyOrThrowError({
      properties: ['id'],
      data: args,
    });

    const payload: Partial<OcpiLocation> = extractPropertyIntoPayload({
      properties: ['id', 'type', 'name', 'address', 'city', 'postal_code', 'country', 'time_zone', 'charging_when_closed'],
      data: args,
    });

    payload.coordinates = OcpiCoordinate.create(args.coordinates);
    payload.related_locations = args.related_locations ?? [];
    payload.evses = (args.evses ?? []).map((val: any) => {
      return OcpiEvse.createFromCreatePayload({
        ...val,
        locationId: payload.id,
      });
    });
    payload.directions = (args.directions ?? []).map((val: any) => OcpiDisplayText.create(val)).filter((val: any) => !isNull(val)) as unknown as OcpiDisplayText[];
    payload.operator = OcpiBusinessDetails.create(args.operator);
    payload.suboperator = OcpiBusinessDetails.create(args.suboperator);
    payload.owner = OcpiBusinessDetails.create(args.owner);
    payload.facilities = args.facilities ?? [];
    payload.opening_times = OcpiOpeningTime.create(args.opening_times);
    payload.images = (args.images ?? []).map((val: any) => OcpiImage.create(val)).filter((val: any) => !isNull(val)) as unknown as OcpiImage[];
    payload.energy_mix = OcpiEnergyMix.create(args.energy_mix);
    payload.last_updated = UpdatedAtDateValue.create(args.last_updated).toString();

    if (!isNull(args.country)) {
      payload.country = OcpiCountryValue.create(args.country).value;
    }

    return new OcpiLocation(payload);
  }

  static createFromPartialPayload(args: Partial<OcpiLocation>): OcpiLocation {
    const payload: Partial<OcpiLocation> = extractPropertyIntoPayload({
      properties: ['id', 'type', 'name', 'address', 'city', 'postal_code', 'country', 'time_zone', 'charging_when_closed'],
      data: args,
    });

    payload.coordinates = OcpiCoordinate.create(args.coordinates);
    payload.operator = OcpiBusinessDetails.create(args.operator);
    payload.suboperator = OcpiBusinessDetails.create(args.suboperator);
    payload.owner = OcpiBusinessDetails.create(args.owner);
    payload.facilities = args.facilities ?? [];
    payload.opening_times = OcpiOpeningTime.create(args.opening_times);
    payload.images = (args.images ?? []).map((val: any) => OcpiImage.create(val)).filter((val: any) => !isNull(val)) as unknown as OcpiImage[];
    payload.energy_mix = OcpiEnergyMix.create(args.energy_mix);
    payload.last_updated = UpdatedAtDateValue.create(args.last_updated).toString();

    if (!isNull(args.country)) {
      payload.country = OcpiCountryValue.create(args.country).value;
    }

    return new OcpiLocation(payload);
  }


  static createFromUpdatePayload(args: Partial<OcpiLocation>): OcpiLocation {
    return new OcpiLocation(extractAvailablePropertyIntoPayload(this.createFromCreatePayload(args)));
  }

  static validate(args: any): OcpiLocation | null {
    if (this.requiredProperties.some((prop: string) => {
      return isEmptyString(args[prop]);
    })) {
      return null;
    }

    const evses: any = EvsesValue.create({ evses: args.evses }).value;

    if (isEmptyArray(evses)) {
      return null;
    }

    return new OcpiLocation({
      ...args,
      evses,
    });
  }

  static async attemptFixing(args: OcpiLocation): Promise<OcpiLocation> {
    let city: string = '';
    if (isEmptyString(args.city)) {
      city = await getCityForLocationFunction({ location: args });
    } else {
      city = args.city;
    }

    return new OcpiLocation({
      ...args,
      city,
    });
  }
}
