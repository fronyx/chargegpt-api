import { isNull } from '../../../../utils/is-null.function';

export class OcpiExceptionalPeriod implements Readonly<OcpiExceptionalPeriod> {
  period_begin: string;
  period_end: string;

  private constructor(args: Partial<OcpiExceptionalPeriod>) {
    Object.assign(this, args);
  }

  static create(args: any) {
    const properties = ['period_begin', 'period_end'];
    if (properties.some(key => isNull(args[key]))) {
      return null;
    }

    return new OcpiExceptionalPeriod(args);
  }
}
