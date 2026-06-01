import { ConnectorFactory } from './connector.factory';
import { Evse } from '../../models/general/models';
import { isEmptyString } from '../is-empty-string.function';

export class EvseFactory {
  private static readonly defaultEvse: any = {
    uid: 'foouid',
    evse_id: 'fooevseid',
    status: 'AVAILABLE',
    last_updated: new Date(),
    connectors: [ConnectorFactory.omit({ property: null })],
  };

  static omit(args: { property: string }): Evse {
    if (isEmptyString(args.property)) {
      return {
        ...this.defaultEvse,
      };
    }

    const { [args.property]: discard, ...rest } = this.defaultEvse;

    return rest;
  }
}
