import {
  Body,
  Controller,
  Post,
  UseInterceptors
} from '@nestjs/common';
import { SentryInterceptor } from '../../../sentry/sentry.interceptor';
import { OcpiActionsCommandPayload, OcpiLocationEntity } from '../../../cdk-apps/src/shared';
import {
  OcpiConnectorsService,
  OcpiEvsesService,
  OcpiLocationsService,
} from '@fronyx/persistence';
import { StatusLogsService } from './services/status-logs.service';
import { creationsCommandHandler } from './services/creations-command.handler';
import { ApiExcludeController } from '@nestjs/swagger';
import { UpdateScopedEvsesCommand } from './commands/impl/update-toolkit-scoped-evses.command';
import { CommandBus } from '@nestjs/cqrs';
import { AddLocationsToDictionaryCommand } from './commands/impl/add-locations-to-dictionary.command';
import { UpdateScopedEvsesInCacheCommand } from './commands/impl/add-toolkit-scoped-evses.command';
import {
  AddRemoveLocationsFromElasticsearchCommand
} from './commands/impl/add-remove-locations-from-elasticsearch.command';

@ApiExcludeController()
@UseInterceptors(SentryInterceptor)
@Controller('ocpi-creations')
export class OcpiCreationsController {
  constructor(
    private readonly evsesService: OcpiEvsesService,
    private readonly connectorsService: OcpiConnectorsService,
    private readonly locationsService: OcpiLocationsService,
    private readonly statusLogsService: StatusLogsService,
    private readonly commandBus: CommandBus,
  ) {
  }

  @Post('')
  async creationsCommandHandler(@Body() payloads: OcpiActionsCommandPayload[]): Promise<void> {
    await creationsCommandHandler({
      connectorsService: { save: (args) => this.connectorsService.saveMany(args.connectors) },
      evsesService: {
        save: (args) => this.evsesService.saveMany(args.evses)
      },
      locationsService: {
        save: async (args) => {
          await this.locationsService.saveMany(args.locations);

          this.commandBus.execute(
            new UpdateScopedEvsesCommand(args.locations)
          ).finally();

          this.commandBus.execute(
            new AddLocationsToDictionaryCommand(args.locations)
          ).finally();

          this.commandBus.execute(
            new UpdateScopedEvsesInCacheCommand(args.locations)
          ).finally();

          const ocpiLocationEntities = args.locations.map(OcpiLocationEntity.toEntityFromCreateDto)

          this.commandBus.execute(
            new AddRemoveLocationsFromElasticsearchCommand(ocpiLocationEntities)
          ).finally();
        }
      },
      statusLogsService: { store: (args) => this.statusLogsService.saveMany(args) },
      accessScopesService: { store: (args) => Promise.resolve() },
      payloads,
    });
  }
}
