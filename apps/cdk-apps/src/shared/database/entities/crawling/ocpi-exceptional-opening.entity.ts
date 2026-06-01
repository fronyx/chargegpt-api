import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OcpiLocationEntity } from '../../../index';

@Entity({ name: 'ocpi_exceptional_openings' })
export class OcpiExceptionalOpeningEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  period_begin: string;

  @Column({ nullable: true, type: 'varchar' })
  period_end: string;

  @ManyToOne(
    () => OcpiLocationEntity,
    (location) => location.evses,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  location: OcpiLocationEntity;

  constructor(args: Partial<OcpiExceptionalOpeningEntity>) {
    Object.assign(this, args);
  }
}
