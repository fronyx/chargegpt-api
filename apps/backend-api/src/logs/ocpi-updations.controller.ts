import {
  Body,
  Controller,
  Post,
  UseInterceptors
} from '@nestjs/common';
import { SentryInterceptor } from '../../../sentry/sentry.interceptor';
import { OcpiActionsCommandPayload } from '../../../cdk-apps/src/shared';
import {
  OcpiConnectorsService,
  OcpiEvsesService,
  OcpiLocationsService,
} from '@fronyx/persistence';
import { updationsCommandHandler } from './services/updations-command.handler';
import { StatusLogsService } from './services/status-logs.service';
import { CommandBus } from '@nestjs/cqrs';
import { ApiExcludeController } from '@nestjs/swagger';
import {
  RemoveInvalidEvsesFromElasticsearchCommand
} from './commands/impl/remove-invalid-evses-from-elasticsearch.command';

@ApiExcludeController()
@UseInterceptors(SentryInterceptor)
@Controller('ocpi-updations')
export class OcpiUpdationsController {
  constructor(
    private readonly evsesService: OcpiEvsesService,
    private readonly connectorsService: OcpiConnectorsService,
    private readonly locationsService: OcpiLocationsService,
    private readonly statusLogsService: StatusLogsService,
    private readonly commandBus: CommandBus,
  ) {
  }

  @Post('')
  async updationsCommandHandler(@Body() payloads: OcpiActionsCommandPayload[]): Promise<void> {
    await updationsCommandHandler({
      connectorsService: { update: (args) => this.connectorsService.updateMany(args) },
      evsesService: {
        update: async (args) => {
          const { affectedEvses } = await this.evsesService.updateMany(args);

          this.commandBus.execute(
            new RemoveInvalidEvsesFromElasticsearchCommand(affectedEvses)
          ).finally();
        }
      },
      locationsService: { update: (args) => this.locationsService.updateMany(args) },
      statusLogsService: { store: (args) => this.statusLogsService.saveMany(args) },
      accessScopesService: { store: (args) => Promise.resolve() },
      payloads,
    });
  }
}
