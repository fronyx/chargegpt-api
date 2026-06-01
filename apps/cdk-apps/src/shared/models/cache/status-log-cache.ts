import { AvailabilityEnum } from '../../domain/logging/update-create/models/availability.enum';
import { UpdatedAtDateValue } from '../general/updated-at-date.value';
import { EvseStatusValue } from '../../domain/logging/update-create/models/evse-status.value';

export class StatusLogCache {
  private value: {
    lastUpdated: Date;
    status: AvailabilityEnum;
  }

  private constructor(args: any) {
    this.value = args;
  }

  get timestamp(): number {
    return this.value.lastUpdated.getTime();
  }

  get status(): AvailabilityEnum {
    return this.value.status;
  }

  static create(args: { lastUpdated: string | Date; status: string; }): StatusLogCache {
    const lastUpdated = UpdatedAtDateValue.create(args.lastUpdated).value;
    const status = EvseStatusValue.create(args.status).value;

    return new StatusLogCache({ lastUpdated, status });
  }
}
