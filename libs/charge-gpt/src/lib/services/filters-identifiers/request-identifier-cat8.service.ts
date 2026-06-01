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
  promptCat8Rules,
} from './request-identifier.utils';
import { Tracer } from '../tracer';
import { cat8FewShotExamples } from '../rag-services/cat8-few-shots.model';
import { chargeGPTLogger } from '../../models/chat-utilities';
import { SUPPORTED_PEER_ID } from './operator-names.constant';
import { ToolkitProject } from '@fronyx/toolkit';

export enum CategoryPropertiesEnum {
  CONNECTOR_TYPE = 'connector_type',
}

export const necessaryInformation = (): Record<
  CategoryPropertiesEnum,
  unknown
> => {
  return {
    [CategoryPropertiesEnum.CONNECTOR_TYPE]: {
      type: String,
      default: 'all',
      possibleValues: [
        'all',
        'CCS',
        'Type 2',
        'Chademo',
        'IEC_62196_T2',
        'IEC_62196_T2_COMBO',
      ],
      description:
        'The charge point connector type / Default to "all" for connector_type unless specified otherwise. Only set if one of the possibleValues was mentioned specifically by the user, then set connector_type to that value. Otherwise do not set this filter.',
    },
  };
};

type Category8IdentifierResult = Record<
  CategoryPropertiesEnum,
  boolean | string
> | null;
interface Cat8IdentifiedFilters {
  request: Category8IdentifierResult;
  error: string | null;
}

@Injectable()
export class RequestIdentifierCat8Service {
  async identifyFilters(
    history: ConversationHistory,
    project: ToolkitProject
  ): Promise<Cat8IdentifiedFilters> {
    const userRequest = history.getData().lastUserInput;
    const userEnglishTranslation =
      history.getData().english_translation ?? userRequest;
    const currentTimestamp =
      history.clientTimestamp - history.timezoneOffset * 60000;
    const filtersInScope = necessaryInformation();
    const handledFilters: string[] = Object.keys(filtersInScope);
    const availableFilters = handledFilters.filter(
      (filter) => history.getData()[filter]
    );
    const filterStatus = availableFilters.map((filter) => {
      return `"${filter}": ${JSON.stringify(history.getData()[filter])}`;
    });
    const tracer = new Tracer(
      'identCat8',
      project.name,
    );
    tracer.start();

    if (!userRequest) {
      return {
        request: null,
        error: 'No user request found in history.',
      };
    }

    const projectOutputType =
      project.chargegpt_output_type as ChatGptServiceProjectOutputType;

    const prompt = await getPrompt(
      currentTimestamp,
      filtersInScope,
      projectOutputType,
      userEnglishTranslation,
      filterStatus.join(', '),
      history.getOvertConversationSummary(),
      project.data_source,
    );

    const {
      isError: chatGptError,
      chatGptResponse,
      errorMessage,
    } = await quickCompletion(prompt, history.id, project.name, projectOutputType, history.language);

    tracer.end();

    chargeGPTLogger(
      history.id,
      history.projectName,
      'reqIdentCat8Response',
      chatGptResponse
    );

    if (chatGptError) {
      return {
        request: null,
        error: errorMessage,
      };
    }

    return parseCat8QuickTaskOutput(
      chatGptResponse,
      history.getConnectorType()
    );
  }
}

export const getValidConnectorTypeIfNotDefault = (
  valueFromHistoryData: string,
  identifiedConnectorType: string
): string | undefined => {
  const DefaultConnectorTypeValue = 'all';
  const defaultConnectorTypeValue = !valueFromHistoryData
    ? 'all'
    : valueFromHistoryData;
  const connectorType =
    defaultConnectorTypeValue === identifiedConnectorType &&
    defaultConnectorTypeValue === DefaultConnectorTypeValue
      ? undefined
      : identifiedConnectorType;

  if (connectorType === 'null') {
    return undefined;
  }

  return connectorType;
};

export const getPrompt = async (
  currentTimestamp: number,
  filtersInScope: Record<CategoryPropertiesEnum, any>,
  projectOutputType: ChatGptServiceProjectOutputType,
  userRequest: string,
  filtersString: string,
  overtConversationSummary: string,
  peerId: SUPPORTED_PEER_ID,
): Promise<Dialog[]> => {
  const prompt: Dialog[] = [];

  prompt.push(
    DialogFactory.fromSystem(`
    ${generatePromptHeader(filtersInScope)}
    ${promptYourFilters}
    ${JSON.stringify(filtersInScope)}
    ${promptGeneralRules}
    ${promptCat8Rules}
    ${generatePromptFooter('', [], peerId)}
    `)
  );

  cat8FewShotExamples.forEach((example) => {
    prompt.push(DialogFactory.fromUser(example.user));
    prompt.push(DialogFactory.fromAssistant(example.assistant));
  });

  prompt.push(
    DialogFactory.fromUser(`Conversation history: {${overtConversationSummary}}}

    Currently, the following filters are set: {${filtersString}}.

    # remember that AC and DC are no connector types and should not be processed as such.
    User request: ${userRequest}
    Your response: `)
  );

  return prompt;
};

export const parseCat8QuickTaskOutput = (
  chatGptResponse: string,
  currentHistoryConnectorType: string
): Cat8IdentifiedFilters => {
  const filters: Category8IdentifierResult = {
    [CategoryPropertiesEnum.CONNECTOR_TYPE]: null,
  };

  const parsedRequest = parseChatGPTJSON(chatGptResponse);

  const result: Cat8IdentifiedFilters = { request: filters, error: null };

  if (parsedRequest !== null) {
    const isValid = !detectOutOfScope(parsedRequest);

    if (isValid) {
      const parsedConnectorType = getValidConnectorTypeIfNotDefault(
        currentHistoryConnectorType,
        parsedRequest[CategoryPropertiesEnum.CONNECTOR_TYPE]
      );
      if (parsedConnectorType !== undefined) {
        result.request[CategoryPropertiesEnum.CONNECTOR_TYPE] =
          parsedConnectorType;
      }
    } else {
      result.request = null;
    }
  }

  return result;
};
