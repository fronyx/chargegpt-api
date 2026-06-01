import {
  Body,
  Controller,
  Post,
  Put,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { SentryInterceptor } from '../../../sentry/sentry.interceptor';
import { AccessScopeService } from '@fronyx/authentications';
import { ApiExcludeController } from '@nestjs/swagger';
import { LogMetaDataService } from '@fronyx/charge-gpt';

@ApiExcludeController()
@UseInterceptors(SentryInterceptor)
@Controller('access-scopes')
export class AccessScopesController {
  constructor(
    private readonly service: AccessScopeService,
    private readonly logMetaDataService: LogMetaDataService
  ) {}

  @Post('toolkit/evses/:apiToken')
  async triggerInitializationOfScopeData(@Param() params): Promise<void> {
    await this.service.runScopeDataInitializationTask(params.apiToken);
  }

  @Put('toolkit/evses')
  async deleteEvsesFromCacheAndDB(
    @Body() body: { apiTokenProjects: string[] }
  ): Promise<void> {
    await this.service.runRemoveDataOutOfScopeTask(body.apiTokenProjects);
  }

  @Post('process/success-count')
  async processSuccessCount(): Promise<void> {
    console.log('Trigger closing conversations process...');
    this.logMetaDataService
      .sendSuccessCountForConversationThatIsNotDone()
      .then()
      .catch((err) => {
        console.error('Error trigger closing conversation process:');
        console.error(err);
      });
    console.log('Closing conversations process triggered.');
  }
}
