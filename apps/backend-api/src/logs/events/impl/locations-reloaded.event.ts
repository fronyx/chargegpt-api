import { OcpiLocation } from '../../../../../cdk-apps/src/shared';

export class LocationsReloadedEvent {
  constructor(public readonly locations: OcpiLocation[]) {
  }
}
