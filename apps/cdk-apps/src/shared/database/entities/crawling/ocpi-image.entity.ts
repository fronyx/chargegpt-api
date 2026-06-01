import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OcpiEvseEntity, OcpiImage } from '../../../index';

@Entity({ name: 'ocpi_images' })
export class OcpiImageEntity {
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

  evsePrimaryId: string;

  @ManyToOne(
    () => OcpiEvseEntity,
    (evse) => evse.images,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  evse: OcpiEvseEntity;

  constructor(args: Partial<OcpiImageEntity>) {
    Object.assign(this, args);
  }

  static toEntity(args: OcpiImage): OcpiImageEntity {
    return new OcpiImageEntity(args);
  }
}
