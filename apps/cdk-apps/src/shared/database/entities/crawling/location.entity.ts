import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ChargingStation, EvseEntity } from '../../../index';

@Entity({ name: 'locations' })
export class LocationEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  address: string;

  @Column({ nullable: true, type: 'varchar' })
  postal_code: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  country: string;

  @Column({ nullable: true, type: 'varchar' })
  name: string;

  @Column({ nullable: true, type: 'varchar' })
  operator_name: string;

  @Column({ nullable: true, type: 'float' })
  operator_vu_number: number;

  @Column({ nullable: true, type: 'varchar' })
  operator_hotline: string;

  @Column({ type: 'boolean' })
  is_public: boolean;

  @Column({ type: 'varchar' })
  accessibility: string;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column({ type: 'timestamptz', nullable: true })
  last_updated: Date;

  @OneToMany(
    () => EvseEntity,
    (evse) => evse.location,
    { cascade: true },
  )
  evses: EvseEntity[];

  static fromChargingStation(dto: ChargingStation): LocationEntity {
    const it = new LocationEntity();

    it.id = dto.stationid;
    it.address = dto.street;
    it.postal_code = dto.zipcode;
    it.city = dto.city;
    it.country = dto.country;
    it.name = dto.stationname;
    it.operator_name = dto.chargepointoperator;
    it.operator_vu_number = dto.operatorvunumber;
    it.operator_hotline = dto.hotlinenum;
    it.is_public = dto.ispublic;
    it.longitude = dto.longitude;
    it.latitude = dto.latitude;
    it.accessibility = dto.accessibility;
    it.last_updated = dto.createdAt;
    it.evses = dto.evses.map(val => EvseEntity.fromDto(val));

    return it;
  }
}
