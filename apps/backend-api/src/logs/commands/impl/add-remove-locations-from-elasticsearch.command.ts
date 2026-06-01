import { OcpiLocationEntity } from '../../../../../../apps/cdk-apps/src/shared/index';


export class AddRemoveLocationsFromElasticsearchCommand {
  constructor(public readonly locations: OcpiLocationEntity[]) {
  }
}
