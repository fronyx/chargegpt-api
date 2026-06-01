import {
  AvailabilityEnum
} from '../../../../../../apps/cdk-apps/src/shared/domain/logging/update-create/models/availability.enum';

export class InitialEvsePrediction implements Readonly<InitialEvsePrediction> {
  evse: string;
  status: AvailabilityEnum;
  location: string;
  distance: number;

  constructor(args: Partial<InitialEvsePrediction>) {
    Object.assign(this, args);
  }
}
