import { OcpiLocation } from '../../../../../cdk-apps/src/shared';

export class UpdateScopedEvsesCommand {
  constructor(public readonly location: OcpiLocation[]) {
  }
}
