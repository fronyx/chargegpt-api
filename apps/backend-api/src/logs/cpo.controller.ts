import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../../../sentry/sentry.interceptor';
import { OcpiCposService } from '@fronyx/persistence';
import { Cpo } from '../../../cdk-apps/src/shared/domain/logging';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@UseInterceptors(SentryInterceptor)
@Controller('cpo')
export class CpoController {
  constructor(
    private readonly cpoService: OcpiCposService,
  ) {
  }

  @Get('')
  async getCpos(): Promise<Cpo[]> {
    return await this.cpoService.findAll();
  }

  @Get('active')
  async getActiveCpos(): Promise<Cpo[]> {
    return await this.cpoService.findAllActive();
  }
}
