import { isNull } from '../../../../utils/is-null.function';
import { extractPropertyIntoPayload } from '../../../../utils/extract-property-into-payload.function';
import { isObjectEmpty } from '../../../../utils/is-object-empty.function';

export class OcpiEnergySource implements Readonly<OcpiEnergySource> {
  source: string;
  percentage: number;

  private constructor(args: Partial<OcpiEnergySource>) {
    Object.assign(this, args);
  }

  static create(args: any) {
    if (isNull(args)) {
      return null;
    }

    const payload = extractPropertyIntoPayload({
      properties: ['source', 'percentage'],
      data: args,
    });

    if (isObjectEmpty(payload)) {
      return null;
    }

    return new OcpiEnergySource(payload);
  }
}
