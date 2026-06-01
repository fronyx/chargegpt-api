import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { isNull } from '../../../utils/is-null.function';
import { UpdatedAtDateValue } from '../../../models/general/updated-at-date.value';
import { isEmptyArray } from '../../../utils/is-empty-array.function';
import {
  extractAvailablePropertyIntoPayload
} from '../../../utils/extract-available-property-into-payload.function';
import {
  getNumberIfNotNullFunction
} from '../../../utils/get-number-if-not-null.function';
import {
  EVFreaksLocation,
  OcpiBusinessDetails,
  OcpiCoordinate,
  OcpiDirectionEntity,
  OcpiDisplayText,
  OcpiEnergyMix, OcpiEnergySourceEntity, OcpiEnvironmentalImpactEntity,
  OcpiEvseEntity, OcpiExceptionalClosingEntity, OcpiExceptionalOpeningEntity,
  OcpiImage,
  OcpiLocation,
  OcpiLocationCoordinates, OcpiLocationImageEntity,
  OcpiLocationRegularHourEntity,
  OcpiOpeningTime,
  OcpiRelatedLocation,
  OcpiRelatedLocationEntity
} from '../../../index';

@Entity({ name: 'ocpi_locations' })
export class OcpiLocationEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  id_stripped: string;

  @Column({ nullable: true, type: 'varchar' })
  type: string;

  @Column({ nullable: true, type: 'varchar' })
  name: string;

  @Column({ nullable: true, type: 'varchar' })
  address: string;

  @Column({ nullable: true, type: 'varchar' })
  city: string;

  @Column({ nullable: true, type: 'varchar' })
  postal_code: string;

  @Column({ nullable: true, type: 'varchar' })
  @Index()
  country: string; // ISO 3166-1 alpha-3 code for the country of this location.

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @OneToMany(
    () => OcpiRelatedLocationEntity,
    (relatedLocation) => relatedLocation.location,
    { cascade: true, eager: true },
  )
  related_locations: OcpiRelatedLocationEntity[];

  @OneToMany(
    () => OcpiEvseEntity,
    (evse) => evse.location,
    { cascade: ['insert', 'update', 'remove'], eager: true },
  )
  evses: OcpiEvseEntity[];

  @OneToMany(
    () => OcpiDirectionEntity,
    (direction) => direction.location,
    { cascade: true, eager: true },
  )
  directions: OcpiDirectionEntity[];

  @Column({ nullable: true, type: 'varchar' })
  operator_name: string;

  @Column({ nullable: true, type: 'varchar' })
  operator_hotline: string;

  @Column({ nullable: true, type: 'varchar' })
  operator_website: string;

  @Column({ nullable: true, type: 'varchar' })
  operator_logo: string;

  @Column({ nullable: true, type: 'varchar' })
  suboperator_name: string;

  @Column({ nullable: true, type: 'varchar' })
  suboperator_hotline: string;

  @Column({ nullable: true, type: 'varchar' })
  suboperator_website: string;

  @Column({ nullable: true, type: 'varchar' })
  suboperator_logo: string;

  @Column({ nullable: true, type: 'varchar' })
  owner_name: string;

  @Column({ nullable: true, type: 'varchar' })
  owner_hotline: string;

  @Column({ nullable: true, type: 'varchar' })
  owner_website: string;

  @Column({ nullable: true, type: 'varchar' })
  owner_logo: string;

  @Column({ nullable: true, type: 'varchar' })
  facilities: string;

  @Column({ nullable: true, type: 'varchar' })
  time_zone: string;

  @OneToMany(
    () => OcpiLocationRegularHourEntity,
    (regularHour) => regularHour.location,
    { cascade: true, eager: true },
  )
  regular_hours: OcpiLocationRegularHourEntity[];

  @Column({ nullable: true, type: 'bool' })
  twentyfourseven: boolean;

  @OneToMany(
    () => OcpiExceptionalOpeningEntity,
    (exceptionalOpening) => exceptionalOpening.location,
    { cascade: true, eager: true },
  )
  exceptional_openings: OcpiExceptionalOpeningEntity[];

  @OneToMany(
    () => OcpiExceptionalClosingEntity,
    (exceptionalClosing) => exceptionalClosing.location,
    { cascade: true, eager: true },
  )
  exceptional_closings: OcpiExceptionalClosingEntity[];

  @Column({ nullable: true, type: 'bool' })
  charging_when_closed: boolean;

  @OneToMany(
    () => OcpiLocationImageEntity,
    (image) => image.location,
    { cascade: true, eager: true },
  )
  images: OcpiLocationImageEntity[];

  @Column({ nullable: true, type: 'bool' })
  is_green_energy: boolean;

  @Column({ nullable: true, type: 'varchar' })
  supplier_name: string;

  @Column({ nullable: true, type: 'varchar' })
  energy_product_name: string;

  @OneToMany(
    () => OcpiEnvironmentalImpactEntity,
    (environmentalImpact) => environmentalImpact.location,
    { cascade: true, eager: true },
  )
  environ_impact: OcpiEnvironmentalImpactEntity[];

  @OneToMany(
    () => OcpiEnergySourceEntity,
    (energySource) => energySource.location,
    { cascade: true, eager: true },
  )
  energy_sources: OcpiEnergySourceEntity[];

  @Column({ type: 'timestamptz', nullable: true })
  last_updated: Date;

  @Column({ nullable: true, type: 'varchar' })
  frk_peer_id: string;

  @Column({ nullable: true, type: 'varchar' })
  frk_party_id: string;

  @Column({ nullable: true, type: 'varchar' })
  frk_country_code: string;

  @Column({ nullable: true, type: 'varchar' })
  frk_location_id: string;

  @Column({ nullable: true, type: 'varchar' })
  frk_name: string;

  @Column({ type: 'float', nullable: true })
  frk_rank: number;

  @Column({ nullable: true, type: 'varchar' })
  frk_operator_name: string;

  @Column({ nullable: true, type: 'varchar' })
  frk_power_levels: string;

  @Column({ nullable: true, type: 'varchar' })
  frk_plugs: string;

  @Column({ nullable: true, type: 'varchar' })
  frk_location_coordinates: string;

  @Column({ nullable: true, type: 'varchar' })
  frk_location_type: string;

  constructor(args: Partial<OcpiLocationEntity>) {
    Object.assign(this, args);
  }

  static fromEvfreaksPayload(args: EVFreaksLocation): OcpiLocationEntity {
    const ocpiLocation = this.toEntityFromCreateDto(args.ocpi);

    return this.combineEVFreaksWithOcpiIntoEntity({
      evFreaksLocation: args,
      ocpi: ocpiLocation,
    });
  }

  static fromEvfreaksPartialPayload(args: EVFreaksLocation): OcpiLocationEntity {
    const ocpi = this.toEntityFromUpdateDto(args.ocpi);
    const {
      coordinates,
      __t,
      ...evFreaksLocation
    } = args as any;
    return this.combineEVFreaksWithOcpiIntoEntity({
      evFreaksLocation,
      ocpi,
    });
  }

  static combineEVFreaksWithOcpiIntoEntity(args: {
    evFreaksLocation: EVFreaksLocation,
    ocpi: OcpiLocationEntity,
  }): OcpiLocationEntity {
    return new OcpiLocationEntity({
      ...args.ocpi,
      frk_peer_id: args.evFreaksLocation.peerID,
      frk_party_id: args.evFreaksLocation.partyID,
      frk_country_code: args.evFreaksLocation.countryCode,
      frk_location_id: args.evFreaksLocation.locationID,
      frk_name: args.evFreaksLocation.name,
      frk_rank: args.evFreaksLocation.rank,
      frk_operator_name: args?.evFreaksLocation.operatorName,
      frk_power_levels: (args?.evFreaksLocation.powerLevels ?? []).join(','),
      frk_plugs: (args.evFreaksLocation.plugs ?? []).join(','),
      frk_location_type: args?.evFreaksLocation.location?.type,
      frk_location_coordinates: (args?.evFreaksLocation.location?.coordinates ?? []).join(','),
      last_updated: args.evFreaksLocation.updatedAt ? args.evFreaksLocation.updatedAt : args.ocpi.last_updated,
    });
  }

  static toEntityFromCreateDto(args: Partial<OcpiLocation>): OcpiLocationEntity {
    if (!args) {
      throw new Error('Invalid input value for OcpiLocationEntity.toEntityFromCreateDto.');
    }

    const payload: Partial<OcpiLocationEntity> = extractAvailablePropertyIntoPayload(args);
    payload.id_stripped = cleanId(payload.id!);
    payload.related_locations = (args.related_locations ?? []).map(val => OcpiRelatedLocationEntity.create(val)).filter((val: any) => !isNull(val)) as any;
    payload.last_updated = UpdatedAtDateValue.create(args.last_updated).value;
    payload.facilities = !isEmptyArray(args.facilities) ? (args as any).facilities.join(',') : null;

    if (args.coordinates) {
      payload.latitude = getNumberIfNotNullFunction(args.coordinates.latitude) as any;
      payload.longitude = getNumberIfNotNullFunction(args.coordinates.longitude) as any;
    }

    if (args.operator) {
      payload.operator_name = args.operator.name;
      payload.operator_hotline = args.operator.hotline;
      payload.operator_logo = args.operator.logo;
      payload.operator_website = args.operator.website;
    }

    if (args.suboperator) {
      payload.suboperator_name = args.suboperator.name;
      payload.suboperator_hotline = args.suboperator.hotline;
      payload.suboperator_logo = args.suboperator.logo;
      payload.suboperator_website = args.suboperator.website;
    }

    if (args.owner) {
      payload.owner_name = args.owner.name;
      payload.owner_hotline = args.owner.hotline;
      payload.owner_logo = args.owner.logo;
      payload.owner_website = args.owner.website;
    }

    if (!isEmptyArray(args.evses)) {
      payload.evses = (args as any).evses.map((val: any) => OcpiEvseEntity.toEntityFromCreateDto({
        ...val,
        locationId: args.id,
      }));
    }

    if (!isNull(args.energy_mix)) {
      payload.is_green_energy = (args as any).energy_mix.is_green_energy;
      payload.supplier_name = (args as any).energy_mix.supplier_name;
      payload.energy_product_name = (args as any).energy_mix.energy_product_name;
      payload.environ_impact = ((args as any).energy_mix.environ_impact ?? []).map((val: any) => new OcpiEnvironmentalImpactEntity(val));
      payload.energy_sources = ((args as any).energy_mix.energy_sources ?? []).map((val: any) => new OcpiEnergySourceEntity(val));
    }

    if (!isEmptyArray(args.directions)) {
      payload.directions = (args as any).directions.map((val: any) => new OcpiDirectionEntity(val));
    }

    if (!isNull(args.opening_times)) {
      payload.twentyfourseven = (args as any).opening_times.twentyfourseven;

      if (!isEmptyArray((args as any).opening_times.regular_hours)) {
        payload.regular_hours = (args as any).opening_times.regular_hours.map((val: any) => new OcpiLocationRegularHourEntity(val));
      }

      if (!isEmptyArray((args as any).opening_times.exceptional_openings)) {
        payload.exceptional_openings = (args as any).opening_times.exceptional_openings.map((val: any) => new OcpiExceptionalOpeningEntity(val));
      }

      if (!isEmptyArray((args as any).opening_times.exceptional_closings)) {
        payload.exceptional_closings = (args as any).opening_times.exceptional_closings.map((val: any) => new OcpiExceptionalClosingEntity(val));
      }
    }

    if (!isNull(args.charging_when_closed)) {
      payload.charging_when_closed = (args as any).charging_when_closed;
    }

    if (!isEmptyArray(args.images)) {
      payload.images = (args as any).images.map((val: any) => new OcpiLocationImageEntity(val));
    }

    return new OcpiLocationEntity(payload);
  }

  static toEntityFromUpdateDto(args: Partial<OcpiLocation>): OcpiLocationEntity {
    const createFromDtoPayload = this.toEntityFromCreateDto(args);

    const {
      coordinates,
      operator,
      suboperator,
      owner,
      opening_times,
      energy_mix,
      ...payload
    } = extractAvailablePropertyIntoPayload(createFromDtoPayload);

    return new OcpiLocationEntity(extractAvailablePropertyIntoPayload(payload));
  }

  toDto(): OcpiLocation {
    const payload: Partial<OcpiLocation> = {
      ...this,
      coordinates: OcpiCoordinate.create(this),
      related_locations: this.related_locations.map(val => OcpiRelatedLocation.create(val)).filter((val: any) => !isNull(val)),
      evses: (this.evses ?? []).map((val) => new OcpiEvseEntity(val).toDto()),
      directions: (this.directions ?? []).map(val => OcpiDisplayText.create(val)),
      operator: OcpiBusinessDetails.create({
        name: this.operator_name,
        hotline: this.operator_hotline,
        website: this.operator_website,
        logo: this.operator_logo,
      }),
      suboperator: OcpiBusinessDetails.create({
        name: this.suboperator_name,
        hotline: this.suboperator_hotline,
        website: this.suboperator_website,
        logo: this.suboperator_logo,
      }),
      owner: OcpiBusinessDetails.create({
        name: this.owner_name,
        hotline: this.owner_hotline,
        website: this.owner_website,
        logo: this.owner_logo,
      }),
      facilities: (this.facilities ?? '').split(','),
      time_zone: this.time_zone,
      opening_times: OcpiOpeningTime.create(this),
      charging_when_closed: this.charging_when_closed,
      images: (this.images ?? []).map(val => OcpiImage.create(val)).filter((val: any) => !isNull(val)),
      energy_mix: OcpiEnergyMix.create(this),
      last_updated: UpdatedAtDateValue.create(this.last_updated).toString(),
    };

    return OcpiLocation.createFromUpdatePayload(extractAvailablePropertyIntoPayload(payload));
  }

  toEnrichedLocation(): EVFreaksLocation {
    return new EVFreaksLocation({
      peerID: this.frk_peer_id,
      partyID: this.frk_party_id,
      countryCode: this.frk_country_code,
      locationID: this.frk_location_id,
      rank: this.frk_rank,
      operatorName: this.frk_operator_name,
      powerLevels: (this.frk_power_levels ?? '').split(','),
      plugs: (this.frk_plugs ?? '').split(','),
      location: new OcpiLocationCoordinates({
        coordinates: (this.frk_location_coordinates ?? '').split(','),
        type: this.frk_location_type
      }),
      name: this.frk_name,
      ocpi: this.toDto(),
    });
  }
}

export const cleanId = (id: string): string => {
  return id.replace(/[_,\s,*,+,-]/g, '').toLowerCase();
}