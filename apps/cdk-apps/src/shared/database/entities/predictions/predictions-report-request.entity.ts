import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PredictionsReportRequest, ReportRequest } from '../../../index';
import { PredictionsEvseReportEntity } from './predictions-evse-report.entity';

@Entity({ name: 'report_request' })
export class PredictionsReportRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  duration_from_last_searched: string;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'varchar' })
  arrival_time: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  is_sent: boolean;

  @Column({ nullable: true, type: 'float' })
  timeframe: number;

  @Column({ type: 'timestamptz', nullable: true })
  deliver_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  created_at: Date;

  @OneToMany(() => PredictionsEvseReportEntity, (evseReport) => evseReport.report_request, {
    cascade: true,
  })
  evses: PredictionsEvseReportEntity[];

  static fromRequest(args: ReportRequest): PredictionsReportRequestEntity {
    const it = new PredictionsReportRequestEntity();

    it.duration_from_last_searched = args.human_readable_time_from_now;
    it.location = args.location;
    it.arrival_time = args.arrival_time;
    it.timeframe = args.timeframe;
    it.email = args.email;
    it.created_at = args.created_at;
    it.deliver_at = args.deliver_at;
    it.evses = (args.evses ?? []).map(evse => PredictionsEvseReportEntity.fromRequest(evse));
    it.is_sent = false;

    return it;
  }

  static from(args: PredictionsReportRequest): PredictionsReportRequestEntity {
    const it = new PredictionsReportRequestEntity();

    it.id = args.id;
    it.duration_from_last_searched = args.duration_from_last_searched;
    it.location = args.location;
    it.arrival_time = args.arrival_time;
    it.email = args.email;
    it.is_sent = args.is_sent;
    it.timeframe = args.timeframe;
    it.created_at = args.created_at;
    it.deliver_at = args.deliver_at;
    it.evses = (args.evses ?? []).map(evse => PredictionsEvseReportEntity.from(evse));

    return it;
  }
}
