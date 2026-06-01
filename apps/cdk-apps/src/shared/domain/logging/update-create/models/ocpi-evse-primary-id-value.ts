import { isEmptyString } from '../../../../utils/is-empty-string.function';
import { isNull } from '../../../../utils/is-null.function';

export class OcpiEvsePrimaryIdValue implements Readonly<OcpiEvsePrimaryIdValue> {
  private readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  get value(): string {
    return this.id;
  }

  get locationId(): string {
    return this.id.split('_')[0];
  }

  get uid(): string {
    return this.id.split('_')[1];
  }

  static create(args: { locationId: string; uid: string; }): OcpiEvsePrimaryIdValue {
    if (isEmptyString(args.locationId) || isEmptyString(args.uid)) {
      throw new Error('Invalid primary id value in OcpiEvsePrimaryId.');
    }

    return new OcpiEvsePrimaryIdValue(`${args.locationId}_${args.uid}`);
  }

  static createFromPrimaryId(args: { primaryId: string; }): OcpiEvsePrimaryIdValue {
    if (isNull(args.primaryId)) {
      throw new Error('Invalid input for OcpiEvsePrimaryKeyValue.createFromPrimaryId');
    }

    return new OcpiEvsePrimaryIdValue(args.primaryId);
  }
}
