import { Injectable } from '@nestjs/common';
import { ConversationHistory } from '../../models/conversation-history.model';
import {
  ProjectOutputType,
  TargetApi,
  quickCompletion,
} from '../chat-gpt.service';
import { DialogFactory, Dialog } from '../../models/prompt';
import { TranslationsService } from '../../../../../translations/src/translations.service';
import { parseChatGPTJSON } from '../parse-chatgpt-json.utils';
import {
  detectOutOfScope,
  filterValidSettingsFromResponse,
} from './request-identifier.utils';
import { getJSONLog } from '../../models/chat-utilities';
import { IdentifiedAddressFilters } from '../address-identifiers/request-identifier-address.service';
import { IdentifiedFilters } from './filters-categories-identifiers.service';
import { Tracer } from '../tracer';
import * as Sentry from '@sentry/minimal';
import { retrievePostfixEmbeddings } from '../rag-services/create-postfix-embedding.service';
import { postfixFewShotExamples } from '../rag-services/postfix-few-shots.model';
import { ToolkitProject } from '@fronyx/toolkit';

const IsRagEnabled = false;

const filterInformation = [
  '"unconfirmed_addresses": Filter for charge points at or close to what looks like locations, location names, businesses, addresses, highways, restaurants and so on, including city districts and cardinal directions. Confirmation is done externally. You do not concern yourself with confirmation of a location. Locations can be unspecific or specific by name.',
  '"is_location_confirmed": unconfirmed_addresses in some cases needs confirmation, but in most cases it is not needed. You do not concern yourself with this variable.',
  '"is_location_blocked": Block a location that was previously presented to the user.',
  '"is_nearby_requested": Search for charge points at a location close to the user\'s current location.',
  '"power_enabled", "min_power", "max_power": Filter for the speed of the charge points and duration (minutes, hours, etc.) of a charging stop, either by setting specific values or minimum or maximum charging speeds, or by adjectives like fast, slow, ultra-fast, and so on. All durations for charging are represented (e.g. "charge overnight" or "I want to charge for 2 hours") by setting appropriate charging speeds.',
  '"only_free": Filter for charge points that don\'t cost anything (free of cost).',
  '"hide_coming_soon": Filter out charge points that are only coming soon and are not built, yet.',
  '"hide_not_available": Filter out charge points that are currently not available because someone else is currently using them. ',
  '"only_4_or_5_stars": Filter for charge points that have a high user rating because they never break or are unproblematic.',
  '"only_public": Filter for public chargers that are not on private property.',
  '"only_tariff_kwh": Filter for charge points (sometimes near a location) that you have to pay by the amount of kwh. Pay by kwh tariff.',
  '"only_tariff_min": Filter for charge points (sometimes near a location) that you have to pay by the amount of time you stay. Pay by the minute tariff.',
  '"only_remote_start_capable": Filter for charge points that can be remotely triggerd to start using an App.',
  '"only_auto_charge": Filter for charge points that support automatic (start of) charging - or auto start - by just plugging in the car.',
  '"type_of_locations", "type_of_locations_enabled": Filter for charge points that are very close to a certain type of location. Possible values are: Restaurant, Hotel, Supermarket, Shopping center, Service station, Motorway service station, Paid parking, Free car park, Dealer, Taxi, Company, Store, Workshop, Camping, Airport.',
  '"plug_types_enabled": Filter for charge points that have plug types that are "compatible" with your configured car (as set in the App). Requests for any specific car are not possible.',
  '"plug_types_enabled": Requests for specific plug types (like CCS, Type-2 etc.) cannot be handled by the system!',
  'Special consideration: charge durations are always matched to power_enabled, min_power, max_power. You never interpret the values.',
];

@Injectable()
export class RequestIdentifierPostfixService {
  async process(
    history: ConversationHistory,
    identifiedFiltersByCategories: IdentifiedFilters,
    identifiedAddressFilters: IdentifiedAddressFilters,
    project: ToolkitProject
  ): Promise<{
    request?: string;
    error?: string;
  }> {
    const tracer = new Tracer(
      'identPostfix',
      project.name,
    );
    tracer.start();

    const userRequest = history.getData().lastUserInput;
    const userEnglishTranslation =
      history.getData().english_translation ?? userRequest;
    const identifiedRequests = [];

    Object.keys(identifiedFiltersByCategories)
      .filter((key) => identifiedFiltersByCategories[key])
      .forEach((key) =>
        identifiedRequests.push(`${key}: ${identifiedFiltersByCategories[key]}`)
      );

    if (identifiedAddressFilters.request) {
      Object.keys(identifiedAddressFilters.request)
        .filter((key) => identifiedAddressFilters.request[key])
        .forEach((key) =>
          identifiedRequests.push(
            `${key}: ${identifiedAddressFilters.request[key]}`
          )
        );
    }

    const identifiedRequestsString = identifiedRequests.join(', ');

    if (!userEnglishTranslation) {
      const error = { error: 'No user request found in history.' };
      console.log(
        getJSONLog(
          history.id,
          project.name,
          'Error in RequestIdentifierPostfixService: ',
          error
        )
      );
      return error;
    }

    const projectOutputType =
      project.chargegpt_output_type as ProjectOutputType;
    const targetApi = project.chargegpt_model as TargetApi;
    const prompt = await getPrompt(
      projectOutputType,
      userEnglishTranslation,
      history.language
    );

    const {
      isError: chatGptError1,
      chatGptResponse: chatGptResponse1,
      errorMessage: errorMessage1,
    } = await quickCompletion(prompt, history.id, project.name, projectOutputType, history.language);

    if (chatGptError1) {
      return { error: errorMessage1 };
    }

    console.log(`### reqIdentPostfixService first step:
    Your response: ${chatGptResponse1}`);

    addFinalSystemPrompt(prompt, chatGptResponse1, identifiedRequestsString, history.language);

    const {
      isError: chatGptError,
      chatGptResponse,
      errorMessage,
    } = await quickCompletion(prompt, history.id, project.name, projectOutputType, history.language);

    tracer.end();

    console.log(`### reqIdentPostfixService second step:
    Your response: ${chatGptResponse}`);

    if (chatGptError) {
      return { error: errorMessage };
    }

    const parsedRequest = parseChatGPTJSON(chatGptResponse);
    const result = { request: undefined };

    if (parsedRequest !== null) {
      const isValid = !detectOutOfScope(parsedRequest);

      if (isValid) {
        const postfix = filterValidSettingsFromResponse(parsedRequest, [
          'postfix',
        ])['postfix'];
        result.request = postfix === 'null' ? null : postfix;
      } else {
        result.request = null;
      }
    }

    return result;
  }
}

export const getPrompt = async (
  projectOutputType: ProjectOutputType,
  userRequest: string,
  language: string
): Promise<Dialog[]> => {
  const prompt: Dialog[] = [];
  const languageTranslation = new TranslationsService(language);

  prompt.push(
    DialogFactory.fromSystem(`You are a helpful assistant with the sole purpose to identify which parts of a user's request the system was not able to match to a number of filters of an app that helps to find charge points for electric vehicles. Never assume any additional requests. Filters that could be matched will be shown to you. In the end you inform the user about which parts of the request could not be matched to the filters. You inform the user by means of a very short sentence, containing only a brief and consice summary of the possibly multiple parts of the request that the system filters cannot handle right now. Imagine how the user request was matched to the filters and hence you can return "null" if that is possible. You also make use of the the below examples of user requests.

      What you CAN match requests to (filter name and description): ${filterInformation.join(
        ', '
      )}

      Additional rules you adhere to:
      - Look at "Successfully matched request parts" to see which filter names were successfully matched.
      - You do not concern yourself with the confirmation of an address. Accept anything in "unconfirmed_addresses" as given, even if only parts of address was matched
      - You will be presented with a summary of the ongoing conversation so you can understand the user request in context.
      - You are very succinct with your explanation.
      - If a part of the request was matched to a filter only indirectly, you can still return "null".

      Return "null" by default. If parts of the request were NOT matched to filters you answer by providing a structured JSON output with your response in the "postfix" key (see examples below). 

      You always respond in the language of the user's request. If the user's request is in a language other than English, you translate the response into the user's language.
      ANSWER IN LANGUAGE: ${languageTranslation.getLanguageName()}

      Now follows a number of example requests and the filters they were successfully be matched to. Especially take note of the 'postfix' response. 
      `)
  );

  const ragFewShots = IsRagEnabled ? await retrievePostfixEmbeddings(userRequest) : [];

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
    postfixFewShotExamples.forEach((example) => {
      prompt.push(DialogFactory.fromUser(example.user));
      prompt.push(DialogFactory.fromAssistant(example.assistant));
    });
  }

  prompt.push(
    DialogFactory.fromSystem(
      `Here is the user request: "${userRequest}". Thoroughly think about and point out the distinct parts of the user request (up to tweet length). In the next step you will be asked to point out which parts of the user request could not be matched to the filters.`
    )
  );

  return prompt;
};

export const addFinalSystemPrompt = (
  prompt: Dialog[],
  response: string,
  identifiedRequestsString: string,
  language: string
): void => {
  prompt.push(DialogFactory.fromAssistant(response));

  prompt.push(
    DialogFactory.fromUser(`Successfully matched filters are: {${identifiedRequestsString}}

      # Follow the examples and return "null" where possible.

      Answer in language: ${new TranslationsService(language).getLanguageName()}
      Your response: `)
  );
};
