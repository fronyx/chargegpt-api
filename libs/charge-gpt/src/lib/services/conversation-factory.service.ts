import { ConversationHistory } from '../models/conversation-history.model';
import { generateUUID } from '../../../../../apps/cdk-apps/src/shared/models/general/generate-uuid';
import { StartRecommendationConversation } from '../../../../../apps/cdk-apps/src/shared/models/general/chargegpt-translation';
import { DialogFactory, ProjectOutputType } from '../models/prompt';
import { configService } from '@fronyx/configurations';
import { TranslationsService } from '@fronyx/translations';
import { getChargeGptFilterStart } from '../models/charge-gpt-translation.assets';
import { getConversationHistoryData } from './conversation-persist.service';
import { ToolkitProject } from '@fronyx/toolkit';

export const getHistory = async (payload: {
  conversationId?: string;
  clientTimestamp?: number | string;
  timezoneOffset?: number;
  language?: string;
  project: ToolkitProject;
}): Promise<ConversationHistory> => {
  if (!payload.conversationId) {
    const featureFlags = configService.isProduction()
      ? payload.project.feature_flags
      : payload.project.feature_flags_staging;
    return initializeChargeGPTConversation({
      clientTimestamp: payload.clientTimestamp,
      language: payload.language ?? 'de',
      featureFlags,
      timezoneOffset: payload.timezoneOffset,
      project: payload.project,
    });
  }

  const getConversationStage = () => {
    if (payload.project.name.includes('whatsapp')) {
      return 'production';
    }

    return configService.isProduction() ? 'production' : 'staging';
  };

  const historyData = await getConversationHistoryData(
    getConversationStage(),
    payload.project.name,
    payload.conversationId
  );

  if (!historyData) {
    throw new Error('Unknown Conversation ID.');
  }

  const history = new ConversationHistory(historyData);

  return history;
};

export const initializeChargeGPTConversation = (payload: {
  language: string;
  clientTimestamp: number | string;
  timezoneOffset?: number;
  featureFlags?: Record<string, boolean>;
  project: ToolkitProject;
}): ConversationHistory => {
  const conversationId = generateUUID();

  const translation = new TranslationsService(payload.language);
  translation.setAsset(
    'StartRecommendationConversation',
    StartRecommendationConversation
  );

  const history = new ConversationHistory({
    id: conversationId,
    projectName: payload.project.name,
    projectOutputType: payload.project.chargegpt_output_type,
    clientTimestamp: payload.clientTimestamp
      ? Number(payload.clientTimestamp)
      : Date.now(),
    language: payload.language,
    timezoneOffset: payload.timezoneOffset - new Date().getTimezoneOffset(),
    assistantName: payload.project.chargegpt_assistant_name,
    companyName: payload.project.chargegpt_company_name,
  });

  const dialog =
    payload.project.chargegpt_output_type === ProjectOutputType.filters
      ? getChargeGptFilterStart(payload.project, payload.language)
      : translation.get('StartRecommendationConversation');
  history.addDialog(DialogFactory.fromAssistant(dialog), false);

  return history;
};
