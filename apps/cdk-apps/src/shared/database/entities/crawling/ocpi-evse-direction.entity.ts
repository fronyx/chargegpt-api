import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OcpiEvseEntity } from '../../../index';

@Entity({ name: 'ocpi_evse_directions' })
export class OcpiEvseDirectionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  language: string;

  @Column({ nullable: true, type: 'varchar' })
  text: string;

  @ManyToOne(() => OcpiEvseEntity,
    (evse) => evse.directions,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  evse: OcpiEvseEntity;

  evsePrimaryId: string;

  constructor(args: Partial<OcpiEvseDirectionEntity>) {
    Object.assign(this, args);
  }
}
