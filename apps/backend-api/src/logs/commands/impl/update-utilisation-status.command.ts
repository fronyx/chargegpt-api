import { OcpiEvse } from '../../../../../cdk-apps/src/shared';

export class UpdateUtilisationStatusCommand {
  constructor(public readonly evses: OcpiEvse[]) {
  }
}
