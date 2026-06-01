import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateScopedEvsesCommand } from '../impl/update-toolkit-scoped-evses.command';
import { ToolkitsService } from '@fronyx/toolkit';
import { ToolkitScopedEvsesPrimaryIdsService } from '@fronyx/persistence';
import { OcpiEvseEntity, ToolkitScopedEvsesPrimaryIdsEntity } from '../../../../../cdk-apps/src/shared';

@CommandHandler(UpdateScopedEvsesCommand)
export class UpdateScopedEvsesCommandHandler implements ICommandHandler<UpdateScopedEvsesCommand> {
  constructor(
    private readonly toolkitsService: ToolkitsService,
    private readonly toolkitScopedEvsesPrimaryIdsService: ToolkitScopedEvsesPrimaryIdsService,
  ) {
  }

  async execute(command: UpdateScopedEvsesCommand): Promise<void> {
    const projects = await this.toolkitsService.getAllProjects();
    const realTimeProjects = projects.filter((project) => project.prediction_frequency === 'REAL_TIME');
    const availabilityProjects = projects.filter((project) => project.is_availability);
    const chargegptProjects = projects.filter((project) => project.is_chargegpt);

    const scopedEvses = command.location
      .filter(location => projects.some(project => project.isLocationWithinScope(location)))
      .map(location => location.evses
        .filter(evse => projects.some(project => project.isEvseWithinScope(evse)))
        .map(evse => ToolkitScopedEvsesPrimaryIdsEntity.toEntityFromCreateDto({
          uid: evse.uid,
          evse_id: evse.evse_id,
          evse_id_stripped: OcpiEvseEntity.cleanEvseId(evse.evse_id),
          primary_id: evse.primary_id,
          location_id: evse.locationId,
          is_real_time: realTimeProjects.some(project => project.isEvseWithinScope(evse)),
          is_availability: availabilityProjects.some(project => project.isEvseWithinScope(evse)),
          is_chargegpt: chargegptProjects.some(project => project.isEvseWithinScope(evse)),
        }))
      )
      .reduce((acc, val) => [].concat(acc, val), []);

    try {
      this.toolkitScopedEvsesPrimaryIdsService.saveMany({ scopedEvses });
    } catch {
      // NOOP
    }
  }
}
