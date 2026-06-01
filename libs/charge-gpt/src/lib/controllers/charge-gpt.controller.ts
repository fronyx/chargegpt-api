import {
  Controller,
  Get,
  UseInterceptors,
  Query,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { SentryInterceptor } from '../../../../../apps/sentry/sentry.interceptor';
import {
  Answer,
  AudioFile,
  Conversation,
  Record,
  TextResult,
} from '../models/prompt';
import {
  ProjectScopeChargegptAllowedInputGuard,
  ProjectScopeChargegptAllowedOutputGuard,
  ProjectScopeChargegptFeedbackGuard,
  ProjectScopeChargegptLanguageGuard,
  ReqTokenDecorator,
  ProjectScopeChargegptTimestampGuard,
  ProjectTokensAuthorizationsGuard,
  ProjectScopeChargegptDomainGuard,
  ProjectScopeChargegptFiltersProjectGuard,
  ProjectScopeChargegptRecommendationsGuard,
  ProjectScopeChargegptCoordinatesGuard,
} from '@fronyx/authentications';
import { UnsupportedAudioFormatError } from '../../../../../apps/cdk-apps/src/shared';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  FeedbackDto,
  ConversationRequestPayloadDto,
  ContextUpdateRequestPayloadDto,
} from '../models/conversation-dto';
import {
  AudioFileService,
  ContextService,
  LogMetaDataService,
  FeedbackService,
  ConversationService,
  rephraseUserRequest,
  identifyAddressCharacteristics,
} from '../services';
import {
  recommendationsDocs,
  convertSpeechToTextDocs,
  feedbackDocs,
  filtersDocs,
  startConversationDocs,
  updateContextDocs,
  uploadUrlDocs,
} from './api-docs/api-docs';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { setCurrentCoordinatesToHistory } from '../services/current-coordinates-setter.util';
import { useTryAsync } from 'no-try';
import { ConversationHistory } from '../models/conversation-history.model';
import { calculateTimeDifferentInMilliseconds } from '../services/tracer';
import {
  textToSpeech,
  SupportedLanguage,
} from '../services/audio-services/azure-audio.service';
import { ChargeGPTControllerHandlerService } from '../services/chargegpt-controller-handler.service';
import { StartConversationResponseDto } from '../models/start-conversation-dto';
import { UploadUrlResponseDto } from '../models/upload-url-dto';
import { SpeechToTextResponseDto } from '../models/speech-to-text-dto';
import {
  RecommendationsAnswerDto,
  DestinationDto,
  DestinationResultsDto,
  FiltersDto,
  FiltersResultsDto,
  LocationDto,
  FiltersAnswerDto,
} from '../models/conversation-response-dto';
import { sendFiltersTimeTakenForEachTurnsMetric } from '../services/conversation-quality.service';
import {
  clearLocalAudioFile,
  initializeAudioFileLocally,
} from '../services/audio-services/audio-file.service';
import { ToolkitProject } from '@fronyx/toolkit';
import {
  generateAbusivePromptResponse,
  generateNoInputResponse,
  startConversation,
} from '../services/conversations-helper.service';
import { getHistory } from '../services/conversation-factory.service';
import { validateAudioContent } from '../services/audio-services/audio-analyzer.service';
import {
  getWhisperAudioPayload,
  openAiTranscribeAudio,
} from '../services/audio-services/speech-to-text.service';
import { getJSONLog } from '../models/chat-utilities';
import { configService } from '@fronyx/configurations';
import { storeConversationHistory } from '../services/conversation-persist.service';

@ApiTags('ChargeGPT')
@UseInterceptors(SentryInterceptor)
@Controller('charge-gpt')
export class ChargeGPTController {
  constructor(
    private readonly audioFileService: AudioFileService,
    private readonly conversationService: ConversationService,
    private readonly feedbackService: FeedbackService,
    private readonly contextService: ContextService,
    private readonly logMetaDataService: LogMetaDataService,
    private readonly chargeGptControllerHandler: ChargeGPTControllerHandlerService
  ) {}
  @ApiExcludeEndpoint()
  @Post('rephrase')
  async rephrase(@Body() body): Promise<any> {
    const history = {
      id: 'test',
      assistantName: 'test',
      language: 'en',
    } as ConversationHistory;
    const languageName = 'English UK';
    const project = {
      name: 'test',
      chargegpt_output_type: 'recommendations',
      data_source: 'FRK',
    } as ToolkitProject;
    const rephrasedResult = await rephraseUserRequest(
      history,
      body.request,
      languageName,
      project
    );
    return {
      rephrased: rephrasedResult.translation,
    };
  }

  @ApiExcludeEndpoint()
  @Post('addressCharacterization')
  async addressCharacterization(@Body() body): Promise<any> {
    const history = {
      id: 'test',
      assistantName: 'test',
      language: 'en',
    } as ConversationHistory;
    const languageName = 'en';
    const project = {
      name: 'test',
      chargegpt_output_type: 'recommendations',
      data_source: 'FRK',
    } as ToolkitProject;
    const characterized = await identifyAddressCharacteristics(
      body.request,
      history.id,
      project.name,
      project.chargegpt_output_type,
      languageName
    );
    return {
      characterized,
    };
  }

  @ApiOperation(startConversationDocs.operation)
  @ApiQuery(startConversationDocs.apiQuery.language)
  @ApiQuery(startConversationDocs.apiQuery.currentTimestamp)
  @ApiQuery(startConversationDocs.apiQuery.timezoneOffset)
  @ApiExtraModels(StartConversationResponseDto)
  @ApiSecurity('apiToken')
  @ApiResponse(startConversationDocs.response['200'])
  @ApiResponse(startConversationDocs.response['400'])
  @ApiResponse(startConversationDocs.response['401'])
  @ApiResponse(startConversationDocs.response['403'])
  @Get('conversation')
  @UseGuards(
    ProjectTokensAuthorizationsGuard,
    ProjectScopeChargegptDomainGuard,
    ProjectScopeChargegptLanguageGuard,
    ProjectScopeChargegptTimestampGuard
  )
  async startConversation(
    @ReqTokenDecorator() project: ToolkitProject,
    @Query()
    params: {
      currentTimestamp: string;
      language: string;
      timezoneOffset?: number;
    }
  ): Promise<Answer> {
    let timezoneOffset = 0;

    if (!isNaN(Number(params.timezoneOffset))) {
      timezoneOffset = Number(params.timezoneOffset);
    }

    let languageInput = params.language;
    if (languageInput === 'cs') {
      languageInput = 'cz';
    }

    return startConversation({
      clientTimestamp: params.currentTimestamp,
      language: languageInput,
      timezoneOffset,
      project,
    });
  }

  @ApiOperation(uploadUrlDocs.operation)
  @ApiParam(uploadUrlDocs.apiQuery.conversationId)
  @ApiSecurity('apiToken')
  @ApiExtraModels(UploadUrlResponseDto)
  @ApiResponse(uploadUrlDocs.response['200'])
  @ApiResponse(uploadUrlDocs.response['401'])
  @Get('conversation/:conversationId/upload-url')
  @UseGuards(ProjectTokensAuthorizationsGuard, ProjectScopeChargegptDomainGuard)
  async generatePresignUrl(
    @ReqTokenDecorator() project: ToolkitProject,
    @Param() params: { conversationId: string }
  ): Promise<AudioFile> {
    return this.audioFileService.generatePresignUrl(project, params);
  }

  @ApiOperation(convertSpeechToTextDocs.operation)
  @ApiParam(convertSpeechToTextDocs.apiQuery.conversationId)
  @ApiQuery(convertSpeechToTextDocs.apiQuery.fileId)
  @ApiQuery(convertSpeechToTextDocs.apiQuery.audioFormat)
  @ApiExtraModels(SpeechToTextResponseDto)
  @ApiSecurity('apiToken')
  @ApiResponse(convertSpeechToTextDocs.response['200'])
  @ApiResponse(convertSpeechToTextDocs.response['400'])
  @ApiResponse(convertSpeechToTextDocs.response['401'])
  @ApiResponse(convertSpeechToTextDocs.response['403'])
  @ApiResponse(convertSpeechToTextDocs.response['415'])
  @Get('conversation/:conversationId/speech-to-text')
  @UseGuards(
    ProjectTokensAuthorizationsGuard,
    ProjectScopeChargegptDomainGuard,
    ProjectScopeChargegptAllowedInputGuard
  )
  async convertSpeechToText(
    @ReqTokenDecorator() project: ToolkitProject,
    @Param() params: { conversationId: string },
    @Query()
    queryParams: {
      fileId: string;
      audioFormat?: string;
    }
  ): Promise<TextResult> {
    const audioFormat = queryParams.audioFormat
      ? queryParams.audioFormat.toLowerCase()
      : 'wav';

    if (!UnsupportedAudioFormatError.isValid(audioFormat)) {
      throw new UnsupportedAudioFormatError(
        `Unsupported media type. Submitted type: ${audioFormat}. Accepted type(s): mp3, mp4, mpeg, mpga, m4a, wav and webm.`
      );
    }

    const filePath = await initializeAudioFileLocally(
      queryParams.fileId,
      queryParams.audioFormat
    );

    await validateAudioContent(filePath);

    const history = await getHistory({
      conversationId: params.conversationId,
      project,
    });

    // const [err, text] = await useTryAsync(() =>
    //   sdkTranscribeAudio(filePath, historyLanguageToLocales(history.language))
    // );

    const [err, text] = await useTryAsync(() =>
      openAiTranscribeAudio(() => getWhisperAudioPayload(queryParams.fileId, audioFormat))
    );

    console.log(err, text);

    clearLocalAudioFile(filePath);

    history.setIsSpeechToText(true);
    await storeConversationHistory(history);

    const response: TextResult = { isSuccessful: !err, text, audioUrl: null };

    const apiVersion = project.response.find(({ name }) => name === 'version');
    if (apiVersion.value === 1) {
      response.versionNumber = configService.getApiVersion();
    }

    console.info(
      getJSONLog(
        history.id,
        history.projectName,
        '[convertSpeechToTextAzureOpenAI] language: ',
        history.language
      )
    );

    console.info(
      getJSONLog(
        history.id,
        history.projectName,
        '[convertSpeechToTextAzureOpenAI] text: ',
        text
      )
    );

    return response;
  }

  @ApiOperation(recommendationsDocs.operation)
  @ApiParam(recommendationsDocs.apiQuery.conversationId)
  @ApiSecurity('apiToken')
  @ApiExtraModels(
    ConversationRequestPayloadDto,
    RecommendationsAnswerDto,
    DestinationDto,
    FiltersDto,
    LocationDto,
    FiltersResultsDto,
    DestinationResultsDto
  )
  @ApiBody(recommendationsDocs.body)
  @ApiResponse(recommendationsDocs.response['201'])
  @ApiResponse(recommendationsDocs.response['400'])
  @ApiResponse(recommendationsDocs.response['401'])
  @ApiResponse(recommendationsDocs.response['403'])
  @Post('conversation/:conversationId/recommendations')
  @UseGuards(
    ProjectTokensAuthorizationsGuard,
    ProjectScopeChargegptDomainGuard,
    ProjectScopeChargegptRecommendationsGuard,
    ProjectScopeChargegptCoordinatesGuard
  )
  async findChargegptRecommendations(
    @ReqTokenDecorator() project: ToolkitProject,
    @Param() params: { conversationId: string },
    @Body() body: Conversation
  ): Promise<Answer> {
    return this.chargeGptControllerHandler.findChargegptRecommendations(
      project,
      params,
      body
    );
  }

  @ApiOperation(filtersDocs.operation)
  @ApiParam(filtersDocs.apiQuery.conversationId)
  @ApiSecurity('apiToken')
  @ApiExtraModels(
    ConversationRequestPayloadDto,
    FiltersAnswerDto,
    DestinationDto,
    FiltersDto,
    LocationDto,
    FiltersResultsDto,
    DestinationResultsDto
  )
  @ApiBody(filtersDocs.body)
  @ApiResponse(filtersDocs.response['201'])
  @ApiResponse(filtersDocs.response['400'])
  @ApiResponse(filtersDocs.response['401'])
  @ApiResponse(filtersDocs.response['403'])
  @Post('conversation/:conversationId/filters')
  @UseGuards(
    ProjectTokensAuthorizationsGuard,
    ProjectScopeChargegptDomainGuard,
    ProjectScopeChargegptFiltersProjectGuard,
    ProjectScopeChargegptCoordinatesGuard
  )
  async findChargegptFilters(
    @ReqTokenDecorator() project: ToolkitProject,
    @Param() params: { conversationId: string },
    @Body() body: Conversation
  ): Promise<Answer> {
    const startConversation = new Date();
    const conversationId = params.conversationId;
    const history = await getHistory({
      conversationId,
      project,
    });

    if (!isObjectEmpty(body?.currentCoordinates)) {
      setCurrentCoordinatesToHistory(history, body.currentCoordinates);
    }

    if (isEmptyString(body?.text) && !history.isCurrentCoordinatesRequested()) {
      return generateNoInputResponse(project, history);
    }

    this.logMetaDataService.logFiltersConversationTypeMetaData(
      history,
      project,
      body
    );

    if (!isEmptyString(body?.text)) {
      const abusiveCheckResult =
        await this.chargeGptControllerHandler.isTextAbusive({
          text: body.text,
          history,
          project,
        });

      if (abusiveCheckResult.isError) {
        return generateAbusivePromptResponse(
          history,
          abusiveCheckResult.error.message,
          project,
          abusiveCheckResult.metaData
        );
      }
    }

    try {
      if (history.isCurrentCoordinatesRequested()) {
        return await this.contextService.askChargeGptWithAdditionalContext({
          project,
          history,
          text: body.text,
          deniedContext: body.deniedContext,
        });
      } else {
        return await this.conversationService.processChat(
          history,
          body.text,
          project
        );
      }
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error;
    } finally {
      const endConversation = new Date();
      const diffTimeInSeconds = calculateTimeDifferentInMilliseconds(
        startConversation,
        endConversation
      );

      const [sendMetricError] = await useTryAsync(() =>
        sendFiltersTimeTakenForEachTurnsMetric(
          project.name,
          'timeTakenForATurnInSecond',
          diffTimeInSeconds
        )
      );
      if (sendMetricError) {
        console.error('Error sending filters time taken metric:');
        console.error(JSON.stringify(sendMetricError, null, 2));
      }
    }
  }

  @ApiOperation(updateContextDocs.operation)
  @ApiParam(updateContextDocs.apiQuery.conversationId)
  @ApiSecurity('apiToken')
  @ApiExtraModels(ContextUpdateRequestPayloadDto)
  @ApiBody(updateContextDocs.body)
  @ApiResponse(updateContextDocs.response['204'])
  @ApiResponse(updateContextDocs.response['400'])
  @ApiResponse(updateContextDocs.response['401'])
  @HttpCode(204)
  @Patch('conversation/:conversationId/context')
  @UseGuards(ProjectTokensAuthorizationsGuard, ProjectScopeChargegptDomainGuard)
  async updateContext(
    @ReqTokenDecorator() project: ToolkitProject,
    @Param() params: { conversationId: string },
    @Body() body: Record[]
  ): Promise<void> {
    if (!body || body.length === 0) {
      return;
    }

    await this.contextService.recordUserActivity({
      project,
      conversationId: params.conversationId,
      records: body,
    });
  }

  @ApiOperation(feedbackDocs.operation)
  @ApiParam(feedbackDocs.apiQuery.conversationId)
  @ApiSecurity('apiToken')
  @ApiResponse(feedbackDocs.response['204'])
  @ApiResponse(feedbackDocs.response['400'])
  @ApiResponse(feedbackDocs.response['401'])
  @HttpCode(204)
  @Post('conversation/:conversationId/feedback')
  @UseGuards(
    ProjectTokensAuthorizationsGuard,
    ProjectScopeChargegptDomainGuard,
    ProjectScopeChargegptFeedbackGuard
  )
  async collectFeedback(
    @ReqTokenDecorator() project: ToolkitProject,
    @Param() params: { conversationId: string },
    @Body() body: FeedbackDto
  ): Promise<void> {
    const parsedRating = Number(body.rating);

    this.feedbackService.submitFeedback({
      project,
      conversationId: params.conversationId,
      feedback: parsedRating < 0 ? '-1' : '+1',
      text: body.text,
      responseId: body.responseId,
    });
  }

  @ApiExcludeEndpoint()
  @Get('text-to-speech')
  @UseGuards(
    ProjectTokensAuthorizationsGuard,
    ProjectScopeChargegptDomainGuard,
    ProjectScopeChargegptAllowedOutputGuard
  )
  async convertTextToSpeech(
    @Query()
    params: {
      conversationId: string;
      text: string;
      language: SupportedLanguage;
    }
  ): Promise<{ audioUrl: string }> {
    const audioUrl = await textToSpeech(params.text, params.language);

    return { audioUrl };
  }
}
