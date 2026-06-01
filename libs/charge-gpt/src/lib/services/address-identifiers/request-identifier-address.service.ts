import { Injectable } from '@nestjs/common';
import { ConversationHistory } from '../../models/conversation-history.model';
import {
  ProjectOutputType as ChatGptServiceProjectOutputType,
  NecessaryInformationPayload,
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
  generatePromptAddressRequestRules,
  filterValidSettingsFromResponse,
  getFiltersString,
  promptNearbyRequestRules,
  identifyOperatorNameInRequest,
} from '../filters-identifiers/request-identifier.utils';
import { Tracer } from '../tracer';
import { retrieveAddressesEmbeddings } from '../rag-services/create-addresses-embedding.service';
import * as Sentry from '@sentry/minimal';
import { addressFewShotExamples } from '../rag-services/address-few-shots.model';
import { getValidFewshotsForProjectOutputType } from '../rag-services/few-shots-extractor.service';
import { chargeGPTLogger } from '../../models/chat-utilities';
import {
  SUPPORTED_PEER_ID,
  getOperatorNames,
} from '../filters-identifiers/operator-names.constant';
import { identifyAddressCharacteristics } from './address-characterisitics.service';
import { useTryAsync } from 'no-try';
import * as fastJson from 'fast-json-stringify';
import { ToolkitProject } from '@fronyx/toolkit';

export enum CategoryPropertiesEnum {
  ORIGIN = 'origin',
  DESTINATION = 'destination',
  IS_NEARBY_REQUESTED = 'is_nearby_requested',
  IS_LOCATION_CONFIRMED = 'is_location_confirmed',
  IS_LOCATION_BLOCKED = 'is_location_blocked',
}

const IsRagEnabled = true;

const stringifier = fastJson({
  title: 'AddressResponse',
  type: 'object',
  properties: {
    origin: { type: 'string' },
    destination: { type: 'string' },
    is_nearby_requested: { type: 'boolean' },
    is_location_confirmed: { type: 'boolean' },
    is_location_blocked: { type: 'boolean' },
  },
});

const addressResponseStringify = (data) => {
  if (!data) {
    return null;
  }

  return stringifier(data);
};

export const necessaryInformation: Record<
  CategoryPropertiesEnum,
  NecessaryInformationPayload
> = {
  [CategoryPropertiesEnum.ORIGIN]: {
    type: String,
    default: null,
    possibleValues: [''],
    description:
      'In case of routing, trip or travel request, insert place of origin here. One location only. Name of POI or location has to be mentioned in here. Exception: along-the-way or trip routing requests. "highway" keyword needed to trigger a highway/freeway/autobahn/motorway/interstate/etc... search. ", center" keyword needed to trigger a city center/midtown/central/etc... search. Use the "{city}" keyword if a new location or more specific information is required. Use the {is_nearby} keyword if planning a trip with a nearby location as the origin is required. Requirements for stops along the way are ignored here!',
  },
  [CategoryPropertiesEnum.DESTINATION]: {
    type: String,
    default: null,
    possibleValues: [''],
    description:
      'Mentioned destination location or what looks like it. One location only. Name of POI or location ALWAYS has to be mentioned in here! "highway" keyword needed to trigger a highway/freeway/autobahn/motorway/interstate/etc... search. "center" keyword needed to trigger a city center/midtown/central/etc... search. Use the "{city}" keyword if a new location or more specific information is required. Requirements for stops along the way are ignored here!',
  },
  [CategoryPropertiesEnum.IS_NEARBY_REQUESTED]: {
    type: Boolean,
    default: false,
    possibleValues: ['true', 'false'],
    description:
      'Also called the "nearby feature". It indicates if the user requested a charging station nearby or close by or around their current location. Only set to true if the user unequivocally stated that their current location is requested. "near place x" does not qualify! See examples on how to use this property.',
  },
  [CategoryPropertiesEnum.IS_LOCATION_CONFIRMED]: {
    type: Boolean,
    default: false,
    possibleValues: ['true', 'false'],
    description:
      'Indicates if the user has confirmed the location. This should be set to true if the user confirms a location that was proposed in conversation history. User can confirm (say yes) or disconfirm (say no). See examples on how to use this property.',
  },
  [CategoryPropertiesEnum.IS_LOCATION_BLOCKED]: {
    type: Boolean,
    default: false,
    possibleValues: ['true', 'false'],
    description:
      'Indicates if the user has blocked a presented location. A location can only be blocked if it was presented before, as described in the conversation history. User can block a location by uttering something akin to "not that one" or "the other one" or "wrong location" or "is there a better one?". See examples on how to use this property.',
  },
};

export type IdentifiedAddressFiltersRequest = Record<
  CategoryPropertiesEnum,
  boolean | string
> | null;

export interface IdentifiedAddressFilters {
  request: IdentifiedAddressFiltersRequest;
  error: string | null;
}

@Injectable()
export class RequestIdentifierAddressService {
  async identifyFilters(
    history: ConversationHistory,
    project: ToolkitProject
  ): Promise<IdentifiedAddressFilters> {
    const userRequest = history.getData().lastUserInput;
    if (!userRequest) {
      return {
        error: 'No user request found in history.',
        request: null,
      };
    }

    const overtConversationSummary = history.getOvertConversationSummary();
    const userEnglishTranslation =
      history.getData().english_translation ?? userRequest;
    const tracer = new Tracer('identAddress', project.name);
    tracer.start();

    if (!userEnglishTranslation) {
      return {
        error: 'No user request found in history.',
        request: null,
      };
    }

    const projectOutputType =
      project.chargegpt_output_type as ChatGptServiceProjectOutputType;
    const filtersString = getFiltersString(
      history.getData(),
      Object.keys(necessaryInformation)
    );
    const prompt = await getPrompt(
      history.language,
      projectOutputType,
      overtConversationSummary,
      userEnglishTranslation,
      filtersString,
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
        error: errorMessage,
        request: null,
      };
    }

    const parsedOutput = await parseAddressIdentifierQuickTaskOutput(
      chatGptResponse,
      history.id,
      project.name,
      projectOutputType,
      history.language.toLowerCase(),
      project.data_source
    );

    chargeGPTLogger(
      history.id,
      history.projectName,
      'reqIdentAddressResponse',
      addressResponseStringify(parsedOutput.request)
    );

    return parsedOutput;
  }
}

export const parseAddressIdentifierQuickTaskOutput = async (
  response: string,
  conversationId: string,
  projectName: string,
  projectOutputType: string,
  language: string,
  peerId: SUPPORTED_PEER_ID
): Promise<IdentifiedAddressFilters> => {
  const parsedRequest = manipulateCat1Output(parseChatGPTJSON(response));
  const result = { request: undefined, error: null };

  if (parsedRequest !== null) {
    const isValid = !detectOutOfScope(parsedRequest);

    if (isValid) {
      const destinationAddress = parsedRequest.destination
        ? parsedRequest.destination
        : null;
      const originAddress = parsedRequest.origin ? parsedRequest.origin : null;

      const filters = {
        [CategoryPropertiesEnum.ORIGIN]: removeOperatorNameFromAddress(
          originAddress,
          peerId
        ),
        [CategoryPropertiesEnum.DESTINATION]: removeOperatorNameFromAddress(
          destinationAddress,
          peerId
        ),
        [CategoryPropertiesEnum.IS_NEARBY_REQUESTED]: getBooleanValue(
          parsedRequest.is_nearby_requested
        ),
        [CategoryPropertiesEnum.IS_LOCATION_CONFIRMED]: getBooleanValue(
          parsedRequest.is_location_confirmed
        ),
        [CategoryPropertiesEnum.IS_LOCATION_BLOCKED]: getBooleanValue(
          parsedRequest.is_location_blocked
        ),
      };

      if (
        !!filters[CategoryPropertiesEnum.ORIGIN] &&
        filters[CategoryPropertiesEnum.ORIGIN].includes('{city}')
      ) {
        if (
          await isLandmark(
            filters[CategoryPropertiesEnum.ORIGIN],
            conversationId,
            projectName,
            projectOutputType,
            language
          )
        ) {
          filters[CategoryPropertiesEnum.ORIGIN] = filters[
            CategoryPropertiesEnum.ORIGIN
          ]
            .replace(', {city}', '')
            .replace('{city}', '');
        }
      }

      if (
        !!filters[CategoryPropertiesEnum.DESTINATION] &&
        filters[CategoryPropertiesEnum.DESTINATION].includes('{city}')
      ) {
        if (
          await isLandmark(
            filters[CategoryPropertiesEnum.DESTINATION],
            conversationId,
            projectName,
            projectOutputType,
            language
          )
        ) {
          filters[CategoryPropertiesEnum.DESTINATION] = filters[
            CategoryPropertiesEnum.DESTINATION
          ]
            .replace(', {city}', '')
            .replace('{city}', '');
        }
      }

      result.request = filterValidSettingsFromResponse(
        filters,
        Object.keys(necessaryInformation)
      );

      if (Object.values(result.request).filter(Boolean).length === 0) {
        result.request = null;
      }
    } else {
      result.request = null;
    }
  }

  return result;
};

const manipulateCat1Output = (cat7Output: any): any => {
  if (!cat7Output) {
    return null;
  }

  const isValid = !detectOutOfScope(cat7Output);

  if (!isValid) {
    return cat7Output;
  }

  if (cat7Output.destination === '{is_nearby}') {
    return {
      ...cat7Output,
      destination: undefined,
      is_nearby_requested: true,
    };
  }

  return cat7Output;
};

const isLandmark = async (
  address: string,
  conversationId: string,
  projectName: string,
  projectOutputType: string,
  language: string
): Promise<boolean> => {
  const [err, characteristics] = await useTryAsync(
    () =>
      identifyAddressCharacteristics(
        address,
        conversationId,
        projectName,
        projectOutputType,
        language
      ),
  );

  if (err) {
    return false;
  }

  if (characteristics && characteristics.error) {
    return false;
  }

  return !!characteristics.poiName && !!characteristics.city;
};

export const removeOperatorNameFromAddress = (
  address: string,
  peerId: SUPPORTED_PEER_ID
): string | null => {
  if (!address) {
    return null;
  }

  const operatorName = identifyOperatorNameInRequest(address, peerId);

  const thinAddress = address
    .replace(`${operatorName}, `, '')
    .replace(`, ${operatorName}`, '')
    .replace(operatorName, '')
    .trim();

  if (thinAddress.length === 0) {
    return null;
  }

  return thinAddress;
};

const getBooleanValue = (value: string | undefined | null): boolean | null => {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return null;
  }

  if (value === null || value === undefined) {
    return null;
  }

  return value ? true : null;
};

export const getPrompt = async (
  language: string,
  projectOutputType: ChatGptServiceProjectOutputType,
  overtConversationSummary: string,
  englishTranslation: string,
  filtersString: string,
  peerId: SUPPORTED_PEER_ID
): Promise<Dialog[]> => {
  const prompt: Dialog[] = [];

  const reqIdentPrompt = `
  ${generatePromptHeader(necessaryInformation)}
  ${promptYourFilters}
  ${JSON.stringify(necessaryInformation)}
  ${promptGeneralRules}
  ${generatePromptAddressRequestRules(language)}
  ${promptNearbyRequestRules}
  ${generatePromptFooter(englishTranslation, getOperatorNames(peerId), peerId)}
  `;
  prompt.push(DialogFactory.fromSystem(reqIdentPrompt));

  const ragFewShots = IsRagEnabled
    ? await retrieveAddressesEmbeddings(
        englishTranslation,
        overtConversationSummary
      )
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
    getValidFewshotsForProjectOutputType(
      projectOutputType,
      addressFewShotExamples
    ).forEach((example) => {
      prompt.push(DialogFactory.fromUser(example.user));
      prompt.push(DialogFactory.fromAssistant(example.assistant));
    });
  }

  // prompt.push(DialogFactory.fromUser('As a thorough assistant you follow the above examples and responses. ALWAYS replicate the complete example response structure, i.e., ALL of the seen responses and follow the example responses. You can identify cities, towns, points of interest and addresses easily as well as nearby requests, confirmations and option selections.'));

  prompt.push(
    DialogFactory.fromUser(`Conversation history: {${overtConversationSummary}}

  # Take note of the above examples and learn from them how to answer user requests. It is crucial for the conversation quality that you respond to the user request especially thoroughly and accurately. Always take the conversation history into account. Do not forget to put also the POI category from the below user request in front of the destination information.
  # Always identify a destination if it simply looks like one. 
  # For system integrity, always repeat the values for "origin" and "destination" if the conversation history shows them to have already been identified!
  # Users can switch between requests for routing or trip planning (identify origin and destrination) and destination charging (identify origin as "" and the destination).
  # only add {city} if the request is not specific enough (e.g. "I want to stop at a Subway on my way to Bochum." and "I want to charge near my current location" are specific enough).

  User request: ${englishTranslation}
  Your response: `)
  );

  return prompt;
};
//  Only add {city} for POI categories if the user request is not specific enough. Only add {city} for specific POI if the user request is not specific enough.
