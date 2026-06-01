import {
  AvailabilityEnum
} from '../../../../../../apps/cdk-apps/src/shared/domain/logging/update-create/models/availability.enum';

export class CachedProcessedPrediction {
  evse: string;
  status: AvailabilityEnum;
  probability: number;
  lastUpdated: Date;

  constructor(args: {
    evse: string;
    status: AvailabilityEnum;
    lastUpdated: Date;
    probability: number;
  }) {
    Object.assign(this, args);
  }

  static getPrefix(): string {
    return 'fronyx_processed_predictions_';
  }

  static getCacheKey(args: { evseId: string; }): string {
    return `${CachedProcessedPrediction.getPrefix()}${args.evseId}`;
  }
}
