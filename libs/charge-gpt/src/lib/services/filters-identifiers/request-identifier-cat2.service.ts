import { Injectable } from '@nestjs/common';
import { ConversationHistory } from '../../models/conversation-history.model';
import { 
  ProjectOutputType as ChatGptServiceProjectOutputType, 
  quickCompletion
} from '../chat-gpt.service';
import { DialogFactory, Dialog } from '../../models/prompt';
import { parseChatGPTJSON } from '../parse-chatgpt-json.utils';
import {
  generatePromptHeader,
  promptYourFilters,
  promptGeneralRules,
  promptCat2Rules,
  generatePromptFooter,
  detectOutOfScope,
  filterValidSettingsFromResponse,
} from './request-identifier.utils';
import { Tracer } from '../tracer';
import { cat2FewShotExamples } from '../rag-services/cat2-few-shots.model';
import * as Sentry from '@sentry/minimal';
import { retrieveCat2Embeddings } from '../rag-services/create-cat2-embedding.service';
import { SUPPORTED_PEER_ID } from './operator-names.constant';
import { ToolkitProject } from '@fronyx/toolkit';

export enum CategoryPropertiesEnum {
  ONLY_FREE = 'only_free',
  HIDE_COMING_SOON = 'hide_coming_soon',
  HIDE_NOT_AVAILABLE = 'hide_not_available',
}

const IsRagEnabled = false;

export const necessaryInformation: Record<CategoryPropertiesEnum, any>= {
  [CategoryPropertiesEnum.ONLY_FREE]: {
    type: Boolean,
    default: false,
    possibleValues: [true, false],
    description: 'When set to true, only free charging points or charging stations are shown. Only set if "free" or "no cost" or "not paid" is requested specifically. E.g., "free charge points" => set to true. Deactivate if "not free" (or "paid") is requested specifically, e.g., "paid charging stations" => set to false.'
  },
  [CategoryPropertiesEnum.HIDE_COMING_SOON]: {
    type: Boolean,
    default: false,
    possibleValues: [true, false],
    description: 'Hides charging points that are labeled as "coming soon". Only set if "coming soon" is requested specifically. E.g., "hide coming soon charge points".'
  },
  [CategoryPropertiesEnum.HIDE_NOT_AVAILABLE]: {
    type: Boolean,
    default: false,
    possibleValues: [true, false],
    description: 'By default set to false. Do not assume that availability is wanted! This filter hides charging points that are currently not available or have no state or the state is unknown if set to true. Set if "availability" is requested specifically. E.g., "available charge points" or "open charge points". DO NOT INTERPRET OR ASSUME ANYTHING ELSE, because this filter needs to be triggered by name!'
  },
};

@Injectable()
export class RequestIdentifierCat2Service {
  async identifyFilters(
    history: ConversationHistory,
    project: ToolkitProject,
  ): Promise<{
    request: Record<CategoryPropertiesEnum, boolean> | null,
    error: string | undefined
  }> {
    const userRequest = history.getData().lastUserInput;
    
    const tracer = new Tracer('identCat2', project.name);
    tracer.start(); 

    if (!history.getData().lastUserInput) {
      return {
        request: null,
        error: 'No user request found in history.',
      };
    }

    const userEnglishTranslation =
      history.getData().english_translation ?? userRequest;
    const handledFilters: string[] = Object.keys(necessaryInformation);
    const availableFilters = handledFilters.filter(
      (filter) => history.getData()[filter]
    );
    const filterStatus = availableFilters.map((filter) => {
      return `"${filter}": ${JSON.stringify(history.getData()[filter])}`;
    });
    const projectOutputType = project.chargegpt_output_type as ChatGptServiceProjectOutputType;

    const prompt = await getPrompt(projectOutputType, userEnglishTranslation, filterStatus.join(', '), history.getOvertConversationSummary(), project.data_source);
    const {
      isError: chatGptError,
      chatGptResponse,
      errorMessage,
    } = await quickCompletion(prompt, history.id, project.name, projectOutputType, history.language);

    tracer.end();

    console.log(`### reqIdentCat2 response: ${chatGptResponse}`);

    let parsedResponse: any;

    if (chatGptResponse !== 'null') {
      parsedResponse = parseChatGPTJSON(chatGptResponse);

      if (parsedResponse?.hide_not_available === 'true') {
        parsedResponse.hide_not_available = true;
      }
    } else {
      parsedResponse = null;
    }

    if (chatGptError) {
      return {
        request: null,
        error: errorMessage,
      };
    }

    const result = { request: undefined, error: undefined };

    if (parsedResponse !== null) {
      const isValid = !detectOutOfScope(parsedResponse);

      if (isValid) {
        result.request = filterValidSettingsFromResponse(parsedResponse, Object.keys(necessaryInformation));
      } else {
        result.request = null;
      }
    }

    return result;
  }
}

export const getPrompt = async (
  projectOutputType: ChatGptServiceProjectOutputType,
  userRequest: string,
  filtersString: string,
  overtConversationSummary: string,
  peerId: SUPPORTED_PEER_ID,
): Promise<Dialog[]> => {
  const prompt: Dialog[] = [];

  prompt.push(DialogFactory.fromSystem(`
  ${generatePromptHeader(necessaryInformation)}
  ${promptYourFilters}
  ${JSON.stringify(necessaryInformation)}
  ${promptGeneralRules}
  ${promptCat2Rules}
  ${generatePromptFooter('', [], peerId)}
  `));

  const ragFewShots = IsRagEnabled ? await retrieveCat2Embeddings(userRequest, overtConversationSummary) : [];

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
    cat2FewShotExamples.forEach((example) => {
      prompt.push(DialogFactory.fromUser(example.user));
      prompt.push(DialogFactory.fromAssistant(example.assistant));
    });
  }

  prompt.push(DialogFactory.fromUser(`Conversation history: {${overtConversationSummary}}

  Currently, the following filters are set: {${filtersString}}.

  User request: ${userRequest}
  Your response: `));

  return prompt;
};
