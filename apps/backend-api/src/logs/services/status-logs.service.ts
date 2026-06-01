import { Injectable } from '@nestjs/common';
import {
  OcpiEvsesService,
  OcpiStatusLogsService,
} from '@fronyx/persistence';
import { OcpiStatusLog } from '../../../../cdk-apps/src/shared';
import { isNull } from '../../../../cdk-apps/src/shared/utils/is-null.function';
import {
  OcpiEvsePrimaryIdValue
} from '../../../../cdk-apps/src/shared';
import { IdentifyUnknownEvsesCommand } from '../commands/impl/identify-unknown-evses.command';
import { CommandBus } from '@nestjs/cqrs';

export interface StatusLog {
  status: string;
  last_updated: number;
}

@Injectable()
export class StatusLogsService {
  private evseIdCache: Record<string, string> = {};

  constructor(
    private readonly statusLogsService: OcpiStatusLogsService,
    private readonly commandBus: CommandBus,
    private readonly evsesService: OcpiEvsesService,
  ) {
  }

  async saveMany(args: { statusLogs: OcpiStatusLog[] }): Promise<void> {
    this.tryToIdentifyUnknownEvses({ logs: args.statusLogs });

    const statusLogs = args.statusLogs.filter(({ evse_id }) => !isNull(evse_id)).map(log => OcpiStatusLog.create(log));

    const requests = [];

    requests.push(this.statusLogsService.saveMany({ statusLogs }));
    await Promise.all(requests);

    const statusLogsToBeEnriched = args.statusLogs.filter(({ evse_id }) => isNull(evse_id));
    if (statusLogsToBeEnriched.length > 0) {
      const enrichedStatusLogs = [];

      for (const statusLog of statusLogsToBeEnriched) {
        const primaryIdKey = OcpiEvsePrimaryIdValue.create({ locationId: statusLog.location_id, uid: statusLog.uid });

        if (this.evseIdCache[primaryIdKey.value] === undefined) {
          const evse = await this.evsesService.findEvseIdByPrimaryId({
            locationId: primaryIdKey.locationId,
            uid: primaryIdKey.uid,
          });

          if (evse) {
            this.evseIdCache[primaryIdKey.value] = evse.evse_id;
          } else {
            this.evseIdCache[primaryIdKey.value] = null;
          }
        }

        if (!isNull(this.evseIdCache[primaryIdKey.value])) {
          enrichedStatusLogs.push(OcpiStatusLog.create({
            ...statusLog,
            evse_id: this.evseIdCache[primaryIdKey.value],
          }))
        }
      }

      if (enrichedStatusLogs.length > 0) {
        await this.statusLogsService.saveMany({ statusLogs: enrichedStatusLogs });
      }
    }
  }

  tryToIdentifyUnknownEvses(args: { logs: OcpiStatusLog[]; }) {
    const evsePrimaryIds = args.logs.map(statusLog => OcpiEvsePrimaryIdValue.create({
      locationId: statusLog.location_id,
      uid: statusLog.uid
    }));

    this.commandBus.execute(
      new IdentifyUnknownEvsesCommand(evsePrimaryIds.map(primaryId => primaryId.value))
    ).finally();
  }
}
