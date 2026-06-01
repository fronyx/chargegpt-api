import { queryProjectByToken } from '@fronyx/toolkit';
import { initializeChargeGPTConversation } from '../conversation-factory.service';
import {
  getRecord,
  initRecord,
  saveRecord,
  WhatsAppRecord,
} from './whatsapp-record-persist.service';
import { ConversationHistory } from '../../models/conversation-history.model';
import {
  getConversationHistoryData,
  storeConversationHistory,
} from '../conversation-persist.service';
import { IChargeGPTControllerHandlerService } from '../chargegpt-controller-handler.service';
import { Conversation } from '../../models/prompt';
import {
  sendMessage,
  sendRecommendation,
  sendFAQHelpCTA,
  askUserLocation,
  sendChargeGPTNotAvailableMessage,
  sendMessageSeen,
  sendConversationRestartedMessage,
  askUserToChooseDestination,
  getWhatsAppAudioFormData,
} from './whatsapp.service';
import { differenceInMinutes } from 'date-fns';
import { welcomeMessage } from '../../models/charge-gpt-translation.assets';
import { getPhoneToProjectMapConfig } from './whatsapp-middleware-configs-persist.service';
import { openAiTranscribeAudio } from '../audio-services/speech-to-text.service';

const projectByToken = {};
const whatsAppProjectToken = 'f3a6c25c-1910-454e-ae51-1bf143510693';

export interface Message {
  text: string;
  id: string;
  isVoice?: boolean;
}

export interface AudioDataMessage {
  data: {
    mime_type: string;
    sha256: string;
    id: string;
    voice: boolean;
  };
  id: string;
}

const FronyxTimezoneOffset = -120;

const getWhatsAppProject = async () => {
  if (!projectByToken[whatsAppProjectToken]) {
    projectByToken[whatsAppProjectToken] = await queryProjectByToken(
      whatsAppProjectToken
    );
  }

  return projectByToken[whatsAppProjectToken];
};

const getRecipientProject = async (recipient: string) => {
  const config = await getPhoneToProjectMapConfig(recipient);
  if (!config) {
    return getWhatsAppProject();
  }

  if (!projectByToken[config.value.apiToken]) {
    projectByToken[config.value.apiToken] = await queryProjectByToken(
      config.value.apiToken
    );
  }

  return projectByToken[config.value.apiToken];
};

export const initializeNewConversation = async (
  recipient: string
): Promise<ConversationHistory> => {
  const project = await getRecipientProject(recipient);
  const featureFlags = project.feature_flags;

  const serverTime = new Date();

  const conversationPayload = {
    clientTimestamp: serverTime.getTime(),
    language: 'en',
    featureFlags,
    timezoneOffset: FronyxTimezoneOffset,
    project,
  };

  const conversation = initializeChargeGPTConversation(conversationPayload);

  return conversation;
};

export const getActiveConversation = async (
  id: string,
  informNewConversationStartedFn?: (recipient: string) => void
): Promise<ConversationHistory> => {
  const project = await getRecipientProject(id);
  const record = await getRecord(id, project.name);

  if (!record) {
    const record = createNewRecord(id, project.name);
    const conversation = await initializeNewConversation(id);
    record.conversationIds.push(conversation.id);
    record.activeConversationId = conversation.id;

    await Promise.all([
      saveRecord(record),
      storeConversationHistory(conversation),
    ]);

    return conversation;
  }

  const conversationData = await getConversationHistoryData(
    'production', // TODO fix this after we have production instance
    project.name,
    record.activeConversationId
  );
  const conversation = new ConversationHistory(conversationData);

  // Restart conversation if older than 15 minutes
  if (differenceInMinutes(new Date(), conversation.getUpdatedAt()) >= 15) {
    if (informNewConversationStartedFn) {
      await informNewConversationStartedFn(id);
    }

    const conversation = await startNewConversation(record);

    return conversation;
  }

  return conversation;
};

const restartConversation = async (id: string) => {
  const project = await getRecipientProject(id);
  const record = await getRecord(id, project.name);
  const conversation = await startNewConversation(record);

  return conversation;
};

export const startNewConversation = async (record: WhatsAppRecord) => {
  const conversation = await initializeNewConversation(record.id);
  record.conversationIds.push(conversation.id);
  record.activeConversationId = conversation.id;

  await Promise.all([
    saveRecord(record),
    storeConversationHistory(conversation),
  ]);
  return conversation;
};

export const createNewRecord = (
  recipient: string,
  projectName: string
): WhatsAppRecord => {
  const record = initRecord(recipient, projectName);
  return record;
};

export const replyMessage = async (
  recipient: string,
  message: Message,
  chargeGPTHandler?: IChargeGPTControllerHandlerService
) => {
  const activeConversation = await getActiveConversation(
    recipient,
    sendHelloAgain
  );

  if (chargeGPTHandler) {
    await sendMessageSeen(message.id);

    const response = await chargeGPTHandler.findChargegptRecommendations(
      await getRecipientProject(recipient),
      { conversationId: activeConversation.id },
      { text: message.text, isVoice: message.isVoice } as Conversation
    );

    if (response?.isClosed) {
      await restartConversation(recipient);
      await sendConversationRestartedMessage(recipient);
      return;
    }

    if (!response) {
      await sendChargeGPTNotAvailableMessage(recipient);
      return;
    }

    if (response.provideContext === 'Location') {
      await askUserLocation(recipient, 'Please share your current location.');
      return;
    }

    if (response.isRequestOutOfScope) {
      await sendFAQHelpCTA(recipient, response.prompt);
    } else {
      await sendAssistantMessage(recipient, response.prompt, response.results);
    }
  }
};

export const replyMessageThatHasUserLocationInfo = async (
  recipient: string,
  coordinates: { latitude: number; longitude: number },
  chargeGPTHandler?: IChargeGPTControllerHandlerService
) => {
  const activeConversation = await getActiveConversation(recipient);
  const currentCoordinates = {
    lat: coordinates.latitude,
    lng: coordinates.longitude,
  };

  if (chargeGPTHandler) {
    const response = await chargeGPTHandler.findChargegptRecommendations(
      await getRecipientProject(recipient),
      { conversationId: activeConversation.id },
      { currentCoordinates } as Conversation
    );

    if (!response) {
      await sendChargeGPTNotAvailableMessage(recipient);
      return;
    }

    if (response.isRequestOutOfScope) {
      await sendFAQHelpCTA(recipient, response.prompt);
    } else {
      await sendAssistantMessage(recipient, response.prompt, response.results);
    }
  }
};

export const replyVoiceMessage = async (
  recipient: string,
  message: AudioDataMessage,
  chargeGPTHandler?: IChargeGPTControllerHandlerService
) => {
  const text = await openAiTranscribeAudio(() => getWhatsAppAudioFormData(message.data.id));
  return replyMessage(
    recipient,
    { text, id: message.id, isVoice: true },
    chargeGPTHandler
  );
};

export const sendWelcomeMessage = async (recipient: string) => {
  const message = welcomeMessage('en');
  await sendMessage(recipient, message);
};

export const sendAssistantMessage = async (
  recipient: string,
  message: string,
  results: any
) => {
  if (isThereAnyAddressOptions(message)) {
    await askUserToChooseDestination(recipient, message);
    return;
  }

  await sendMessage(recipient, message);

  if (results && results.data?.length > 0) {
    const chargingStations = results.data;
    const [firstStation] = chargingStations;
    const origin = results?.origin ?? null;
    const poi = results?.poi ?? null;

    await sendRecommendation(recipient, firstStation, results.destination, origin, poi);
  }
};

export const sendHelloAgain = async (recipient: string) => {
  await sendMessage(
    recipient,
    // eslint-disable-next-line quotes
    "Hello again! I've started a new conversation thread for you."
  );
};

export const sendNotSupportedMessage = async (recipient: string) => {
  await sendMessage(
    recipient,
    // eslint-disable-next-line quotes
    `I'm sorry, currently I don't support media, contact and poll messages.`
  );
};

export const isThereAnyAddressOptions = (text: string): boolean => {
  return /(\d\.\))/g.test(text);
};
