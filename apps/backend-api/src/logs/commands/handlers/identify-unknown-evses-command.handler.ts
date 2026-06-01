import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { IdentifyUnknownEvsesCommand } from '../impl/identify-unknown-evses.command';
import { UnknownEvsesIdentifiedEvent } from '../../events/impl/unknown-evses-identified.event';
import {
  OcpiEvsePrimaryIdValue
} from '../../../../../cdk-apps/src/shared';
import { OcpiEvsesService } from '@fronyx/persistence';
import { isNull } from '../../../../../cdk-apps/src/shared/utils/is-null.function';

@CommandHandler(IdentifyUnknownEvsesCommand)
export class IdentifyUnknownEvsesCommandHandler implements ICommandHandler<IdentifyUnknownEvsesCommand> {
  private evseIdCache: Record<string, string> = {};

  constructor(
    private readonly eventBus: EventBus,
    private readonly evsesService: OcpiEvsesService,
  ) {
  }

  async execute(command: IdentifyUnknownEvsesCommand): Promise<void> {
    const unknownEvsePrimaryIds = [];

    for (const primaryId of command.evsePrimaryIds) {
      if (isNull(this.evseIdCache[primaryId])) {
        const evsePrimaryIdKey = OcpiEvsePrimaryIdValue.createFromPrimaryId({ primaryId });
        const evse = await this.evsesService.findEvseIdByPrimaryId({
          locationId: evsePrimaryIdKey.locationId,
          uid: evsePrimaryIdKey.uid,
        });

        if (evse) {
          this.evseIdCache[primaryId] = evse.evse_id;
        } else {
          unknownEvsePrimaryIds.push(primaryId);
        }
      }
    }

    if (unknownEvsePrimaryIds.length > 0) {
      this.eventBus.publish(new UnknownEvsesIdentifiedEvent(unknownEvsePrimaryIds));
    }
  }
}
