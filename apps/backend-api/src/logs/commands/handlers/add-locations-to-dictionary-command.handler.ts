import { EvseDictionaryService } from '@fronyx/predictions';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddLocationsToDictionaryCommand } from '../impl/add-locations-to-dictionary.command';

@CommandHandler(AddLocationsToDictionaryCommand)
export class AddLocationsToDictionaryCommandHandler implements ICommandHandler<AddLocationsToDictionaryCommand> {
  constructor(
    private readonly dictionaryService: EvseDictionaryService,
  ) {
  }

  async execute(command: AddLocationsToDictionaryCommand): Promise<void> {
    await this.dictionaryService.addPrimaryFromLocations(command);
  }
}
