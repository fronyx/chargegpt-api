import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { CrawlingEvse, LocationEntity } from '../../../index';

@Entity({ name: 'evses' })
export class EvseEntity {
  @PrimaryColumn({ type: 'varchar' })
  evse_id: string;

  @Column({ type: 'varchar' })
  uid: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'varchar' })
  charging_facility_type: string;

  @Column({ type: 'varchar' })
  current_type: string;

  @Column({ type: 'bool' })
  is_bookable: boolean;

  @Column({ type: 'varchar' })
  plugs: string;

  @Column({ type: 'varchar' })
  payments: string;

  @Column({ type: 'timestamptz', nullable: true })
  last_updated: Date;

  @ManyToOne(() => LocationEntity, (location) => location.evses, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  location: LocationEntity;

  @Column({ nullable: true, type: 'varchar' })
  locationId: string;

  toDto(): CrawlingEvse {
    return new CrawlingEvse(this);
  }

  static fromDto(args: {
    evsename: string;
    evseid: string;
    chargingfacilitytype: string;
    currenttype: string;
    isbookable: boolean;
    status: string;
    plugs: string;
    payments: string;
    createdAt: Date;
  }): EvseEntity {
    const it = new EvseEntity();

    it.evse_id = args.evseid;
    it.uid = args.evsename ?? args.evseid;
    it.status = args.status;
    it.charging_facility_type = args.chargingfacilitytype;
    it.current_type = args.currenttype;
    it.is_bookable = !!args.isbookable;
    it.plugs = args.plugs;
    it.payments = args.payments;
    it.last_updated = args.createdAt;

    return it;
  }
}
