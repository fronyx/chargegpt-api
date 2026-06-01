import { Evse } from '../../../../models/general/models';
import { Result } from '../../../../models/general/result';
import { isEmptyString } from '../../../../utils/is-empty-string.function';
import { isEmptyArray } from '../../../../utils/is-empty-array.function';
import { ConnectorsValue } from './connectors.value';
import { isNull } from '../../../../utils/is-null.function';

export class EvsesValue {
  static readonly requiredProperties = ['uid', 'evse_id', 'status', 'last_updated'];
  private readonly evses: Result<Evse>[];

  private constructor(args: Result<Evse>[]) {
    this.evses = args;
  }

  get value(): Evse[] {
    return this.evses
      .filter(evse => !evse.isFailure)
      .map(evse => evse.getValue());
  }

  static create(args: { evses: any }): EvsesValue {
    if (isNull(args.evses)) {
      return new EvsesValue([]);
    }

    const evses: Result<Evse>[] = args.evses.map((evse: any) => {
      if (EvsesValue.requiredProperties.some((prop: string) => isEmptyString(evse[prop]))) {
        return Result.fail<Evse>('Invalid EVSE property.');
      }

      const connectors = ConnectorsValue.create({ connectors: evse.connectors }).value;
      if (isEmptyArray(connectors)) {
        return Result.fail<Evse>('No valid connectors.');
      }

      return Result.ok<Evse>(evse);
    });

    return new EvsesValue(evses);
  }
}
