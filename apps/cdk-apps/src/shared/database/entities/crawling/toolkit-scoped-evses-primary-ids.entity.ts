import { Column, Entity, PrimaryColumn } from 'typeorm';
import { extractAvailablePropertyIntoPayload } from '../../../utils/extract-available-property-into-payload.function';
import { OcpiEvseEntity } from './ocpi-evse.entity';
import {
  ToolkitScopedEvsesPrimaryIds
} from '../../../domain/logging/update-create/models/toolkit-scoped-evses-primary_ids';

@Entity({ name: 'toolkit_scoped_evses_primary_ids' })
export class ToolkitScopedEvsesPrimaryIdsEntity {
  @PrimaryColumn({ type: 'varchar' })
  primary_id: string;

  @Column({ nullable: true, type: 'varchar' })
  evse_id: string;

  @Column({ nullable: true, type: 'varchar' })
  evse_id_stripped: string;

  @Column({ nullable: true, type: 'varchar' })
  uid: string;

  @Column({ nullable: true, type: 'varchar' })
  location_id: string;

  @Column({ nullable: true, type: 'boolean', default: false })
  is_real_time: boolean;

  @Column({ nullable: true, type: 'boolean', default: false })
  is_chargegpt: boolean;

  @Column({ nullable: true, type: 'boolean', default: true })
  is_availability: boolean;

  constructor(args: Partial<ToolkitScopedEvsesPrimaryIdsEntity>) {
    Object.assign(this, args);
  }

  static toEntityFromCreateDto(args: ToolkitScopedEvsesPrimaryIds): ToolkitScopedEvsesPrimaryIdsEntity {
    if (!args) {
      throw new Error('Invalid input value for ToolkitScopedEvsesPrimaryIds.toEntityFromCreateDto.');
    }

    const payload: Partial<ToolkitScopedEvsesPrimaryIdsEntity> = {
      ...extractAvailablePropertyIntoPayload(args),
      evse_id_stripped: OcpiEvseEntity.cleanEvseId(args.evse_id),
    };

    return new ToolkitScopedEvsesPrimaryIdsEntity(payload);
  }
}
