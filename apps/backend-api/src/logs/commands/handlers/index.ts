import { IdentifyUnknownEvsesCommandHandler } from './identify-unknown-evses-command.handler';
import { ReloadLocationsHandler } from './reload-locations.handler';
import { UpdateUtilisationStatusCommandHandler } from './update-utilisation-status-command.handler';
import { UpdateScopedEvsesCommandHandler } from './update-toolkit-scoped-evses-command.handler';
import { AddLocationsToDictionaryCommandHandler } from './add-locations-to-dictionary-command.handler';
import { AddEvsesToDictionaryCommandHandler } from './add-evses-to-dictionary-command.handler';
import { UpdateScopedEvsesInCacheCommandHandler } from './add-tookit-scoped-evses-command.handler';
import {
  AddRemoveLocationsFromElasticsearchCommandHandler
} from './add-remove-locations-from-elasticsearch-command.handler';
import {
  RemoveInvalidEvsesFromElasticsearchCommandHandler
} from './remove-invalid-evses-from-elasticsearch-command.handler';

export const LogsCommandHandlers = [
  IdentifyUnknownEvsesCommandHandler,
  ReloadLocationsHandler,
  UpdateUtilisationStatusCommandHandler,
  UpdateScopedEvsesCommandHandler,
  AddLocationsToDictionaryCommandHandler,
  AddEvsesToDictionaryCommandHandler,
  UpdateScopedEvsesInCacheCommandHandler,
  AddRemoveLocationsFromElasticsearchCommandHandler,
  RemoveInvalidEvsesFromElasticsearchCommandHandler,
];
