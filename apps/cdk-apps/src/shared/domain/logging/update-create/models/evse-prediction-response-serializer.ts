import { ToolkitProject } from './toolkit-project';
import { PredictionDetails } from './prediction-details';

export class EvsePredictionResponseSerializer {
  private propertiesConfig: {
    status: number;
    probability: number;
    timeframe: number;
  } = {
    status: 0,
    probability: 0,
    timeframe: 0,
  };

  constructor(args: { project: ToolkitProject | any }) {
    args.project.response.forEach(({ name, value }: any) => {
      if (name === 'status') {
        this.propertiesConfig.status = Number(value);
      }

      if (name === 'probability') {
        this.propertiesConfig.probability = Number(value);
      }

      if (name === 'timeframe') {
        this.propertiesConfig.timeframe = Number(value);
      }
    });
  }

  serialize(args: {
    timeframe: number;
    timestamp: Date;
    status: string;
    probability: number;
  }): PredictionDetails {
    const payload: any = {};

    payload.timestamp =
      EvsePredictionResponseSerializer.addTimeframeToTimestamp(
        args.timeframe,
        args.timestamp
      );

    if (this.propertiesConfig.status === 1) {
      payload.status = args.status;
    }

    if (this.propertiesConfig.timeframe === 1) {
      payload.timeframe = args.timeframe;
    }

    if (this.propertiesConfig.probability === 1) {
      payload.probability = args.probability;
    }

    return new PredictionDetails(payload);
  }

  static addTimeframeToTimestamp(timeframe: number, timestamp: Date): string {
    const zeroedTimestamp = new Date(timestamp);
    zeroedTimestamp.setSeconds(0);
    zeroedTimestamp.setMilliseconds(0);

    return new Date(
      zeroedTimestamp.getTime() + Number(timeframe) * 60000
    ).toISOString();
  }
}
