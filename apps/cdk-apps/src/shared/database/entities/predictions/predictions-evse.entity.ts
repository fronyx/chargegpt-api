import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'evse' })
export class PredictionsEvseEntity {
  @PrimaryColumn({ type: 'varchar' })
  evse: string;

  @Column({ type: 'varchar' })
  station_id: string;

  @Column({ type: 'varchar' })
  country: string;

  @Column({ type: 'varchar' })
  @Index()
  city: string;

  @Column({ type: 'varchar' })
  zipcode: string;

  @Column({ type: 'varchar' })
  street: string;

  @Column({ type: 'float' })
  longitude: number;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'varchar' })
  charging_facility_type: string;

  @Column({ type: 'varchar' })
  current_type: string;

  @Column({ type: 'varchar' })
  plug_type: string;

  @Column({ type: 'varchar' })
  station_name: string;
}
