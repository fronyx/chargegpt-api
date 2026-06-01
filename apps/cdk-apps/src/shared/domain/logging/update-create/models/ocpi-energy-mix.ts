import { OcpiEnergySource } from './ocpi-energy-source';
import { OcpiEnvironmentalImpact } from './ocpi-environmental-impact';
import { isNull } from '../../../../utils/is-null.function';
import { isObjectEmpty } from '../../../../utils/is-object-empty.function';
import { extractPropertyIntoPayload } from '../../../../utils/extract-property-into-payload.function';

export class OcpiEnergyMix implements Readonly<OcpiEnergyMix> {
  is_green_energy: boolean;
  supplier_name: string;
  energy_product_name: string;
  environ_impact: OcpiEnvironmentalImpact[];
  energy_sources: OcpiEnergySource[];

  private constructor(args: Partial<OcpiEnergyMix>) {
    Object.assign(this, args);
  }

  static create(args: any) {
    if (isNull(args)) {
      return null;
    }

    const properties = ['is_green_energy', 'supplier_name', 'energy_product_name', 'environ_impact', 'energy_sources'];
    const payload: any = extractPropertyIntoPayload({ properties, data: args });
    payload.environ_impact = (args.environ_impact ?? []).map((val: any) => OcpiEnvironmentalImpact.create(val)).filter((val: any) => !isNull(val));
    payload.energy_sources = (args.energy_sources ?? []).map((val: any) => OcpiEnergySource.create(val)).filter((val: any) => !isNull(val));

    if (isObjectEmpty(payload)) {
      return null;
    }

    return new OcpiEnergyMix(payload);
  }
}
