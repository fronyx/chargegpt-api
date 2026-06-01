import { EntitiesUpdaterService } from '../models/entities-updater-service';
import { EntitiesStorageService } from '../models/entities-storage-service';
import { OcpiActionsCommandPayload } from '../../../../cdk-apps/src/shared';
import {
  convertUpdationsCommandPayloadToAffectedEntities
} from './convert-updations-command-payload-to-affected-entities';

export async function updationsCommandHandler(args: {
  evsesService: EntitiesUpdaterService;
  connectorsService: EntitiesUpdaterService;
  locationsService: EntitiesUpdaterService;
  statusLogsService: EntitiesStorageService;
  accessScopesService: EntitiesStorageService;
  payloads: OcpiActionsCommandPayload[];
}): Promise<void> {
  if (!args.payloads) {
    return;
  }

  const {
    locations,
    evses,
    connectors,
    statusLogs
  } = convertUpdationsCommandPayloadToAffectedEntities({ payloads: args.payloads });

  await Promise.all([
    args.evsesService.update({ evses }),
    args.connectorsService.update({ connectors }),
    args.locationsService.update({ locations }),
    args.statusLogsService.store({ statusLogs }),
    args.accessScopesService.store({ evses }),
  ]);
}
