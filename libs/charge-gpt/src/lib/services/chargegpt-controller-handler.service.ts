import { Injectable } from '@nestjs/common';
import { Answer, Conversation } from '../models/prompt';
import { calculateTimeDifferentInMilliseconds } from '../services/tracer';
import { setCurrentCoordinatesToHistory } from '../services/current-coordinates-setter.util';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { generateAbusivePromptResponse, generateNoInputResponse } from './conversations-helper.service';
import { ConversationService } from './conversations.service';
import { ContextService } from './context.service';
import { LogMetaDataService } from './log-meta-data.service';
import { ConversationHistory } from '../models/conversation-history.model';
import { AbuseDetectionService } from './abuse-detection.service';
import { sendRecommendationsTimeTakenForEachTurnsMetric } from './conversation-quality.service';
import { ToolkitProject } from '@fronyx/toolkit';
import { getHistory } from './conversation-factory.service';

@Injectable()
export class ChargeGPTControllerHandlerService
  implements IChargeGPTControllerHandlerService
{
  constructor(
    private readonly conversationService: ConversationService,
    private readonly contextService: ContextService,
    private readonly logMetaDataService: LogMetaDataService,
    private readonly abuseDetectionService: AbuseDetectionService,
  ) {}

  async findChargegptRecommendations(
    project: ToolkitProject,
    params: { conversationId: string },
    body: Conversation
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
      return generateNoInputResponse(
        project,
        history
      );
    }

    this.logMetaDataService.logMetaData(history, project, body);

    if (!isEmptyString(body?.text)) {
      const abusiveCheckResult = await this.isTextAbusive({
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
      const diffTimeInMilliseconds = calculateTimeDifferentInMilliseconds(
        startConversation,
        endConversation
      );

      await sendRecommendationsTimeTakenForEachTurnsMetric(
        project.name,
        'timeTakenForATurnInMillisecond',
        diffTimeInMilliseconds
      );
    }
  }

  async isTextAbusive(payload: {
    history: ConversationHistory;
    project: ToolkitProject;
    text: string;
  }): Promise<{
    isError: boolean;
    error?: {
      message?: string;
      internalMessage?: string;
    };
    metaData?: {
      isCharacterLimitReached?: boolean;
      isContainsBlockedTerm?: boolean;
    };
  }> {
    return await this.abuseDetectionService.validateAbusiveTerm(
      payload.text,
      payload.history,
      payload.project
    );
  }
}

export interface IChargeGPTControllerHandlerService {
  findChargegptRecommendations: (
    project: ToolkitProject,
    params: { conversationId: string },
    body: Conversation,
    retryCount?: number
  ) => Promise<Answer>;
}
