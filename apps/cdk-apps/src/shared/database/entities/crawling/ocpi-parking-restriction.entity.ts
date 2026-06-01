import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OcpiEvseEntity } from '../../../index';

@Entity({ name: 'ocpi_parking_restrictions' })
export class OcpiParkingRestrictionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  value: string;

  @ManyToOne(() => OcpiEvseEntity,
    (evse) => evse.parking_restrictions,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  evse: OcpiEvseEntity;

  evsePrimaryId: string;

  constructor(args: Partial<OcpiParkingRestrictionEntity>) {
    Object.assign(this, args);
  }
}
