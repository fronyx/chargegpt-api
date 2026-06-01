import { TimeframeStatus } from './timeframe-status';

export class PredictionMessage implements Readonly<PredictionMessage> {
  evse: string;
  pred_list: TimeframeStatus[];

  constructor(args: {
    evse: string;
    pred_list: Partial<TimeframeStatus>[];
  }) {
    this.evse = args.evse;
    this.pred_list = (args.pred_list ?? []).map(val => new TimeframeStatus({
      timeframe: Number(val.timeframe),
      is_available: !!val.is_available,
      probability: Number(val.probability),
    }));
  }
}
