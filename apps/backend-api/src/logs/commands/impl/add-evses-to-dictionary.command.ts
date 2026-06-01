import { OcpiEvse } from '../../../../../cdk-apps/src/shared';

export class AddEvsesToDictionaryCommand {
  constructor(public readonly evses: OcpiEvse[]) {
  }
}
