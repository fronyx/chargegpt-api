import { OcpiEvse } from '../../../../../cdk-apps/src/shared';

export class RemoveInvalidEvsesFromElasticsearchCommand {
  constructor(public readonly evses: OcpiEvse[]) {
  }
}
