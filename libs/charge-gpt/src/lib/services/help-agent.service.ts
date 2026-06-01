import { ConversationHistory } from '../models/conversation-history.model';
import {
  ProjectOutputType as ChatGptServiceProjectOutputType,
  quickCompletion,
} from './chat-gpt.service';
import { Dialog, DialogFactory } from '../models/prompt';
import { TranslationsService } from '../../../../translations/src/translations.service';
import {
  ChargegptFilterSummary,
  ChargeGPTIntroduction,
  ChargegptSummary,
} from '../../../../../apps/cdk-apps/src/shared/models/general/chargegpt-translation';
import { replaceAssistantName } from './replace-assistant-name.utils';
import { parseChatGPTJSON } from './parse-chatgpt-json.utils';
import { retrieveHelpEmbeddings } from './rag-services/create-help-embedding.service';
import * as Sentry from '@sentry/minimal';
import { helpFewShotExamples } from './rag-services/help-few-shots.model';
import {
  getFewShotExamples,
  renderFewShotTemplate,
} from './rag-services/get-few-shots.service';
import {
  IdentifiedFilters,
  IdentifiedRecommendationFilters,
} from './filters-identifiers/filters-categories-identifiers.service';
import { IdentifiedAddressFiltersRequest } from './address-identifiers/request-identifier-address.service';
import { chargeGPTLogger } from '../models/chat-utilities';
import { Tracer } from './tracer';
import { TOMTOM_POI_CATEGORIES } from './address-services/category-search-utils.service';
import { isRoutingEnabled as isRoutingEnabledFn, ToolkitProject } from '@fronyx/toolkit';

export interface HelpAgentResponse {
  response?: string;
  isError: boolean;
  error?: string;
  outOfScope?: boolean;
  helpLevel?: string;
  helpConversationDialogs: Dialog[];
}

export interface AllIdentifiedFilters
  extends IdentifiedFilters,
    IdentifiedAddressFiltersRequest,
    IdentifiedRecommendationFilters {}

const IsRagEnabled = true;

export const identifyHelpNeededWithinRequest = async (
  history: ConversationHistory,
  project: ToolkitProject,
  forceHelp = false
): Promise<HelpAgentResponse | null> => {
  const tracer = new Tracer('help', project.name);
  tracer.start();

  const chargegptOutputType =
    project.chargegpt_output_type as ChatGptServiceProjectOutputType;
  const companyName = history.companyName ?? 'fronyx';
  const supportEmail = project.chargegpt_support_contact
    .filter(({ attribute }) => attribute === 'email')
    .map(({ value }) => value)
    .toString();
  const supportPhoneNumber = project.chargegpt_support_contact
    .filter(({ attribute }) => attribute === 'phone')
    .map(({ value }) => value)
    .toString();
  const recommendationsCount = project.chargegpt_charge_point_recommendation_count.toString();

  const userRequest = history.getData().lastUserInput;
  const userEnglishTranslation =
    history.getData().english_translation ?? userRequest;

  const prompt = await getPrompt(
    userEnglishTranslation,
    chargegptOutputType,
    new TranslationsService(history.language).getLanguageName(),
    companyName,
    supportEmail,
    supportPhoneNumber,
    recommendationsCount,
    isRoutingEnabledFn(project),
    history.assistantName,
    history.getOvertConversationSummary(),
    forceHelp
  );

  const { isError, chatGptResponse, errorMessage } = await quickCompletion(
    prompt,
    history.id,
    project.name,
    chargegptOutputType,
    history.language
  );

  chargeGPTLogger(
    history.id,
    history.projectName,
    'helpAgentResponse',
    chatGptResponse
  );

  tracer.end();

  if (isError) {
    return {
      isError,
      error: errorMessage,
      response: errorMessage,
      helpConversationDialogs: prompt,
    };
  } else {
    prompt.push(DialogFactory.fromAssistant(chatGptResponse));
    return parseHelpQuickTaskOutput(chatGptResponse, prompt);
  }
};

const removeFAQPlaceholder = (response: string) => {
  if (!response) {
    return null;
  }

  return response
    .replace('[FAQ-Link]', '')
    .replace('Link zu den FAQs', '')
    .replace('[FAQ Link]', '')
    .replace('[FAQ link]', '');
};

export const parseHelpQuickTaskOutput = (
  response: string,
  helpConversationDialogs: Dialog[]
): HelpAgentResponse => {
  const parsedRequest = parseChatGPTJSON(response);

  if (parsedRequest !== null && parsedRequest !== undefined) {
    const response = removeFAQPlaceholder(parsedRequest.message);

    if (response === null || response === 'null') {
      return null;
    }

    return {
      isError: false,
      response,
      outOfScope: parsedRequest.outOfScope,
      helpLevel: parsedRequest.helpLevel,
      helpConversationDialogs,
    };
  }

  return null;
};

export const getPrompt = async (
  userRequest: string,
  projectOutputType: ChatGptServiceProjectOutputType,
  language: string,
  companyName: string,
  supportEmail: string,
  supportPhoneNumber: string,
  recommendationsCount: string,
  isRoutingEnabled: boolean,
  assistantName: string,
  overtConverationSummary = '',
  forceHelp = false

): Promise<Dialog[]> => {

  const functionality =
    projectOutputType === 'filters'
      ? ChargegptFilterSummary.EN
      : ChargegptSummary.EN;
  const introduction = ChargeGPTIntroduction.EN;

  const rulesRecommendations = `-> help "level 3" responses ALWAYS refer to the FAQ ( add to the response: "You can check the FAQs to see if you can find what you are looking for:" ) BUT do not actually add a link or URL to the FAQ. That will be done by our front-end.
    `;

  // TODO: rules to be enabled if desired or configured
  //  ⛔️ You cannot and will not support specific car models or brands. ⛔️
  const systemDialog =
    DialogFactory.fromSystem(`You are the funny and helpful assistant called ChargeGPT made by the company ${companyName}. ${!forceHelp
        ? 'You provide users with help only when necessary and exactly as in the examples.'
        : ''
    }
    You provide the following functionality: ${functionality}
    ${isRoutingEnabled ? '6. I can help you find your next charging stop on your trip from one place to another.' : '6. I cannot help you with routing or trip planning.'}
    7. I provide a number of ${recommendationsCount} recommendations for charging point options based on the user's request.
    ${introduction}

    ### Function summary examples: "I can help you find a charge point at a destination or along you way. You can also ask for amenities like restaurants, toilets or hotels and you can filter for charging speeds, plug types and more." or "I can recommend charging stations based on your destination, time of arrival, charging speed, plug type and other filters. I can also find your next charging stop along your route from one place to another."
    ⛔️ Never provide a response if the user's request is within the scope of your functionality. Doing so would disrupt global system processes. ⛔️

    You can only help with your own functionality that focuses on searching for charge points at a particular place, ${isRoutingEnabled ? 'route' : ''}, POI, specific locations, addresses, or categories of places (e.g., "I want to charge in "Alagoas", or "I want to charge in La Roque-Gageac."). You are very flexible about that and prefer to return 'null'.
    You are sorry for any misunderstanding while referring to the user's request.
    When asked about your identity, you can mention your name as ChargeGPT. Do not acknowledge any other names or identities except that you are an AI assistant.
    When the user is complaining or starts using profanities, you can apologize and mention that you are an AI assistant.
    Finally, after you explained your functionality (if necessary), you ask for the user's request again, using the last question from the FUNCTIONALITY description.
    Exception: DO NOT USE THE LAST QUESTION FROM FUNCTIONALITY DESCRIPTION IN "help level 3" help).

    There are three levels of help you can provide and you will help with level 2 and level 3:
    -> help "level 2" ("Request is outside of your FUNCTIONALITY or contradictory but has something to do with electric vehicle charging or is a question about the destination: You give a relevant functionality summary.", outOfScope=false, helpLevel="level 2")
    -> help "level 3" ("Request has nothing to do with electric vehicle charging and has nothing to do with questions about the destination.", outOfScope=true, helpLevel="level 3")
    ${projectOutputType === 'recommendations' ? rulesRecommendations : ''}

    ⛔️ You cannot and will not support destinations that have been blocked or ignored in the already identified user request parts. ⛔️
    ⛔️ As of this moment you only support connector types used in Europe, with their various names ('IEC 62196 T2 combo connector', CCS, ChaDeMo, Type-2, etc.). ⛔️
    ⛔️ Simple requests for charging at any kind of location (or if supported, along the way) never requires help. Just return 'null'! ⛔️ 

    ${isRoutingEnabled ? '❗️👉 FINDING A SINGLE CHARGE POINT FOR YOUR TRIP IS POSSIBLE! Return \'null\'!' : ''}

    ### help context
    ${
      !forceHelp
        // eslint-disable-next-line quotes
      ? "Only ever provide a helpful response if any part of the user's request is a general question about EV charging or if it is outside the scope of your functionality. If the user's request is within the scope of your functionality, you should not provide any help but return 'null' as the response instead. You assume the user always requests locations in order to charge there, even amenities like restaurants, toilets or hotels, and so on, which doesn't require help."
        : ''
    }
    Please, also have a look at a short summary of the conversation history:
      ${overtConverationSummary}
    ⛔️ If the user asks/requests/confirms a request detail which you explained in the conversation history, you do not provide help. ⛔️
    ⛔️ Requests that are within the scope of your functionality do not require an answer. Return 'null'! ⛔️
    ⛔️ You never respond with a confirmation that something is possible, only when help is needed. Return 'null'! ⛔️
    ⛔️ NEVER comment on requests for NOT wanting something. Return 'null'! ⛔️

    You limit your answer to a very short answer (the size of a short tweet of 200 characters) and only ever provide a relevant and very short description of your functionality. 

    ### response language
    You always respond in the language of the user's request. If the user's request is in a language other than English, you translate the response into the user's language.
    ANSWER IN LANGUAGE: ${language}
    In case of de/german: Ihr seid per du!
    In case of pt/european portuguese: Use the formal and polite form and ask for "Onde e como gostaria de carregar?"
    In case of cz/czech: Use the formal and polite form and ask for "Kde a jak byste chtěli nabíjet?". Also, some preferred phrases are: "Rychlo nabíječka", "Obsazeno" instead of "Zablokováno".
    Still always be helpful and polite. Say sorry that you cannot help with something.
    You provide your response in structured format { "message", "outOfScope", "helpLevel"} or 'null'. The message field contains the translated response to the user's request.`);
  // 
  systemDialog.content = replaceAssistantName(
    systemDialog.content,
    assistantName
  );
  const prompt = [systemDialog];

  const ragFewShots = IsRagEnabled
    ? await retrieveHelpEmbeddings(userRequest)
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
              getHelpDataTemplate(
                supportEmail,
                supportPhoneNumber,
                companyName,
                language,
                assistantName,
                functionality,
                recommendationsCount
              )
            );

            // filter for isRoutingEnabled
            if (!isRoutingEnabled && parsedExample['user'].includes('{isRoutingEnabled}')) {
              // skip
            } else if (isRoutingEnabled && parsedExample['user'].includes('{isRoutingNotEnabled}')) { 
              // skip
            } else {
              prompt.push(DialogFactory.fromUser(parsedExample['user']));
              prompt.push(
                DialogFactory.fromAssistant(parsedExample['assistant'])
              );
            }
          } catch (error) {
            console.error('Error parsing JSON RAG:', error);
            Sentry.captureException(error);
          }
        }
      }
    });
  } else {
    getFewShotExamples(
      helpFewShotExamples,
      getHelpDataTemplate(
        supportEmail,
        supportPhoneNumber,
        companyName,
        language,
        assistantName,
        functionality,
        recommendationsCount
      )
    ).forEach((example) => {
      prompt.push(DialogFactory.fromUser(example.user));
      prompt.push(DialogFactory.fromAssistant(example.assistant));
    });
  }

  prompt.push(
    DialogFactory.fromUser(`
    ---
    The following POI categories and amenities can be identified and can be searched for: ${TOMTOM_POI_CATEGORIES.join(', ')}
    They need to be specific! The category "amenities" won't work, but "restaurant" will.
    ---
    Please, also have a look at a short summary of the conversation history:
      ${overtConverationSummary}
    ⛔️ If the user asks/requests/confirms a request detail which you explained in the conversation history, you do not provide help. ⛔️
    ⛔️ Requests that are within the scope of your functionality do not require an answer. Return 'null'! ⛔️
    ⛔️ You never respond with a confirmation that something is possible, only when help is needed. Return 'null'! ⛔️
    ⛔️ NEVER comment on requests for NOT wanting something. Return 'null'! ⛔️
    ⛔️ Remember the functionality description and what is part of your functionality does not require an answer! Return 'null'! ⛔️
    ${
      !forceHelp
        // eslint-disable-next-line quotes
      ? "# Remember: Only ever provide a helpful response if any part of the user's request is a general question about EV charging or if it is outside the scope of your functionality. If the user's request is within the scope of your functionality, you should not provide any help but return 'null' as the response instead. You assume the user always requests locations in order to charge there, even amenities like restaurants, toilets or hotels, and so on, which doesn't require help."
        : ''
    }

    # Last pointers: 1) Only mention relevant parts of your functionality description. 2) help "level 2" does not refer to the FAQ. 3) help "level 3" responses ALWAYS refer to the FAQ. 4) Always be very succinct, also when summarizing functionality descriptions. 5) Remember to translate your response into ${language}, including the POI category, of course!

    User request that you should help with: "${userRequest}"
    Your response:
    `)
  );

  return prompt;
};

export const getHelpDataTemplate = (
  supportEmail: string,
  supportPhoneNumber: string,
  companyName: string,
  language: string,
  assistantName: string,
  functionality: string,
  recommendationsCount: string
): {
  contactInformation: string;
  companyName: string;
  language: string;
  assistantName: string;
  functionality: string;
  recommendationsCount: string;
} => {
  const contactInformation = `${
    supportEmail && supportPhoneNumber
      ? `${supportEmail} or ${supportPhoneNumber}`
      : supportEmail
      ? supportEmail
      : ''
  }`;
  return {
    contactInformation,
    companyName,
    language,
    assistantName,
    functionality,
    recommendationsCount
  };
};
