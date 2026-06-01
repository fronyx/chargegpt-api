import { OcpiLocation } from '../../../../../cdk-apps/src/shared';

export class UpdateScopedEvsesInCacheCommand {
  constructor(public readonly location: OcpiLocation[]) {
  }
}
