import { OcpiLocation } from '../../../../../cdk-apps/src/shared';

export class AddLocationsToDictionaryCommand {
  constructor(public readonly locations: OcpiLocation[]) {
  }
}
