import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EvseReportRequest, PredictionsEvseReport } from '../../../index';
import {
  PredictionsReportRequestEntity
} from './index';

@Entity({ name: 'evse_report' })
export class PredictionsEvseReportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  evse: string;

  @Column({ type: 'float' })
  distance: number;

  @Column({ type: 'varchar' })
  predicted_status: string;

  @Column({ nullable: true, type: 'varchar' })
  current_status: string;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'timestamptz', nullable: true })
  created_at: Date;

  @ManyToOne(() => PredictionsReportRequestEntity, (reportRequest) => reportRequest.evses, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  report_request: PredictionsReportRequestEntity;

  static fromRequest(args: EvseReportRequest): PredictionsEvseReportEntity {
    const it = new PredictionsEvseReportEntity();

    it.evse = args.evse;
    it.distance = args.distance;
    it.predicted_status = args.status;
    it.location = args.location;
    it.created_at = new Date();

    return it;
  }

  static from(args: PredictionsEvseReport): PredictionsEvseReportEntity {
    const it = new PredictionsEvseReportEntity();

    it.id = args.id;
    it.evse = args.evse;
    it.distance = args.distance;
    it.predicted_status = args.predicted_status;
    it.current_status = args.current_status;
    it.location = args.location;
    it.created_at = new Date();

    return it;
  }

  toReportResult(): PredictionsEvseReport {
    return new PredictionsEvseReport(this);
  }
}
