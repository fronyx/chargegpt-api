import { isEmptyString } from '../../utils/is-empty-string.function';

export class PredictionsClassificationKey {
  static keyPrefix: string = 'predictions:classification';
  private readonly key: string;

  private constructor(props: string) {
    this.key = props;
  }

  get value(): string {
    return this.key;
  }

  static create(args: { locationId: string; uid: string; predictionFrequency: string }): PredictionsClassificationKey {
    if (isEmptyString(args.locationId) || isEmptyString(args.uid) || isEmptyString(args.predictionFrequency)) {
      throw new Error(`Invalid input value for PredictionsClassificationKey.create, args: ${JSON.stringify(args)}`);
    }

    const frequencyKey = args.predictionFrequency === 'REAL_TIME' ? ':real_time' : '';
    return new PredictionsClassificationKey(`${this.keyPrefix}${frequencyKey}:location_id:${args.locationId}:uid:${args.uid}`);
  }
}
