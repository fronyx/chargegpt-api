import { isEmptyString } from '../../../../utils/is-empty-string.function';

export class OcpiConnectorPrimaryId implements Readonly<OcpiConnectorPrimaryId> {
  private readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  get value(): string {
    return this.id;
  }

  static create(args: { locationId: string; uid: string; connectorId: string; }): OcpiConnectorPrimaryId {
    if (isEmptyString(args.locationId) || isEmptyString(args.uid) || isEmptyString(args.connectorId)) {
      throw new Error('Invalid primary id value when creating OcpiConnectorPrimaryId!');
    }

    return new OcpiConnectorPrimaryId(`${args.locationId}_${args.uid}_${args.connectorId}`);
  }

  static createFromEvsePrimaryId(args: { evsePrimaryId: string; connectorId: string; }): OcpiConnectorPrimaryId {
    if (isEmptyString(args.evsePrimaryId) || isEmptyString(args.connectorId)) {
      throw new Error('Invalid primary id value when creating OcpiConnectorPrimaryId from evse primary id!');
    }

    return new OcpiConnectorPrimaryId(`${args.evsePrimaryId}_${args.connectorId}`);
  }
}
