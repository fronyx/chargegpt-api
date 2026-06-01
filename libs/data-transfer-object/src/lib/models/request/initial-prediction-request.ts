import { NearbyEvse } from '../response/nearby-evse';

export class InitialPredictionRequest implements Readonly<InitialPredictionRequest> {
  location: string;
  arrival_time: string;
  timeframe: number;
  evses: NearbyEvse[];
  created_at: Date;

  constructor(args: InitialPredictionRequest) {
    Object.assign(this, args);

    this.created_at = new Date(args.created_at);
    this.evses = (args.evses ?? []).map(evse => new NearbyEvse(evse));
  }
}
