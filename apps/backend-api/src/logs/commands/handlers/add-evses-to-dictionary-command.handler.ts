import { EvseDictionaryService } from '@fronyx/predictions';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddEvsesToDictionaryCommand } from '../impl/add-evses-to-dictionary.command';

@CommandHandler(AddEvsesToDictionaryCommand)
export class AddEvsesToDictionaryCommandHandler implements ICommandHandler<AddEvsesToDictionaryCommand> {
  constructor(
    private readonly dictionaryService: EvseDictionaryService,
  ) {
  }

  async execute(command: AddEvsesToDictionaryCommand): Promise<void> {
    await this.dictionaryService.addPrimaryIdFromEvses(command);
  }
}
