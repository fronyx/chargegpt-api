import { Connector } from '../../../../models/general/models';
import { Result } from '../../../../models/general/result';
import { isEmptyString } from '../../../../utils/is-empty-string.function';
import { isNull } from '../../../../utils/is-null.function';

export class ConnectorsValue {
  static readonly requiredProperties = ['id', 'standard', 'format', 'power_type', 'voltage', 'amperage', 'last_updated'];
  private readonly connectors: Result<Connector>[];

  private constructor(args: Result<Connector>[]) {
    this.connectors = args;
  }

  get value(): Connector[] {
    return this.connectors
      .filter(connector => !connector.isFailure)
      .map(connector => connector.getValue());
  }

  static create(args: { connectors: any }): ConnectorsValue {
    if (isNull(args.connectors)) {
      return new ConnectorsValue([]);
    }

    const connectors: Result<Connector>[] = args.connectors.map((evse: any) => {
      if (ConnectorsValue.requiredProperties.some((prop: string) => isEmptyString(evse[prop]))) {
        return Result.fail<Connector>('Invalid connector property.');
      }

      return Result.ok<Connector>(evse);
    });

    return new ConnectorsValue(connectors);
  }
}
