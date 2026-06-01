import { ConversationHistory } from '../models/conversation-history.model';
import {
  ProjectOutputType as ChatGptServiceProjectOutputType,
  quickCompletion,
} from './chat-gpt.service';
import { DialogFactory, Dialog } from '../models/prompt';
import { replaceAssistantName } from './replace-assistant-name.utils';
import { chargeGPTLogger } from '../models/chat-utilities';
import { identifyOperatorNameInRequest } from './filters-identifiers/request-identifier.utils';
import { SUPPORTED_PEER_ID } from './filters-identifiers/operator-names.constant';
import * as Sentry from '@sentry/minimal';
import { retrieveTranslationEmbeddings } from './rag-services/create-translation-embedding.service';
import { translationFewShotExamples } from './rag-services/translation-few-shots.model';
import { Tracer } from './tracer';
import { TOMTOM_POI_CATEGORIES } from './address-services/category-search-utils.service';
import { ToolkitProject } from '@fronyx/toolkit';

const IsRagEnabled = false;

export const rephraseUserRequest = async (
  history: ConversationHistory,
  textFromUser: string,
  language: string,
  project: ToolkitProject
): Promise<{
  translation?: string;
  isError: boolean;
  error?: string;
}> => {
  const projectOutputType =
    project.chargegpt_output_type as ChatGptServiceProjectOutputType;

  const ragTracer = new Tracer('translationRAG', project.name);
  ragTracer.start();

  const prompt: Dialog[] = await getPrompt(
    projectOutputType,
    textFromUser,
    language,
    history.assistantName,
    project.data_source
  );

  ragTracer.end();
  const llmTracer = new Tracer('translationLLM', project.name);
  llmTracer.start();

  const { isError, chatGptResponse, errorMessage } = await quickCompletion(
    prompt,
    history.id,
    project.name,
    project.chargegpt_output_type,
    history.language
  );

  llmTracer.end();

  chargeGPTLogger(
    history.id,
    project.name,
    'englishTranslation',
    `${chatGptResponse} (${textFromUser})`
  );

  if (isError) {
    return {
      isError: true,
      error: errorMessage,
    };
  } else {
    return {
      isError: false,
      translation: chatGptResponse,
    };
  }
};

export const getPrompt = async (
  projectOutputType: ChatGptServiceProjectOutputType,
  textFromUser: string,
  conversationLanguage: string,
  assistantName: string,
  peerId: SUPPORTED_PEER_ID
): Promise<Dialog[]> => {
  const prompt: Dialog[] = [];

  const addDialog = (dialog: Dialog) => {
    addDialogToPrompt(prompt, dialog, assistantName);
  };

  const operatorNameContextPresent = identifyOperatorNameInRequest(
    textFromUser,
    peerId
  );
  const operatorNameContext = operatorNameContextPresent
    ? `Request context: ${operatorNameContextPresent} is a charge points operator`
    : '';

  addDialog(
    DialogFactory.fromSystem(`You are a helpful assistant specialized on translations of user input requests into english as well as improving upon given user requests to make the user intent clearer and its consituent parts more pronounced. You provide the following functionality: translate the user's request into the english language. Try to come up with a concise translation and emphasize the separate aspects of the original request by splitting the original request up. If you cannot translate the user's request, you return the original request without further explanation. You are a translation assistant, not a creative writer.
  You should split up the input request parts into multiple sentences in order to emphasize each of them. That makes the input more clear. Also examples of "fast" or "slow" charging should be put into separate sentences. For example, "I want a fast DC charger" should be split into "I want to charge fast. I want to charge with a DC charge point".


  ≈ Synonyms you should be aware of in this application: "carry" => "charge", "points" => "charging points", "loading" => "charging", "self-charging" => "auto-charging", "kWh" => "kW".

  :stop: Ignore parts of the request that are not relevant to the translation. For example, "hmm", or "well", or "I think" or "after all".

  :stop: Famous POI don't need translated names. Just return them as they are. If you know the city of the POI, you can add it to the translation.

  :stop: Untranslatable or unwanted or inappropriate inputs are not translated. Just copy them over instead.

   ❗️👉 It is extremely important for system functionality that all parts of a user request are split into multiple sentences (including requests for charging near the user's location). DO NOT split POI and location information, like "McDonalds in Essen" or "main station in Frankfurt" or "Subway at main station in Munich" or "A8 highway near Stuttgart". 
   ❗️👉 For famous buildings, always add the city it is in: "Tivoli Gardens" -> "Tivoli Gardens, Copenhagen".
   ❗️👉 Always include categories of POI if mentioned: "toilet on the highway near Prague" -> "toilet, highway, Prague".
   ❗️👉 Details are important, e.g., requests for "very fast" need to be kept as "very fast".
   :stop: Never rephrase more general questions about a destination or about electric vehicle charging, e.g., "How can I charge with a CCS or CHAdeMO charger?"! 
   ❗️👉 Requests for charging along the way to a destination are specified, e.g., request "On my way to Munich I want to stop at a restaurant." -> "I want to charge on my way to Munich. Along the way, I want to stop at a restaurant."
   ❗️👉 Never translate the word "street" from the original language into english, e.g. "Ukaž mi nabíječky na ulici Novodvorská Praha" -> "I want to charge at Novodvorská, Prague.". Or "Auf der Emsau Straße in Rheine laden" -> "I want to cahrge at Emsau Straße, Rheine.". Doing otherwise could interrupt the whole system.

  ${operatorNameContext}

  You stick to the following POI categories when mentioned (NEVER DEVIATE): ${TOMTOM_POI_CATEGORIES.join(
    ', '
  )}  
  🔍❗️ Match the mentioned POI category to one of the available categories above (e.g., "shopping mall" is not available, so use "shopping center" instead)!

  See the following examples:`)
  );

  const ragFewShots = IsRagEnabled
    ? await retrieveTranslationEmbeddings(textFromUser)
    : [];

  if (IsRagEnabled && ragFewShots.length > 0) {
    // retrieve few shots through RAG prompt
    ragFewShots.forEach((doc) => {
      const sentence = doc.value.sentence;
      const projectIds = doc.value.sentence.project_ids
        ? doc.value.sentence.project_ids
        : [];
      if (projectIds.length === 0 || projectIds.includes(projectOutputType)) {
        if (sentence.includes('user') && sentence.includes('assistant')) {
          try {
            const example = JSON.parse(sentence);
            prompt.push(DialogFactory.fromUser(example['user']));
            prompt.push(DialogFactory.fromAssistant(example['assistant']));
          } catch (error) {
            console.error('Error parsing JSON RAG:', error);
            Sentry.captureException(error);
          }
        } else {
          console.log(
            '"user" and "assistant" properties not found in sentence.'
          );
        }
      }
    });
  } else {
    translationFewShotExamples.forEach((example) => {
      prompt.push(DialogFactory.fromUser(example.user));
      prompt.push(DialogFactory.fromAssistant(example.assistant));
    });
  }

  if (conversationLanguage === 'pt') {
    const dialogs = getPortuguesAbbreviationDialog();
    dialogs.forEach((dialog) => addDialog(dialog));
  }

  addDialog(
    DialogFactory.fromUser(`
  # remember to split up all the input request parts into multiple sentences
  # remember to add the city to the POI if you know it. If you don't know it, just forward the POI

  Original language: ${conversationLanguage}
  User request: ${textFromUser}
  Your translation:`)
  );

  return prompt;
};

const addDialogToPrompt = (
  prompt: Dialog[],
  dialog: Dialog,
  assistantName: string
): void => {
  dialog.content = replaceAssistantName(dialog.content, assistantName);
  prompt.push(dialog);
};

const getPortuguesAbbreviationDialog = (): Dialog[] => {
  return [
    DialogFactory.fromUser(`
  # example description: portuguese abbreviations such as "PCN", "NCS", "PCR", "FCS", "PCUR", "UFCS" should NOT be translated
  Original language: european portuguese
  User request: Quero um PCUR em Lisboa
  Your translation:`),
    DialogFactory.fromAssistant('I want a PCUR in Lisbon'),
  ];
};
