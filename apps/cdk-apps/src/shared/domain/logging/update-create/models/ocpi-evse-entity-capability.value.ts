import { isNull } from '../../../../utils/is-null.function';
import { isEmptyArray } from '../../../../utils/is-empty-array.function';

export class OcpiEvseEntityCapabilityValue {
  private readonly capabilities: string | null = null;

  private constructor(args: string | null) {
    this.capabilities = args;
  }

  static create(args: { capabilities: string | string[] }): OcpiEvseEntityCapabilityValue {
    if (isNull(args.capabilities)) {
      return new OcpiEvseEntityCapabilityValue(null);
    }

    // capabilities is string
    if ((args.capabilities as any).join === undefined) {
      return new OcpiEvseEntityCapabilityValue(null);
    }

    // capabilities is string[]
    if (isEmptyArray(args.capabilities as string[])) {
      return new OcpiEvseEntityCapabilityValue(null);
    }

    return new OcpiEvseEntityCapabilityValue((args.capabilities as any).join(','));
  }

  get value(): string | null {
    return this.capabilities;
  }
}
