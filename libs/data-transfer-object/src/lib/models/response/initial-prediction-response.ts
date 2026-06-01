import { InitialEvsePrediction } from './initial-evse-prediction';
import { InitialPredictionRequest } from '../request';
import { NearbyEvse } from './nearby-evse';
import { AvailabilityEnum } from '../../../../../../apps/cdk-apps/src/shared/domain/logging';
import { PredictionDetails } from '../../../../../../apps/cdk-apps/src/shared/domain/logging';

export class InitialPredictionResponse implements Readonly<InitialPredictionResponse> {
  location: string;
  arrival_time: string;
  timeframe: number;
  created_at: Date;
  evses: InitialEvsePrediction[] = [];

  setRequest(args: InitialPredictionRequest): void {
    this.location = args.location;
    this.timeframe = args.timeframe;
    this.created_at = new Date(args.created_at);
    this.arrival_time = args.arrival_time;
  }

  setPredictions(
    evses: NearbyEvse[],
    predictions: PredictionDetails[],
  ): void {
    // const predictionStatusMap = (predictions ?? []).reduce((acc, val) => {
    //   acc[val.id] = val.status;
    //   return acc;
    // }, {} as any);
    //
    // this.evses = evses.map(evse => new InitialEvsePrediction({
    //   evse: evse.evse,
    //   distance: evse.distance,
    //   location: evse.location,
    //   status: predictionStatusMap[evse.evse] || AvailabilityEnum.UNKNOWN,
    // }));
    //
    // this.evses.sort(this.sortByDistance);
    // this.evses.sort(this.sortByAvailability);
    //
    // this.evses = this.evses
    //   .filter(({ status }) => status !== AvailabilityEnum.UNKNOWN)
    //   .slice(0, 5);
  }

  sortByDistance({ distance: distanceA }: InitialEvsePrediction, { distance: distanceB }: InitialEvsePrediction) {
    return distanceA - distanceB;
  }

  sortByAvailability({ status: statusA }: InitialEvsePrediction, { status: statusB }: InitialEvsePrediction) {
    // const availabilityMap: Record<AvailabilityEnum, number> = {
    //   [AvailabilityEnum.AVAILABLE]: 0,
    //   [AvailabilityEnum.UNAVAILABLE]: 0,
    //   [AvailabilityEnum.OCCUPIED]: 1,
    //   [AvailabilityEnum.UNKNOWN]: 2,
    //   [AvailabilityEnum.OUT_OF_SERVICE]: 3,
    // };
    //
    // return availabilityMap[statusA] - availabilityMap[statusB];
  }
}
