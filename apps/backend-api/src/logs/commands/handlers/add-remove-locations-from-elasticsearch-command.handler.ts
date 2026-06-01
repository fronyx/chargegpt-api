import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccessScopeService } from '@fronyx/authentications';
import { AddRemoveLocationsFromElasticsearchCommand } from '../impl/add-remove-locations-from-elasticsearch.command';
import { OcpiLocationEntity } from '../../../../../../apps/cdk-apps/src/shared';

@CommandHandler(AddRemoveLocationsFromElasticsearchCommand)
export class AddRemoveLocationsFromElasticsearchCommandHandler implements ICommandHandler<AddRemoveLocationsFromElasticsearchCommand> {
  constructor(
    private readonly accessScopeService: AccessScopeService,
  ) {
  }

  async execute(command: AddRemoveLocationsFromElasticsearchCommand): Promise<void> {
    const locations: OcpiLocationEntity[] = command.locations;
    const { validLocations, invalidLocations } = await this.accessScopeService.checkTheValidityOfLocations(locations);
    if (validLocations.length > 0) {
      await this.accessScopeService.seedValidLocationsIntoElasticSearch(validLocations);
    }

    if (invalidLocations.length > 0) {
      await this.accessScopeService.removeInvalidLocationsFromElasticSearch(invalidLocations);
    }
  }
}

