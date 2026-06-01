import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ToolkitsService } from '@fronyx/toolkit';
import { UpdateScopedEvsesInCacheCommand } from '../impl/add-toolkit-scoped-evses.command';
import { AccessScopeService } from '@fronyx/authentications';

@CommandHandler(UpdateScopedEvsesInCacheCommand)
export class UpdateScopedEvsesInCacheCommandHandler implements ICommandHandler<UpdateScopedEvsesInCacheCommand> {
  constructor(
    private readonly toolkitsService: ToolkitsService,
    private readonly accessScopeService: AccessScopeService,
  ) {
  }

  async execute(command: UpdateScopedEvsesInCacheCommand): Promise<void> {
    const projects = await this.toolkitsService.getAllProjects();

    for (const project of projects) {
      command.location.forEach((location) => {
        const evses = location.evses.filter(evse => project.isEvseWithinScope(evse));
        if (project.isLocationWithinScope(location)) {
          this.accessScopeService.addLocationToProjectScope({
            location: {
              ...location,
              evses,
            },
            project
          });
        }
      });
    }
  }
}
