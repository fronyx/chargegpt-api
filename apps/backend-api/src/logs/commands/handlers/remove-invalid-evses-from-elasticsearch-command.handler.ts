import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveInvalidEvsesFromElasticsearchCommand } from '../impl/remove-invalid-evses-from-elasticsearch.command';
import { OcpiLocationsService } from '@fronyx/persistence';
import { AccessScopeService } from '@fronyx/authentications';

@CommandHandler(RemoveInvalidEvsesFromElasticsearchCommand)
export class RemoveInvalidEvsesFromElasticsearchCommandHandler implements ICommandHandler<RemoveInvalidEvsesFromElasticsearchCommand> {
  constructor(
    private readonly locationsService: OcpiLocationsService,
    private readonly accessScopeService: AccessScopeService,
  ) {
  }

  async execute(command: RemoveInvalidEvsesFromElasticsearchCommand): Promise<void> {
    const locationIds = command.evses.map(evse => evse.locationId);
    const locations = await this.locationsService.findLocationsEvsesConnectorsByLocationId({ locationIds });

    const { validLocations, invalidLocations } = await this.accessScopeService.checkTheValidityOfLocations(locations);

    if (validLocations.length > 0) {
      await this.accessScopeService.seedValidLocationsIntoElasticSearch(validLocations);
    }

    if (invalidLocations.length > 0) {
      await this.accessScopeService.removeInvalidLocationsFromElasticSearch(invalidLocations);
    }
  }

}
