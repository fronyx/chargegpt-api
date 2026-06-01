import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OcpiLocationEntity } from '../../../index';

@Entity({ name: 'ocpi_location_images' })
export class OcpiLocationImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  url: string;

  @Column({ nullable: true, type: 'varchar' })
  thumbnail: string;

  @Column({ nullable: true, type: 'varchar' })
  category: string;

  @Column({ nullable: true, type: 'varchar' })
  type: string;

  @Column({ nullable: true, type: 'float' })
  width: number;

  @Column({ nullable: true, type: 'float' })
  height: number;

  @ManyToOne(
    () => OcpiLocationEntity,
    (location) => location.evses,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  location: OcpiLocationEntity;

  constructor(args: Partial<OcpiLocationImageEntity>) {
    Object.assign(this, args);
  }
}
