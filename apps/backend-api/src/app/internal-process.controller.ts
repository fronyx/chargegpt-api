import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SentryInterceptor } from '../../../sentry/sentry.interceptor';
import { InternalCommand, InternalProcessService } from './services/internal-process.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@UseInterceptors(SentryInterceptor)
@Controller('internal-process')
@UsePipes(new ValidationPipe({ transform: true }))
export class InternalProcessController {
  constructor(
    private readonly service: InternalProcessService,
  ) {
  }

  @Post('command')
  async runCommand(@Body() body: InternalCommand): Promise<void> {
  }
}
