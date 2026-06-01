import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OcpiEvseEntity } from '../../../index';

@Entity({ name: 'ocpi_evse_coordinates' })
export class OcpiEvseCoordinateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @OneToOne(
    () => OcpiEvseEntity,
    (evse) => evse.coordinates,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  evse: OcpiEvseEntity;

  constructor(args: Partial<OcpiEvseCoordinateEntity>) {
    Object.assign(this, args);

    this.latitude = args && args.latitude ? Number(args.latitude) : null as any;
    this.longitude = args && args.longitude ? Number(args.longitude) : null as any;
  }
}
