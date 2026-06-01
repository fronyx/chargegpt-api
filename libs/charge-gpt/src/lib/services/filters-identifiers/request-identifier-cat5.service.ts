import { Injectable } from '@nestjs/common';
import { ConversationHistory } from '../../models/conversation-history.model';
import {
  ProjectOutputType as ChatGptServiceProjectOutputType,
  quickCompletion,
} from '../chat-gpt.service';
import { DialogFactory, Dialog } from '../../models/prompt';
import { parseChatGPTJSON } from '../parse-chatgpt-json.utils';
import {
  generatePromptHeader,
  promptYourFilters,
  promptGeneralRules,
  generatePromptFooter,
  detectOutOfScope,
  filterValidSettingsFromResponse,
} from './request-identifier.utils';
import { Tracer } from '../tracer';
import { cat5FewShotExamples } from '../rag-services/cat5-few-shots.model';
import { retrieveCat5Embeddings } from '../rag-services/create-cat5-embedding.service';
import * as Sentry from '@sentry/minimal';
import { SUPPORTED_PEER_ID } from './operator-names.constant';
import { ToolkitProject } from '@fronyx/toolkit';

export enum CategoryPropertiesEnum {
  ONLY_REMOTE_START_CAPABLE = 'only_remote_start_capable',
  ONLY_AUTO_CHARGE = 'only_auto_charge',
  RESET = 'reset',
}

const resetKeywords = [
  'reset', 
  'start over', 
  'clear',
  'all charge points',
  'all wrong',
  'that is wrong',
  'that is incorrect',
  'that is not correct',
  'that is not right',
  'that is not accurate',
  'that is not what I meant',
  'that is not what I wanted',
  'that is not what I asked for',
  'that is not what I was looking for',
  'that is not what I was searching for',
  'that is not what I was seeking',
  'that is not what I was expecting',
  'that is not what I was hoping',
  'that is not what I was aiming',
  'restart',
  'all filters',
  'all settings',
  'all options',
  'all of them',
  'start again',
  'start from scratch',
  'start from the beginning',
  'start fresh',
  'start anew',
];

const IsRagEnabled = false;

export const necessaryInformation: Record<CategoryPropertiesEnum, any> = {
  [CategoryPropertiesEnum.ONLY_REMOTE_START_CAPABLE]: {
    type: Boolean,
    default: false,
    possibleValues: [true, false],
    description:
      'Filters charging points that can be remotely triggered to start using the App. This it NOT auto start! Only use this filter setting when it is requested specifically and by name! E.g., "remote start capable" or "remote start chargers". Using charging cards or eKey, does deactivate this filter.',
  },
  [CategoryPropertiesEnum.ONLY_AUTO_CHARGE]: {
    type: Boolean,
    default: false,
    possibleValues: [true, false],
    description:
      'Filters for charging points that support automatic (start of) charging - or auto start - by just plugging in the car. Only use this filter setting when it is requested specifically and by name! E.g., "automatic charge" or "auto start chargers" or "autocharge" or "self-charging".',
  },
  [CategoryPropertiesEnum.RESET]: {
    type: Boolean,
    default: false,
    possibleValues: [true, false],
    description:
      'Vital to only use when a reset of ALL filter settings is called. Only use this filter setting when it is requested specifically and by name ("reset" or "start over" or "clear")! See examples and make no further assumptions!',
  },
};

@Injectable()
export class RequestIdentifierCat5Service {
  async identifyFilters(
    history: ConversationHistory,
    project: ToolkitProject
  ): Promise<{
    request: Record<CategoryPropertiesEnum, boolean> | null;
    error: string | undefined;
  }> {
    const userRequest = history.getData().lastUserInput;

    const tracer = new Tracer('identCat5', project.name);
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


    if (chatGptError) {
      return {
        request: null,
        error: errorMessage,
      };
    }

    let parsedRequest = parseChatGPTJSON(chatGptResponse);

    // check user request again keywords for reset detection
    const resetDetected = resetKeywords.some((keyword) => {

        const included = userEnglishTranslation.toLowerCase().includes(keyword)
        if (included) {
          console.log(`Reset detected: ${keyword}`);
        }
        return included;
      }
    );
    if (resetDetected) {
      if (parsedRequest === null) {
        parsedRequest = {};
      }
      parsedRequest[CategoryPropertiesEnum.RESET] = true;
    } else {
      if (parsedRequest !== null) {
        parsedRequest[CategoryPropertiesEnum.RESET] = false;
      }
    }


    console.log(`### reqIdentCat5 response: ${chatGptResponse}`);

    const result = { request: undefined, error: undefined };

    if (parsedRequest !== null) {
      const isValid = !detectOutOfScope(parsedRequest);

      if (isValid) {
        result.request = filterValidSettingsFromResponse(
          parsedRequest,
          Object.keys(necessaryInformation)
        );
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

  prompt.push(
    DialogFactory.fromSystem(`
    ${generatePromptHeader(necessaryInformation)}
    ${promptYourFilters}
    ${JSON.stringify(necessaryInformation)}
    ${promptGeneralRules}
    ${generatePromptFooter('', [], peerId)}
    `)
  );
  //${ promptResetRequestRules }

  const ragFewShots = IsRagEnabled ? await retrieveCat5Embeddings(userRequest, overtConversationSummary) : [];

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
    cat5FewShotExamples.forEach((example) => {
      prompt.push(DialogFactory.fromUser(example.user));
      prompt.push(DialogFactory.fromAssistant(example.assistant));
    });
  }

  prompt.push(
    DialogFactory.fromUser(`Conversation history: {${overtConversationSummary}}

    # You are very strict and remember the above examples with their "example description". 
    User request: ${userRequest}
    Your response: `)
  );

  return prompt;
};
