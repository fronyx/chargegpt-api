import { EVFreaksLocation } from '../../../../../cdk-apps/src/shared';

export class CheckExistingNewEvfreaksLocationsCommand {
  constructor(public readonly args: { locations: EVFreaksLocation[], isPolling: boolean }) {
  }
}
