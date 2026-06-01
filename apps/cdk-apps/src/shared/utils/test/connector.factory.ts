import { Connector } from '../../models/general/models';
import { isEmptyString } from '../is-empty-string.function';

export class ConnectorFactory {
  private static readonly defaultConnector: any = {
    id: 'fooid',
    standard: 'foodstandard',
    format: 'fooformat',
    power_type: 'foopowertype',
    voltage: 100,
    amperage: 32,
    last_updated: new Date(),
  }

  static omit(args: { property: any }): Connector {
    if (isEmptyString(args.property)) {
      return {
        ...this.defaultConnector,
      };
    }

    const { [args.property]: discard, ...rest } = this.defaultConnector;

    return rest;
  }
}
