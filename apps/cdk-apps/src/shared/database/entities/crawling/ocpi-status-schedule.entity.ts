import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {
  OcpiEvseEntity,
  OcpiStatusSchedule
} from '../../../index';

@Entity({ name: 'ocpi_status_schedule' })
export class OcpiStatusScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  period_begin: Date;

  @Column({ type: 'timestamptz', nullable: true })
  period_end: Date;

  @Column({ type: 'varchar' })
  status: string;

  @ManyToOne(
    () => OcpiEvseEntity,
    (evse) => evse.status_schedule,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  evse: OcpiEvseEntity;

  evsePrimaryId: string;

  constructor(args: Partial<OcpiStatusScheduleEntity>) {
    Object.assign(this, args);
  }

  static toEntity(args: OcpiStatusSchedule): OcpiStatusScheduleEntity {
    return new OcpiStatusScheduleEntity(args as any);
  }
}
