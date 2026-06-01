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
  promptCat7Rules,
  identifyOperatorNameInRequest,
} from './request-identifier.utils';
import { format } from 'date-fns';
import { Tracer } from '../tracer';
import { cat7FewShotExamples } from '../rag-services/cat7-few-shots.model';
import { retrieveCat7Embeddings } from '../rag-services/create-cat7-embedding.service';
import * as Sentry from '@sentry/minimal';
import {
  getFewShotExamples,
  renderFewShotTemplate,
} from '../rag-services/get-few-shots.service';
import { getOperatorNames, SUPPORTED_PEER_ID } from './operator-names.constant';
import { chargeGPTLogger } from '../../models/chat-utilities';
import { ToolkitProject } from '@fronyx/toolkit';

export enum CategoryPropertiesEnum {
  DATE_TIME = 'date_time',
  POWER_TYPE = 'power_type',
  OPERATOR_NAME = 'operator_name',
}

const acKeywords = [
  'ac',
  'ac.',
  'alternating',
  'alternating-current',
  'alternatingcurrent',
];

const dcKeywords = ['dc', 'dc.', 'direct', 'direct-current', 'directcurrent'];

const IsRagEnabled = false;

export const necessaryInformation = (
  currentTimestamp: number,
  peerId: SUPPORTED_PEER_ID
): Record<CategoryPropertiesEnum, unknown> => {
  const dateObject = new Date(currentTimestamp);
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayOfWeek = daysOfWeek[dateObject.getDay()];

  return {
    [CategoryPropertiesEnum.DATE_TIME]: {
      type: String,
      default: format(dateObject, 'yyyy-MM-dd HH:mm:ss'),
      possibleValues: [],
      description: `The requested date and time in the FUTURE, in 2023-05-15 14:00:00 format. ALWAYS use the current date_time if nothing else is mentioned, but past times are not valid. The preset date and time are ${format(
        dateObject,
        'yyyy-MM-dd HH:mm:ss'
      )}, with the corresponding day of the week being ${dayOfWeek}. Use these as defaults unless directed otherwise. For 'times of day' phrases, update {date_time} as needed. Translate 'times of day' into specific {date_time} ('morning'->'8:00:00', 'afternoon'->'14:00:00', 'evening'->'18:00:00, 'tonight'->'20:00:00'). NEVER ACCEPT TIMES 10 MINUTES IN THE PAST! 🚫 For charging hours in the future, calculate and set the appropriate date_time. ⏰
      For specific time requests, convert phrases like "at 3 o'clock" to the correct {date_time} format. ALWAYS INCLUDE THE CURRENT YEAR & DATE & TIME AS DEFAULT 🕒 `,
    },
    [CategoryPropertiesEnum.POWER_TYPE]: {
      type: String,
      default: null,
      possibleValues: ['AC', 'DC', 'all'],
      description:
        'The power type filter for the kind of electricity available at a charging station, which can be AC or DC. Set this filter only if the user mentioned "AC" or "DC" specifically by name. 🚫 Setting power_type to "all" or null will result in both AC and DC being searched by default. This is the intended functionality. 🚫',
    },
    [CategoryPropertiesEnum.OPERATOR_NAME]: {
      type: String,
      default: ['all'],
      possibleValues: getOperatorNames(peerId),
      description:
        'If the user mentions a specific operator from possible values, set operator_name to that operator, otherwise set as "null". 🚫 Setting operator_name to "all" or null will result in charge points from all operators to be searched. This is the intended functionality. 🚫',
    },
  };
};

type Category7IdentifierResult = Record<
  CategoryPropertiesEnum,
  boolean | string
> | null;
interface Cat7IdentifiedFilters {
  request: Category7IdentifierResult;
  error: string | null;
}

@Injectable()
export class RequestIdentifierCat7Service {
  async identifyFilters(
    history: ConversationHistory,
    project: ToolkitProject
  ): Promise<Cat7IdentifiedFilters> {
    const userRequest = history.getData().lastUserInput;
    const userEnglishTranslation =
      history.getData().english_translation ?? userRequest;
    const currentTimestamp =
      history.clientTimestamp - history.timezoneOffset * 60000;
    const filtersInScope = necessaryInformation(
      currentTimestamp,
      project.data_source
    );
    const handledFilters: string[] = Object.keys(filtersInScope);
    const availableFilters = handledFilters.filter(
      (filter) => history.getData()[filter]
    );
    const filterStatus = availableFilters.map((filter) => {
      return `"${filter}": ${JSON.stringify(history.getData()[filter])}`;
    });
    const tracer = new Tracer(
      'identCat7',
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
    const parsedRequest = parseCat7QuickTaskOutput(
      chatGptResponse,
      userRequest,
      project.data_source,
    );

    chargeGPTLogger(
      history.id,
      history.projectName,
      'reqIdentCat7Response',
      `date_time: ${parsedRequest.request?.date_time}, power_type: ${parsedRequest.request?.power_type}, operator_name: ${parsedRequest.request?.operator_name}`
    );

    return parsedRequest;
  }
}

const isAcDetected = (request: string): boolean => {
  const words: string[] = request.split(' ').filter(Boolean);
  return acKeywords.some((keyword) =>
    words.some((word) => word.toLowerCase() === keyword)
  );
};

const isDcDetected = (request: string): boolean => {
  const words: string[] = request.split(' ').filter(Boolean);
  return dcKeywords.some((keyword) =>
    words.some((word) => word.toLowerCase() === keyword)
  );
};

export const detectKeywordPowerType = (request: string): string | null => {
  let possiblePowerType = null;

  if (isAcDetected(request)) {
    possiblePowerType = 'AC';
  } else if (isDcDetected(request)) {
    possiblePowerType = 'DC';
  }

  return possiblePowerType;
};

export const getValidPowerType = (
  identifiedPowerType: string
): string | undefined => {
  if (identifiedPowerType === 'null' || !identifiedPowerType) {
    return undefined;
  }

  if (identifiedPowerType === 'all') {
    return 'all';
  }

  if (identifiedPowerType === null) {
    return null;
  }

  const isAvailableInList = ['AC', 'DC'].some((val) =>
    val.toLowerCase().includes(identifiedPowerType.toLowerCase())
  );
  return isAvailableInList ? identifiedPowerType.toUpperCase() : undefined;
};

export const getValidOperatorName = (
  identifiedOperatorName: string,
  peerId: SUPPORTED_PEER_ID
): string | undefined => {
  if (identifiedOperatorName === 'null' || !identifiedOperatorName) {
    return undefined;
  }

  if (identifiedOperatorName === 'all') {
    return 'all';
  }

  const validatedOperatorName = identifyOperatorNameInRequest(
    identifiedOperatorName,
    peerId
  );

  const isStringContainValidOperatorName =
    validatedOperatorName !== undefined && validatedOperatorName !== null;

  return isStringContainValidOperatorName ? identifiedOperatorName : undefined;
};

export const getPrompt = async (
  currentTimestamp: number,
  filtersInScope: Record<CategoryPropertiesEnum, any>,
  projectOutputType: ChatGptServiceProjectOutputType,
  userRequest: string,
  filtersString: string,
  overtConversationSummary: string,
  peerId: SUPPORTED_PEER_ID
): Promise<Dialog[]> => {
  const prompt: Dialog[] = [];

  prompt.push(
    DialogFactory.fromSystem(`
    ${generatePromptHeader(filtersInScope)}
    ${promptYourFilters}
    ${JSON.stringify(filtersInScope)}
    ${promptGeneralRules}
    ${promptCat7Rules}
    ${generatePromptFooter(userRequest, getOperatorNames(peerId), peerId)}
    `)
  );

  const ragFewShots = IsRagEnabled
    ? await retrieveCat7Embeddings(userRequest, overtConversationSummary)
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
            const parsedExample = renderFewShotTemplate(
              example,
              getCat7DateDataTemplate(currentTimestamp)
            );

            prompt.push(DialogFactory.fromUser(parsedExample['user']));
            prompt.push(
              DialogFactory.fromAssistant(parsedExample['assistant'])
            );
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
    getFewShotExamples(
      cat7FewShotExamples,
      getCat7DateDataTemplate(currentTimestamp)
    ).forEach((example) => {
      prompt.push(DialogFactory.fromUser(example.user));
      prompt.push(DialogFactory.fromAssistant(example.assistant));
    });
  }

  prompt.push(
    DialogFactory.fromUser(`Conversation history: {${overtConversationSummary}}}

    Currently, the following filters are set: {${filtersString}}.

    # Make sure to follow the above examples and rules for the best results. 🚀
    User request: ${userRequest}
    Your response: `)
  );

  return prompt;
};

export const getCat7DateDataTemplate = (
  currentTimestamp: number
): {
  dateToday: string;
  dayOfWeek: string;
  dateTimeNoonNextMonday: string;
  dateTimeToday: string;
  dateNextMonday: string;
  dateTimeInOneHour: string;
  dateTimeTomorrowAfternoon: string;
  dateTimeIn30Minutes: string;
  currentDateTime: string;
} => {
  const dateObject = new Date(currentTimestamp);
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayOfWeek = daysOfWeek[dateObject.getDay()];
  const dateNextMonday = new Date();
  dateNextMonday.setDate(
    dateObject.getDate() + ((1 + 7 - dateObject.getDay()) % 7)
  );
  const dateNoonNextMonday = new Date(dateNextMonday);
  dateNoonNextMonday.setHours(12, 0, 0, 0);
  const dateTimeInOneHour = new Date(dateObject);
  dateTimeInOneHour.setHours(dateObject.getHours() + 1);
  const dateTimeTomorrowAfternoon = new Date(dateObject);
  dateTimeTomorrowAfternoon.setDate(dateObject.getDate() + 1);
  dateTimeTomorrowAfternoon.setHours(14, 0, 0, 0);
  const dateTimeIn30Minutes = new Date(dateObject);
  dateTimeIn30Minutes.setMinutes(dateObject.getMinutes() + 30);

  return {
    dateToday: format(dateObject, 'yyyy-MM-dd'),
    dayOfWeek,
    dateTimeNoonNextMonday: format(dateNoonNextMonday, 'yyyy-MM-dd HH:mm:ss'),
    dateTimeToday: format(dateObject, 'yyyy-MM-dd HH:mm:ss'),
    dateNextMonday: format(dateNextMonday, 'yyyy-MM-dd'),
    dateTimeInOneHour: format(dateTimeInOneHour, 'yyyy-MM-dd HH:mm:ss'),
    dateTimeTomorrowAfternoon: format(
      dateTimeTomorrowAfternoon,
      'yyyy-MM-dd HH:mm:ss'
    ),
    dateTimeIn30Minutes: format(dateTimeIn30Minutes, 'yyyy-MM-dd HH:mm:ss'),
    currentDateTime: format(dateObject, 'yyyy-MM-dd HH:mm:ss'),
  };
};

export const parseCat7QuickTaskOutput = (
  chatGptResponse: string,
  userRequest: string,
  peerId: SUPPORTED_PEER_ID
): any => {
  const filters: Category7IdentifierResult = {
    [CategoryPropertiesEnum.DATE_TIME]: undefined,
    [CategoryPropertiesEnum.POWER_TYPE]: undefined,
    [CategoryPropertiesEnum.OPERATOR_NAME]: undefined,
  };
  const parsedRequest = parseChatGPTJSON(chatGptResponse);
  const result: Cat7IdentifiedFilters = { request: filters, error: null };

  if (parsedRequest !== null) {
    const isValid = !detectOutOfScope(parsedRequest);

    if (isValid) {
      if (parsedRequest[CategoryPropertiesEnum.DATE_TIME] !== undefined) {
        result.request[CategoryPropertiesEnum.DATE_TIME] = getDateTimeValue(
          parsedRequest[CategoryPropertiesEnum.DATE_TIME]
        );
      }

      const parsedPowerType = getValidPowerType(
        parsedRequest[CategoryPropertiesEnum.POWER_TYPE]
      );

      if (parsedPowerType !== undefined) {
        result.request[CategoryPropertiesEnum.POWER_TYPE] = parsedPowerType;
      }
      console.log('parsedRequest[CategoryPropertiesEnum.OPERATOR_NAME]', parsedRequest[CategoryPropertiesEnum.OPERATOR_NAME]);
      const parsedOperatorName = getValidOperatorName(
        parsedRequest[CategoryPropertiesEnum.OPERATOR_NAME],
        peerId
      );

      if (parsedOperatorName !== undefined) {
        result.request[CategoryPropertiesEnum.OPERATOR_NAME] =
          parsedOperatorName;
      }
    } else {
      result.request = null;
    }
  }

  // check user request against keywords for power-type detection
  const powerTypeKeyword =
    !!result.request && result.request[CategoryPropertiesEnum.POWER_TYPE] === 'all'
      ? 'all'
      : detectKeywordPowerType(userRequest);

  if (powerTypeKeyword) {
    if (result.request === null) {
      result.request = {
        [CategoryPropertiesEnum.DATE_TIME]: undefined,
        [CategoryPropertiesEnum.POWER_TYPE]: undefined,
        [CategoryPropertiesEnum.OPERATOR_NAME]: undefined,
      };
    }

    result.request[CategoryPropertiesEnum.POWER_TYPE] = powerTypeKeyword;
  } else {
    if (result.request !== null) {
      result.request[CategoryPropertiesEnum.POWER_TYPE] = undefined;
    }
  }

  return result;
};

const getDateTimeValue = (value: any): string | null => {
  if (value === undefined || value === null) {
    return null;
  }

  if (value === 'null' || value === '') {
    return null;
  }

  return value;
};
