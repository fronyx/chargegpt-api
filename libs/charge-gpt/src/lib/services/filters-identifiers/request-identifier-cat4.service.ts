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
  promptCat4Rules,
  generatePromptFooter,
  detectOutOfScope,
  filterValidSettingsFromResponse,
} from './request-identifier.utils';
import { Tracer } from '../tracer';
import { cat4FewShotExamples } from '../rag-services/cat4-few-shots.model';
import { retrieveCat4Embeddings } from '../rag-services/create-cat4-embedding.service';
import * as Sentry from '@sentry/minimal';
import { SUPPORTED_PEER_ID } from './operator-names.constant';
import { ToolkitProject } from '@fronyx/toolkit';

export enum CategoryPropertiesEnum {
  ONLY_TARIFF_KWH = 'only_tariff_kwh',
  ONLY_TARIFF_MIN = 'only_tariff_min',
}

const IsRagEnabled = false;

export const necessaryInformation: Record<CategoryPropertiesEnum, any> = {
  [CategoryPropertiesEnum.ONLY_TARIFF_KWH]: {
    type: Boolean,
    default: false,
    possibleValues: [true, false],
    description: 'Filters charging points that have a tariff based on kWh.',
  },
  [CategoryPropertiesEnum.ONLY_TARIFF_MIN]: {
    type: Boolean,
    default: false,
    possibleValues: [true, false],
    description: 'Filters charging points that have a tariff based on minutes.',
  },
};

@Injectable()
export class RequestIdentifierCat4Service {
  async identifyFilters(
    history: ConversationHistory,
    project: ToolkitProject
  ): Promise<{
    request: Record<CategoryPropertiesEnum, boolean> | null;
    error: string | undefined;
  }> {
    const userRequest = history.getData().lastUserInput;

    const tracer = new Tracer('identCat4', project.name);
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

    console.log(`### reqIdentCat4 response: ${chatGptResponse}`);

    if (chatGptError) {
      return {
        request: null,
        error: errorMessage,
      };
    }

    const parsedRequest = parseChatGPTJSON(chatGptResponse);
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
    ${promptCat4Rules}
    ${generatePromptFooter('', [], peerId)}
    `)
  );

  const ragFewShots = IsRagEnabled ? await retrieveCat4Embeddings(userRequest, overtConversationSummary) : [];

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
    cat4FewShotExamples.forEach((example) => {
      prompt.push(DialogFactory.fromUser(example.user));
      prompt.push(DialogFactory.fromAssistant(example.assistant));
    });
  }

  prompt.push(
    DialogFactory.fromUser(`Conversation history: {${overtConversationSummary}}

    Currently, the following filters are set: {${filtersString}}.

    User request: ${userRequest}
    Your response: `)
  );

  return prompt;
};
