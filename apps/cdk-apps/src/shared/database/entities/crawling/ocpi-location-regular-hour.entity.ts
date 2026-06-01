import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OcpiLocationEntity } from '../../../index';

@Entity({ name: 'ocpi_location_regular_hours' })
export class OcpiLocationRegularHourEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'int' })
  weekday: number;

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

  constructor(args: Partial<OcpiLocationRegularHourEntity>) {
    Object.assign(this, args);
  }
}
