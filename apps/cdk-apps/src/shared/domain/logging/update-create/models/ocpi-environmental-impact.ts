import { isNull } from '../../../../utils/is-null.function';
import { extractPropertyIntoPayload } from '../../../../utils/extract-property-into-payload.function';
import { isObjectEmpty } from '../../../../utils/is-object-empty.function';

export class OcpiEnvironmentalImpact implements Readonly<OcpiEnvironmentalImpact> {
  source: string;
  amount: number;

  private constructor(args: Partial<OcpiEnvironmentalImpact>) {
    Object.assign(this, args);
  }

  static create(args: any) {
    if (isNull(args)) {
      return null;
    }

    const payload = extractPropertyIntoPayload({
      properties: ['source', 'amount'],
      data: args,
    });

    if (isObjectEmpty(payload)) {
      return null;
    }

    return new OcpiEnvironmentalImpact(payload);
  }
}
