export class TimeframeStatus implements Readonly<TimeframeStatus> {
	timeframe: number;
	probability: number;
	is_available: boolean;

	constructor(args: {
    timeframe: number;
    probability: number;
    is_available: boolean;
  }) {
		Object.assign(this, args);
	}
}
