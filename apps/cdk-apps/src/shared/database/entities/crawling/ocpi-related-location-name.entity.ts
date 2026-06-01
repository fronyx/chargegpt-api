import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { isNull } from '../../../utils/is-null.function';
import { isObjectEmpty } from '../../../utils/is-object-empty.function';
import {
  extractAvailablePropertyIntoPayload
} from '../../../utils/extract-available-property-into-payload.function';
import { OcpiRelatedLocationEntity } from '../../../index';

@Entity({ name: 'ocpi_related_location_names' })
export class OcpiRelatedLocationNameEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  language: string;

  @Column({ nullable: true, type: 'varchar' })
  text: string;

  @ManyToOne(
    () => OcpiRelatedLocationEntity,
    (relatedLocation) => relatedLocation.name,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  related_location: OcpiRelatedLocationEntity;

  constructor(args: Partial<OcpiRelatedLocationNameEntity>) {
    Object.assign(this, args);
  }

  static create(args: Partial<OcpiRelatedLocationNameEntity>): OcpiRelatedLocationNameEntity | null {
    if (isNull(args)) {
      return null;
    }

    const payload = extractAvailablePropertyIntoPayload(args);

    if (isObjectEmpty(payload)) {
      return null;
    }

    return new OcpiRelatedLocationNameEntity(payload);
  }
}
