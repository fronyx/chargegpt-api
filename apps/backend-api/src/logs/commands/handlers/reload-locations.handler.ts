import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ReloadLocationsCommand } from '../impl/reload-locations.command';
import { EVFreaksOcpiService } from '../../services/e-v-freaks-ocpi.service';
import { LocationsReloadedEvent } from '../../events/impl/locations-reloaded.event';
import { OcpiLocation } from '../../../../../cdk-apps/src/shared';
import { isNull } from '../../../../../cdk-apps/src/shared/utils/is-null.function';

@CommandHandler(ReloadLocationsCommand)
export class ReloadLocationsHandler implements ICommandHandler<ReloadLocationsCommand> {
  constructor(
    private readonly evFreakService: EVFreaksOcpiService,
    private readonly eventBus: EventBus,
  ) {
  }

  async execute(command: ReloadLocationsCommand): Promise<void> {
    const requests = command.locationIds.map(locationId => this.evFreakService.getLocationDetails({ locationId }));

    const results = await Promise.allSettled(requests);

    const locations = results
      .filter(({ status }) => status === 'fulfilled')
      .map(({ value }: PromiseFulfilledResult<OcpiLocation>) => value)
      .filter(value => !isNull(value));

    this.eventBus.publish(new LocationsReloadedEvent(locations));
  }
}
