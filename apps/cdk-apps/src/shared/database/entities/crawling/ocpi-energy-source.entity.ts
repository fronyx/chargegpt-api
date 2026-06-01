import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OcpiLocationEntity } from '../../../index';

@Entity({ name: 'ocpi_energy_sources' })
export class OcpiEnergySourceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'float' })
  percentage: number;

  @Column({ nullable: true, type: 'varchar' })
  source: string;

  @ManyToOne(
    () => OcpiLocationEntity,
    (location) => location.evses,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  location: OcpiLocationEntity;

  constructor(args: Partial<OcpiEnergySourceEntity>) {
    Object.assign(this, args);

    this.percentage = args && args.percentage ? Number(args.percentage) : null as any;
  }
}
