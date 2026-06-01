import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OcpiLocationEntity } from '../../../index';

@Entity({ name: 'ocpi_environmental_impacts' })
export class OcpiEnvironmentalImpactEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'float' })
  amount: number;

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

  constructor(args: Partial<OcpiEnvironmentalImpactEntity>) {
    Object.assign(this, args);
  }
}
