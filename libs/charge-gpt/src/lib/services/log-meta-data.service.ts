import { Injectable } from '@nestjs/common';
import { chargeGPTLogger } from '../models/chat-utilities';
import {
  setUserNumberOfTurns,
  triggerSendStartConversationMetrics,
} from './conversations-helper.service';
import { differenceInHours } from 'date-fns';
import { ConversationHistory } from '../models/conversation-history.model';
import { Conversation } from '../models/prompt';
import {
  getAllOpenConversationHistory,
  storeConversationHistory,
} from './conversation-persist.service';
import {
  sendFiltersOverallNoTurnsMetric,
  sendFiltersSelectedLanguageMetric,
  sendFiltersSuccessfulConversationMetric,
  sendFiltersTextInteractionMetric,
  sendFiltersVoiceInteractionMetric,
  sendRecommendationsNoTurnsMetric,
  sendSelectedLanguageMetric,
  sendSuccessfulConversationMetric,
  sendTextInteractionMetric,
  sendVoiceInteractionMetric,
} from './conversation-quality.service';
import { ToolkitProject } from '@fronyx/toolkit';

@Injectable()
export class LogMetaDataService {
  async logMetaData(
    history: ConversationHistory,
    project: ToolkitProject,
    payload?: Conversation
  ): Promise<void> {
    const { isSpeechToText } = history.getData();
    const chargegptOutputType = project.chargegpt_output_type;
    const conversationId = history.id;

    if (payload.isVoice || isSpeechToText) {
      await sendVoiceInteractionMetric(project.name);
    } else {
      await sendTextInteractionMetric(project.name);
    }

    chargeGPTLogger(
      conversationId,
      project.name,
      'conversationInput',
      payload.isSuggestion ? 'suggestion' : 'user'
    );

    setUserNumberOfTurns(history);

    if (!history.getIsStartedMetricSent()) {
      sendSelectedLanguageMetric(project.name, history.language);
      await triggerSendStartConversationMetrics(
        history.projectName,
        chargegptOutputType
      );
      history.setIsStartedMetricSent(true);
    }

    await sendRecommendationsNoTurnsMetric(project.name, 'numberOfTurn');

    history.setIsSpeechToText(false);
  }

  async logFiltersConversationTypeMetaData(
    history: ConversationHistory,
    project: ToolkitProject,
    payload?: Conversation
  ): Promise<void> {
    const conversationId = history.id;
    const { isSpeechToText } = history.getData();
    const metricRequests = [];

    if (payload.isVoice || isSpeechToText) {
      await sendFiltersVoiceInteractionMetric(project.name);
    } else {
      await sendFiltersTextInteractionMetric(project.name);
    }

    chargeGPTLogger(
      conversationId,
      project.name,
      'conversationInput',
      payload.isSuggestion ? 'suggestion' : 'user'
    );

    const { userNumberOfTurns } =
      await setUserNumberOfTurns(history);

    if (userNumberOfTurns === 1) {
      chargeGPTLogger(
        conversationId,
        project.name,
        'language',
        history.language
      );
      metricRequests.push(
        sendFiltersSelectedLanguageMetric(project.name, history.language)
      );
    }

    history.setIsSpeechToText(false);

    await Promise.all(metricRequests);
  }

  async sendSuccessCountForConversationThatIsNotDone(): Promise<void> {
    console.log('Closing old open conversations...');

    const conversations = await getAllOpenConversationHistory();

    const oldConversations = conversations
      .filter((history) => !history.getProjectOutputType())
      .filter((history) =>
        isConversationOlderThan6Hours(history.getUpdatedAt())
      );

    for (const history of oldConversations) {
      const { userNumberOfTurns } = history.getData();

      if (history.getIsHelpRequested()) {
        if (isNoSuccessAndNoError(history) || isErrorAndNoSuccess(history)) {
          const promises = [];
          if (history.getProjectOutputType() !== 'filters') {
            promises.push(
              sendSuccessfulConversationMetric(history.getProjectName()),
              sendRecommendationsNoTurnsMetric(
                history.getProjectName(),
                userNumberOfTurns
              )
            );
          } else {
            promises.push(
              sendFiltersSuccessfulConversationMetric(history.getProjectName()),
              sendFiltersOverallNoTurnsMetric(
                history.getProjectName(),
                userNumberOfTurns
              )
            );
          }

          history.setSuccessCounter(1);
          history.setIsConversationFinished(true);
          promises.push(storeConversationHistory(history));

          await Promise.all(promises);
          continue; // This continue is to avoid sending multiple metrics for the same conversation.
        }
      }

      const promises = [];
      if (history.getProjectOutputType() !== 'filters') {
        promises.push(
          sendRecommendationsNoTurnsMetric(
            history.getProjectName(),
            userNumberOfTurns
          )
        );
      } else {
        promises.push(
          sendFiltersOverallNoTurnsMetric(
            history.getProjectName(),
            userNumberOfTurns
          )
        );
      }

      history.setIsConversationFinished(true);
      promises.push(storeConversationHistory(history));

      await Promise.all(promises);
    }

    console.log(`Done closing ${oldConversations.length} conversations.`);
  }
}

function isConversationOlderThan6Hours(updateAt: Date): boolean {
  return differenceInHours(new Date(), updateAt) >= 6;
}

function isNoSuccessAndNoError(conversation: ConversationHistory): boolean {
  const acquiredData = conversation.getData();
  return (
    acquiredData.successConversationCount === 0 &&
    acquiredData.errorConversationCount === 0
  );
}

function isErrorAndNoSuccess(conversation: ConversationHistory): boolean {
  const acquiredData = conversation.getData();
  return (
    acquiredData.errorConversationCount > 0 &&
    acquiredData.successConversationCount === 0
  );
}
