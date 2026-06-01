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
  promptCat6Rules,
  promptGeneralRules,
  generatePromptFooter,
  detectOutOfScope,
} from './request-identifier.utils';
import { Tracer } from '../tracer';
import { cat6FewShotExamples } from '../rag-services/cat6-few-shots.model';
import { retrieveCat6Embeddings } from '../rag-services/create-cat6-embedding.service';
import * as Sentry from '@sentry/minimal';
import { SUPPORTED_PEER_ID } from './operator-names.constant';
import { ToolkitProject } from '@fronyx/toolkit';

export enum CategoryPropertiesEnum {
  TYPE_OF_LOCATIONS = 'type_of_locations',
  TYPE_OF_LOCATIONS_ENABLED = 'type_of_locations_enabled',
  PLUG_TYPES_ENABLED = 'plug_types_enabled',
}

const IsRagEnabled = true;

export const necessaryInformation: Record<CategoryPropertiesEnum, any> = {
  [CategoryPropertiesEnum.TYPE_OF_LOCATIONS]: {
    type: [],
    default: [],
    possibleValues: [
      'Restaurant',
      'Hotel',
      'Supermarket',
      'Shopping center',
      'Service station',
      'Motorway service station',
      'Paid parking',
      'Free car park',
      'Dealer',
      'Taxi',
      'Company',
      'Store',
      'Workshop',
      'Camping',
      'Airport',
    ], //'Public road', 'Public street', 'Other'
    description:
      'An array of location types to filter for. Only these types of locations are valid and they have to be requested specifically and by name. If the user requests type of location you also enable the type_of_locations_enabled. Only set type of locations if a possibleValue is requested specifically! Never ever assume the type_of_location about a requested location name!',
  },
  [CategoryPropertiesEnum.TYPE_OF_LOCATIONS_ENABLED]: {
    type: Boolean,
    default: false,
    possibleValues: [true, false],
    description:
      'Determines whether the type_of_locations filter is active. Only use this filter setting when a specific type_of_locations is requested by name. Never ever assume to know the type of location just by the name of a location!',
  },
  [CategoryPropertiesEnum.PLUG_TYPES_ENABLED]: {
    type: Boolean,
    default: false,
    possibleValues: [true, false],
    description:
      'Determines whether the filter for compatible types of plug or connector or socket is active. Filtering charge points with plug types that my car is compatible with (as defined in the App). Also use when asked for charge points that "suit" the user\'s car, meaning they have compatible plugs.',
  },
};

type Category6IdentifierResult = Record<
  CategoryPropertiesEnum,
  boolean | string[]
> | null;
interface Cat6IdentifiedFilters {
  request: Category6IdentifierResult;
  error: string | null;
}

@Injectable()
export class RequestIdentifierCat6Service {
  async identifyFilters(
    history: ConversationHistory,
    project: ToolkitProject
  ): Promise<Cat6IdentifiedFilters> {
    const userRequest = history.getData().lastUserInput;
    const userEnglishTranslation =
      history.getData().english_translation ?? userRequest;
    const tracer = new Tracer(
      'identCat6',
      project.name,
    );
    tracer.start();

    if (!userRequest) {
      return {
        request: null,
        error: 'No user request found in history.',
      };
    }

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
      isError: chatGptError1st,
      chatGptResponse: chatGptResponse1st,
      errorMessage: errorMessage1st,
    } = await quickCompletion(prompt, history.id, project.name, projectOutputType, history.language);

    if (chatGptError1st) {
      return { error: errorMessage1st, request: null };
    }

    addFinalSystemPrompt(prompt, chatGptResponse1st);

    const {
      isError: chatGptError,
      chatGptResponse,
      errorMessage,
    } = await quickCompletion(prompt, history.id, project.name, projectOutputType, history.language);

    tracer.end();

    console.log(`### reqIdentCat6 response: ${chatGptResponse}`);

    if (chatGptError) {
      return {
        request: null,
        error: errorMessage,
      };
    }

    const filters: Category6IdentifierResult = {
      [CategoryPropertiesEnum.TYPE_OF_LOCATIONS]: null,
      [CategoryPropertiesEnum.TYPE_OF_LOCATIONS_ENABLED]: null,
      [CategoryPropertiesEnum.PLUG_TYPES_ENABLED]: null,
    };
    const parsedRequest = parseChatGPTJSON(chatGptResponse);
    const result: Cat6IdentifiedFilters = { request: filters, error: null };

    if (parsedRequest !== null) {
      const isValid = !detectOutOfScope(parsedRequest);

      if (isValid) {
        if (
          parsedRequest[CategoryPropertiesEnum.PLUG_TYPES_ENABLED] !== undefined
        ) {
          result.request[CategoryPropertiesEnum.PLUG_TYPES_ENABLED] =
            parsedRequest[CategoryPropertiesEnum.PLUG_TYPES_ENABLED];
        }

        if (
          parsedRequest[CategoryPropertiesEnum.TYPE_OF_LOCATIONS] !== undefined
        ) {
          result.request[CategoryPropertiesEnum.TYPE_OF_LOCATIONS] =
            parsedRequest[CategoryPropertiesEnum.TYPE_OF_LOCATIONS];
        }

        if (
          parsedRequest[CategoryPropertiesEnum.TYPE_OF_LOCATIONS_ENABLED] !==
          undefined
        ) {
          result.request[CategoryPropertiesEnum.TYPE_OF_LOCATIONS_ENABLED] =
            parsedRequest[CategoryPropertiesEnum.TYPE_OF_LOCATIONS_ENABLED];
        }
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
    ${promptCat6Rules}
    ${generatePromptFooter('', [], peerId)}
    `)
  );

  const ragFewShots = IsRagEnabled ? await retrieveCat6Embeddings(userRequest, overtConversationSummary) : [];

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
    cat6FewShotExamples.forEach((example) => {
      prompt.push(DialogFactory.fromUser(example.user));
      prompt.push(DialogFactory.fromAssistant(example.assistant));
    });
  }

  prompt.push(
    DialogFactory.fromUser(`Conversation history: {${overtConversationSummary}}

    User request: ${userRequest}
    Your response: `)
  );

  prompt.push(
    DialogFactory.fromSystem(
      'Supervisor request: "Explain your reasoning to me, step by step (tweet length)"'
    )
  );

  return prompt;
};

export const addFinalSystemPrompt = (
  prompt: Dialog[],
  response: string
): void => {
  prompt.push(
    DialogFactory.fromSystem(`
    Your final response, given your reasoning: ${response}
    Your structured response: `)
  )
};