import { Injectable } from '@nestjs/common';
import { IMessageParserService } from '../interfaces/message-parser-service';
import {
  ProcessedPrediction
} from '../../../../../apps/cdk-apps/src/shared/domain/logging/update-create/models/processed-prediction';
import { IParsedBody } from '../../../../../apps/cdk-apps/src/shared/models/general/parsed-body';

@Injectable()
export class RegressionModelMessageParserService implements IMessageParserService {
  private readonly timeframesArray = [];

  constructor() {
    for (let i = 0; i <= 360; i += 15) {
      this.timeframesArray.push(i);
    }
  }

  parse(args: { records: IParsedBody[] }): ProcessedPrediction[] {
    return args.records
      .map(({ body }) => {
        const createdAt = new Date(body.created_at);
        return this.regressionDataToProcessedPredictions({
          changedTimeframe: this.whichTimeframeDidStatusChange({
            createdAt,
            changedAt: new Date(body.data[0].status_change_in)
          }),
          createdAt,
          data: {
            evse_id: body.data[0].evse_id,
            current_status: body.data[0].current_status,
            status_change_in: new Date(body.data[0].status_change_in),
          },
        });
      })
      .reduce((acc, val) => [].concat(acc, val), []);
  }

  private whichTimeframeDidStatusChange(args: {
    createdAt: Date;
    changedAt: Date;
  }): number {
    const timeframeIndex = Math.floor((args.changedAt.getTime() - args.createdAt.getTime()) / 1000 / 15 / 60);
    return this.timeframesArray[timeframeIndex];
  }

  private regressionDataToProcessedPredictions(args: {
    changedTimeframe: number;
    createdAt: Date;
    data: {
      evse_id: string;
      current_status: string;
      status_change_in: Date;
    };
  }): ProcessedPrediction[] {
    const evseId = args.data.evse_id;
    const currentAvailability = args.data.current_status === 'available';
    const changedAvailability = !currentAvailability;

    return this.timeframesArray.map(timeframe => new ProcessedPrediction({
      evse: evseId,
      timeframe,
      is_available: timeframe < args.changedTimeframe ? currentAvailability : changedAvailability,
      probability: 1,
      updated_at: args.createdAt,
      evse_primary_id: '',
      prediction_frequency: '',
    }));
  }
}
