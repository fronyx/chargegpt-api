import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUtilisationStatusCommand } from '../impl/update-utilisation-status.command';
import { UtilisationsRadarService } from '../../services/utilisations-radar.service';

@CommandHandler(UpdateUtilisationStatusCommand)
export class UpdateUtilisationStatusCommandHandler implements ICommandHandler<UpdateUtilisationStatusCommand> {
  constructor(
    private readonly utilisationsRadarService: UtilisationsRadarService,
  ) {
  }

  async execute(command: UpdateUtilisationStatusCommand): Promise<void> {
    await this.utilisationsRadarService.performUtilisationStatusUpdateProcess(command);
  }
}
