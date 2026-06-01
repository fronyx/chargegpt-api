import { OcpiLocation } from '../../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-location';

export class MakeLocalPutRequestsCommand {
  constructor(public readonly locations: OcpiLocation[]) {
  }
}
