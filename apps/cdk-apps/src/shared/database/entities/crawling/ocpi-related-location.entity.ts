import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {
  OcpiLocationEntity,
  OcpiRelatedLocation, OcpiRelatedLocationNameEntity
} from '../../../index';
import { isNull } from '../../../utils/is-null.function';
import {
  extractAvailablePropertyIntoPayload
} from '../../../utils/extract-available-property-into-payload.function';

@Entity({ name: 'ocpi_related_locations' })
export class OcpiRelatedLocationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(
    () => OcpiRelatedLocationNameEntity,
    (name) => name.related_location,
    { cascade: true, eager: true },
  )
  name: OcpiRelatedLocationNameEntity[];

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @ManyToOne(
    () => OcpiLocationEntity,
    (location) => location.evses,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    })
  location: OcpiLocationEntity;

  private constructor(args: Partial<OcpiRelatedLocationEntity>) {
    Object.assign(this, args);
  }

  static create(args: Partial<OcpiRelatedLocation>): OcpiRelatedLocationEntity | null {
    if (isNull(args)) {
      return null;
    }

    const payload: Partial<OcpiRelatedLocationEntity> = extractAvailablePropertyIntoPayload(args);
    payload.name = (args.name ?? []).map(val => OcpiRelatedLocationNameEntity.create(val)) as any;

    if (!isNull(payload.latitude)) {
      payload.latitude = Number(payload.latitude);
    }

    if (!isNull(payload.longitude)) {
      payload.longitude = Number(payload.longitude);
    }

    return new OcpiRelatedLocationEntity(payload);
  }
}
