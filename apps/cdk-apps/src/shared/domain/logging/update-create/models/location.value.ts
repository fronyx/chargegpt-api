import { Location } from '../../../../models/general/models';
import { Result } from '../../../../models/general/result';
import { isEmptyString } from '../../../../utils/is-empty-string.function';
import { isEmptyArray } from '../../../../utils/is-empty-array.function';
import { EvsesValue } from './evses.value';

export class LocationValue {
  static readonly requiredProperties = ['id', 'city', 'country', 'address', 'latitude', 'longitude', 'last_updated'];
  private readonly location: Result<Location>;

  private constructor(args: Result<Location>) {
    this.location = args;
  }

  get value(): Location | null {
    if (this.location.isFailure) {
      return null;
    }

    return this.location.getValue();
  }

  static create(args: any): LocationValue {
    if (LocationValue.requiredProperties.some((prop: string) => isEmptyString(args[prop]))) {
      return new LocationValue(Result.fail('Invalid property'));
    }

    const evses: any = EvsesValue.create({ evses: args.evses }).value;

    if (isEmptyArray(evses)) {
      return new LocationValue(Result.fail('Invalid property'));
    }

    try {
      return new LocationValue(Result.ok<Location>({
        ...args,
        evses,
      }));
    } catch {
      return new LocationValue(Result.fail('Invalid property'));
    }
  }
}
