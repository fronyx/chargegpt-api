import { isNull } from '../../../../../../apps/cdk-apps/src/shared/utils/is-null.function';

export class TimeframeQueryParams {
  timeframe: number;

  constructor(args: any) {
    this.timeframe = args;
  }

  value(): number | null {
    return (isNull(this.timeframe)) ? null : Number(this.timeframe);
  }
}
