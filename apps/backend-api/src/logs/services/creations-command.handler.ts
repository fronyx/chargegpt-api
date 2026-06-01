import { EntitiesStorageService } from '../models/entities-storage-service';
import { OcpiActionsCommandPayload } from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-actions-command-payload';
import {
  convertCreationsCommandPayloadToAffectedEntities
} from './convert-creations-command-payload-to-affected-entities';
import { EntitiesSaverService } from '../models/entities-saver-service';

export async function creationsCommandHandler(args: {
  evsesService: EntitiesSaverService;
  connectorsService: EntitiesSaverService;
  locationsService: EntitiesSaverService;
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
  } = convertCreationsCommandPayloadToAffectedEntities({ payloads: args.payloads });

  await Promise.all([
    args.evsesService.save({ evses }),
    args.connectorsService.save({ connectors }),
    args.locationsService.save({ locations }),
    args.statusLogsService.store({ statusLogs }),
    args.accessScopesService.store({ evses }),
  ]);
}
