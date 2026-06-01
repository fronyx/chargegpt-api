import { Injectable } from '@nestjs/common';
import { DialogFactory, MAX_TURNS, Answer } from '../models/prompt';
import { sanitizeText } from '../../../../../apps/cdk-apps/src/shared';
import { getChargeGptFilterMaliciousTermErrorMessage } from '../models/charge-gpt-translation.assets';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { TranslationsService } from '@fronyx/translations';
import { ConversationsAgentService } from './conversations-agent.service';
import { ConversationSummaryService } from './conversation-summary.service';
import {
  answer,
  generateAbusivePromptResponse,
  handleConversationTooLong,
} from './conversations-helper.service';
import { ConversationHistory } from '../models/conversation-history.model';
import { rephraseUserRequest } from './request-translation.service';
import { ToolkitProject } from '@fronyx/toolkit';

@Injectable()
export class ConversationService {
  constructor(
    private readonly filtersAgentService: ConversationsAgentService,
    private readonly conversationSummaryService: ConversationSummaryService
  ) {}

  async processChat(
    history: ConversationHistory,
    unsanitizeText: string,
    project: ToolkitProject
  ): Promise<Answer> {
    const textFromUser = sanitizeText(unsanitizeText ?? '');
    const userNumberOfTurns = history.getUserNumberOfTurns();

    if (userNumberOfTurns > MAX_TURNS) {
      handleConversationTooLong(history, project);
      return answer({
        history,
        project,
        isClosed: true,
      });
    }

    const overtConversation = history.getOvertConversation();
    if (overtConversation.length > 0) {
      const summaryResponse = await this.conversationSummaryService.process(
        history,
        project
      );
      history.setOvertConversationSummary(
        !summaryResponse.isError ? summaryResponse.response : ''
      );
    }

    if (textFromUser) {
      history.addDialog(DialogFactory.fromUser(textFromUser), true);
      const languageName = new TranslationsService(
        history.language
      ).getLanguageName();
      const requestTranslation = await rephraseUserRequest(
        history,
        textFromUser,
        languageName,
        project
      );

      if (
        requestTranslation.isError ||
        isEmptyString(requestTranslation?.translation)
      ) {
        console.error(requestTranslation.error);
        const errorMessage = getChargeGptFilterMaliciousTermErrorMessage(
          project,
          history.language
        );
        return generateAbusivePromptResponse(history, errorMessage, project);
      }

      history.setEnglishTranslation(
        requestTranslation.translation ?? textFromUser
      );
    }

    history.setLastUserInput(textFromUser);
    history.setSwitchReason('');
    history.setIsRequestOutOfScope(false);
    history.setIsHelpRequested(false);
    history.setDone(false); // necessary for continuous refinement of filter settings to work

    if (Number(history.numberOfTurnsSubcomponent) > MAX_TURNS) {
      handleConversationTooLong(history, project);
      return answer({
        history,
        project,
        isClosed: true,
      });
    }

    return this.filtersAgentService.process(history, project);
  }
}
