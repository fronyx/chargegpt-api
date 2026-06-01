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
  promptCat1Rules,
  generatePromptFooter,
  detectOutOfScope,
  filterValidSettingsFromResponse,
} from './request-identifier.utils';
import { Tracer } from '../tracer';
import * as Sentry from '@sentry/minimal';
import { retrieveCat1Embeddings } from '../rag-services/create-cat1-embedding.service';
import { cat1FewShotExamples } from '../rag-services/cat1-few-shots.model';
import {
  DEFAULT_MAX_POWER,
  DEFAULT_MIN_POWER,
  DEFAULT_MIN_RAPID_POWER,
} from '../../models/power-kw.constants';
import { chargeGPTLogger } from '../../models/chat-utilities';
import { SUPPORTED_PEER_ID } from './operator-names.constant';
import { ToolkitProject } from '@fronyx/toolkit';
import * as fastJson from 'fast-json-stringify';

export enum CategoryPropertiesEnum {
  MIN_POWER = 'min_power',
  MAX_POWER = 'max_power',
}

const stringifier = fastJson({
  title: 'Cat1Response',
  type: 'object',
  properties: {
    min_power: { type: 'number' },
    max_power: { type: 'number' },
  },
});

const cat1ResponseStringify = (data) => {
  if (!data) {
    return null;
  }

  return stringifier(data);
};

const IsRagEnabled = true;

export const necessaryInformation: Record<CategoryPropertiesEnum, any> = {
  // Power Filters
  [CategoryPropertiesEnum.MIN_POWER]: {
    type: Number,
    default: DEFAULT_MIN_POWER,
    possibleValues: [],
    description:
      'The minimum power (in kW) that a charging point must offer to be included in the search results. People are confused and sometimes request kWh instead of kW.',
  },
  [CategoryPropertiesEnum.MAX_POWER]: {
    type: Number,
    default: DEFAULT_MAX_POWER,
    possibleValues: [],
    description:
      'The maximum power limit (in kW) for the charging points. Charging points above this power rating are excluded. People are confused and sometimes request kWh instead of kW.',
  },
};

@Injectable()
export class RequestIdentifierCat1Service {
  async identifyFilters(
    history: ConversationHistory,
    project: ToolkitProject
  ): Promise<{
    request: Record<CategoryPropertiesEnum, number | boolean> | null;
    error: string | undefined;
  }> {
    const userRequest = history.getData().lastUserInput;

    const tracer = new Tracer('identCat1', project.name);
    tracer.start();

    if (!userRequest) {
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

    const prompt = await getPrompt(
      projectOutputType,
      userEnglishTranslation,
      filterStatus.join(', '),
      history.getOvertConversationSummary(),
      project.data_source
    );
    const {
      isError: chatGptError,
      chatGptResponse,
      errorMessage,
    } = await quickCompletion(
      prompt,
      history.id,
      project.name,
      projectOutputType,
      history.language
    );
    tracer.end();

    if (chatGptError) {
      return {
        request: null,
        error: errorMessage,
      };
    }

    const parsedOutput = parseCat1QuickTaskOutput(chatGptResponse);

    chargeGPTLogger(history.id, history.projectName, 'reqIdentCat1Response', cat1ResponseStringify(parsedOutput.request));

    return parsedOutput;
  }
}

export const parseCat1QuickTaskOutput = (response: string) => {
  const parsedJson = parseChatGPTJSON(response);
  const result = { request: undefined, error: undefined };

  if (parsedJson !== null) {
    const isValid = !detectOutOfScope(parsedJson);

    const parsedRequest = filterValidSettingsFromResponse(
      parsedJson,
      Object.keys(necessaryInformation)
    );

    if (isValid) {
      let request: any = {};

      request[CategoryPropertiesEnum.MAX_POWER] = parsedRequest[CategoryPropertiesEnum.MAX_POWER];
      request[CategoryPropertiesEnum.MIN_POWER] = parsedRequest[CategoryPropertiesEnum.MIN_POWER];

      if (Object.values(request).filter(Boolean).length < 1) {
        request = null;
      }

      result.request = getPowerValue(request);
    } else {
      result.request = null;
    }
  }

  return result;
};

function fillInPortugueseSpecificAbbreveations(prompt: Dialog[]): void {
  prompt.push(
    DialogFactory.fromUser(`Conversation history: {}

  # example description: abbreviation "PCN" means 'Posto(s) de carregamento(s) normal' or 'Ponto(s) carregamento(s)' or 'posto normal' in portuguese and in english means 'normal charging station'
  User request: PCN near me
  Your translation:`)
  );
  prompt.push(DialogFactory.fromAssistant('{"min_power": 0, "max_power": 30}'));

  prompt.push(
    DialogFactory.fromUser(`Conversation history: {}

  # example description: abbreviation "NCS" means Normal charging station
  User request: NCS in Porto
  Your translation:`)
  );
  prompt.push(DialogFactory.fromAssistant('{"min_power": 0, "max_power": 30}'));

  prompt.push(
    DialogFactory.fromUser(`Conversation history: {}

  # example description: abbreviation "PCR" means 'Posto de carregamento rápido' or 'posto rápido' in portuguese and in english means 'fast charging station'
  User request: PCR in Alagoas
  Your translation:`)
  );
  prompt.push(
    DialogFactory.fromAssistant('{"min_power": 30, "max_power": 70}')
  );

  prompt.push(
    DialogFactory.fromUser(`Conversation history: {}

  # example description: abbreviation "FCS" means Fast charging station
  User request: FCS in Milan
  Your translation:`)
  );
  prompt.push(
    DialogFactory.fromAssistant('{"min_power": 30, "max_power": 70}')
  );

  prompt.push(
    DialogFactory.fromUser(`Conversation history: {}

  # example description: abbreviation "PCUR" means 'Posto de carregamento ultra rápido' or 'posto ultra rápido' in portuguese and in english means 'ultra-fast charging station'
  User request: PCUR in Lisboa
  Your translation:`)
  );
  prompt.push(
    DialogFactory.fromAssistant('"min_power": 70, "max_power": 500}')
  );

  prompt.push(
    DialogFactory.fromUser(`Conversation history: {}

  # example description: abbreviation "UFCS" means Ultra fast charging station
  User request: UFCS near me
  Your translation:`)
  );
  prompt.push(
    DialogFactory.fromAssistant('{"min_power": 70, "max_power": 500}')
  );
}

export const getPrompt = async (
  projectOutputType: ChatGptServiceProjectOutputType,
  userRequest: string,
  filtersString: string,
  overtConversationSummary: string,
  peerId: SUPPORTED_PEER_ID
): Promise<Dialog[]> => {
  const prompt: Dialog[] = [];

  prompt.push(
    DialogFactory.fromSystem(`
    ${generatePromptHeader(necessaryInformation)}}
    ${promptYourFilters}
    ${JSON.stringify(necessaryInformation)}
    ${promptGeneralRules}
    ${promptCat1Rules}
    ${generatePromptFooter('', [], peerId)}
    `)
  );

  const ragFewShots = IsRagEnabled ? await retrieveCat1Embeddings(userRequest, overtConversationSummary) : [];

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
    cat1FewShotExamples.forEach((example) => {
      prompt.push(DialogFactory.fromUser(example.user));
      prompt.push(DialogFactory.fromAssistant(example.assistant));
    });
  }

  // console.log(prompt.map((dialog) => `${dialog.role}: ${dialog.content}`));

  fillInPortugueseSpecificAbbreveations(prompt);

  prompt.push(
    DialogFactory.fromUser(`Conversation history: {${overtConversationSummary}}

    Currently, the following filters are set: {${filtersString}}.

    User request: ${userRequest}
    Your response: `)
  );

  return prompt;
};

const getPowerValue = ({ min_power, max_power }) => {
  if (!isNaN(min_power) && !isNaN(max_power)) {
    if (min_power === max_power && min_power >= DEFAULT_MIN_RAPID_POWER) {
      return {
        min_power: Number(min_power),
        max_power: DEFAULT_MAX_POWER,
      };
    }

    return {
      min_power: Number(min_power),
      max_power: Number(max_power),
    };
  }

  return {
    min_power: undefined,
    max_power: undefined,
  };
};
