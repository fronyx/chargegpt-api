import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import {
  OcpiConnector, OcpiEvseEntity
} from '../../../index';

@Entity({ name: 'ocpi_connectors' })
export class OcpiConnectorEntity {
  @PrimaryColumn({ type: 'varchar' })
  primary_id: string;

  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  standard: string;

  @Column({ type: 'varchar' })
  format: string;

  @Column({ type: 'varchar' })
  power_type: string;

  @Column({ type: 'float', nullable: true })
  power_kw: number;

  @Column({ type: 'float' })
  voltage: number;

  @Column({ type: 'float' })
  amperage: number;

  @Column({ nullable: true, type: 'varchar' })
  tariff_id: string;

  @Column({ nullable: true, type: 'varchar' })
  terms_and_conditions: string;

  @Column({ type: 'timestamptz', nullable: true })
  last_updated: Date;

  @ManyToOne(() => OcpiEvseEntity,
    (evse) => evse.connectors,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  evse: OcpiEvseEntity;

  @Column({ nullable: true, type: 'varchar' })
  evsePrimaryId: string;

  constructor(args: Partial<OcpiConnectorEntity>) {
    Object.assign(this, args);
  }

  static toEntity(args: Partial<OcpiConnector>): OcpiConnectorEntity {
    const {
      uid,
      locationId,
      ...connector
    } = args;

    if (!connector.power_kw && !!connector.amperage && !!connector.voltage) {
      if (connector.power_type === 'DC') {
        connector.power_kw = Number(connector.amperage) * Number(connector.voltage) / 1000;
      } else {
        connector.power_kw = Number(connector.amperage) * 3 * 230 / 1000;
      }
    }

    return new OcpiConnectorEntity(connector);
  }

  toDto(): OcpiConnector {
    return OcpiConnector.createFromUpdatePayload(this);
  }
}
