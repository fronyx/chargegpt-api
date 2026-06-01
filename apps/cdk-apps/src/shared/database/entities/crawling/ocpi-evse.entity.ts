import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import {
  NumberValue,
  OcpiConnector, OcpiConnectorEntity,
  OcpiCoordinate,
  OcpiDisplayText,
  OcpiEvse, OcpiEvseCoordinateEntity, OcpiEvseDirectionEntity,
  OcpiEvseEntityCapabilityValue,
  OcpiImage, OcpiImageEntity, OcpiLocationEntity, OcpiParkingRestrictionEntity,
  OcpiStatusSchedule,
  OcpiStatusScheduleEntity
} from '../../../index';
import { isNull } from '../../../utils/is-null.function';
import { UpdatedAtDateValue } from '../../../models/general/updated-at-date.value';
import {
  extractAvailablePropertyIntoPayload
} from '../../../utils/extract-available-property-into-payload.function';
import { isEmptyString } from '../../../utils/is-empty-string.function';
import { isObjectEmpty } from '../../../utils/is-object-empty.function';
import { isEmptyArray } from '../../../utils/is-empty-array.function';
import { cleanId } from './ocpi-location.entity';

@Entity({ name: 'ocpi_evses' })
export class OcpiEvseEntity {
  @PrimaryColumn({ type: 'varchar' })
  primary_id: string;

  @Column({ type: 'varchar' })
  uid: string;

  @Column({ nullable: true, type: 'varchar' })
  evse_id: string;

  @Column({ nullable: true, type: 'varchar' })
  evse_id_stripped: string;

  @Column({ type: 'varchar' })
  status: string;

  @OneToMany(
    () => OcpiStatusScheduleEntity,
    (statusSchedule) => statusSchedule.evse,
    { cascade: true, eager: true }
  )
  status_schedule: OcpiStatusScheduleEntity[];

  @Column({ nullable: true, type: 'varchar' })
  capabilities: string;

  @OneToMany(
    () => OcpiConnectorEntity,
    (connector) => connector.evse,
    {
      cascade: ['insert', 'update', 'remove'],
      eager: true,
    },
  )
  connectors: OcpiConnectorEntity[];

  @Column({ nullable: true, type: 'varchar' })
  floor_level: string;

  @OneToOne(
    () => OcpiEvseCoordinateEntity,
    coordinates => coordinates.evse,
    { eager: true, onDelete: 'CASCADE', cascade: true })
  @JoinColumn()
  coordinates: OcpiEvseCoordinateEntity;

  @Column({ nullable: true, type: 'varchar' })
  physical_reference: string;

  @OneToMany(
    () => OcpiEvseDirectionEntity,
    (direction) => direction.evse,
    { cascade: true, eager: true },
  )
  directions: OcpiEvseDirectionEntity[];

  @OneToMany(
    () => OcpiParkingRestrictionEntity,
    (parkingRestriction) => parkingRestriction.evse,
    { cascade: true, eager: true },
  )
  parking_restrictions: OcpiParkingRestrictionEntity[];

  @OneToMany(
    () => OcpiImageEntity,
    (image) => image.evse,
    { cascade: true, eager: true },
  )
  images: OcpiImageEntity[];

  @Column({ type: 'timestamptz', nullable: true })
  last_updated: Date;

  @ManyToOne(
    () => OcpiLocationEntity,
    (location) => location.evses,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  location: OcpiLocationEntity;

  @Column({ nullable: true, type: 'varchar' })
  locationId: string;

  constructor(args: Partial<OcpiEvseEntity>) {
    Object.assign(this, args);
  }

  static toEntityFromCreateDto(args: OcpiEvse): OcpiEvseEntity {
    if (!args) {
      throw new Error('Invalid input value for OcpiEvse.toEntityFromCreateDto.');
    }

    const payload: Partial<OcpiEvseEntity> = {
      ...extractAvailablePropertyIntoPayload(args),
      evse_id_stripped: isNull(args.evse_id) ? null : this.cleanEvseId(args.evse_id),
      capabilities: OcpiEvseEntityCapabilityValue.create({ capabilities: args.capabilities }).value,
      last_updated: UpdatedAtDateValue.create(args.last_updated).value,
    };

    if (!isEmptyArray(args.status_schedule)) {
      payload.status_schedule = args.status_schedule.map(val => new OcpiStatusScheduleEntity(val as any));
    }

    if (!isEmptyArray(args.connectors)) {
      payload.connectors = args.connectors.map((val) => OcpiConnectorEntity.toEntity(val));
    }

    if (!isEmptyArray(args.directions)) {
      payload.directions = args.directions.map(val => new OcpiEvseDirectionEntity(val));
    }

    if (!isEmptyArray(args.parking_restrictions)) {
      payload.parking_restrictions = args.parking_restrictions.map(value => new OcpiParkingRestrictionEntity({ value }));
    }

    if (!isEmptyArray(args.images)) {
      payload.images = args.images.map((val) => OcpiImageEntity.toEntity(val));
    }

    if (!isObjectEmpty(args.coordinates)) {
      payload.coordinates = new OcpiEvseCoordinateEntity({
        latitude: NumberValue.create(args.coordinates.latitude).value,
        longitude: NumberValue.create(args.coordinates.longitude).value,
      });
    }

    return new OcpiEvseEntity(payload);
  }

  static toEntityFromUpdateDto(args: OcpiEvse): OcpiEvseEntity {
    const payload = extractAvailablePropertyIntoPayload(this.toEntityFromCreateDto(args));
    return new OcpiEvseEntity(payload);
  }

  static cleanEvseId(evseId: string): string {
    return cleanId(evseId);
  }

  toDto(): OcpiEvse {
    const payload: Partial<OcpiEvse> = {
      ...this,
      status_schedule: (this.status_schedule ?? []).map((val) => OcpiStatusSchedule.create(val)).filter((val: any) => !isNull(val)),
      connectors: (this.connectors ?? []).map(val => OcpiConnector.createFromCreatePayload({
        ...val,
        locationId: this.locationId,
        uid: this.uid
      })),
      capabilities: !isNull(this.capabilities) ? this.capabilities.split(',').filter(val => !isEmptyString(val)) : null,
      coordinates: OcpiCoordinate.create(this.coordinates),
      directions: (this.directions ?? []).map(val => OcpiDisplayText.create(val)).filter((val: any) => !isNull(val)),
      parking_restrictions: (this.parking_restrictions ?? []).map(({ value }) => value).filter((val: any) => !isNull(val)),
      images: (this.images ?? []).map(val => OcpiImage.create(val)).filter((val: any) => !isNull(val)),
    };

    return OcpiEvse.createFromUpdatePayload(extractAvailablePropertyIntoPayload(payload));
  }
}
