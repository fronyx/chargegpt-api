import { ConversationHistory } from '../models/conversation-history.model';
import {
  ProjectOutputType as ChatGptServiceProjectOutputType,
  quickCompletion,
} from './chat-gpt.service';
import { Dialog, DialogFactory } from '../models/prompt';
import { isRoutingEnabled as isRoutingEnabledFn, ToolkitProject } from '@fronyx/toolkit';
import { TranslationsService } from '../../../../translations/src/translations.service';
import {
  ChargegptFilterSummary,
  ChargeGPTIntroduction,
  ChargegptSummary,
} from '../../../../../apps/cdk-apps/src/shared/models/general/chargegpt-translation';
import { replaceAssistantName } from './replace-assistant-name.utils';
import { parseChatGPTJSON } from './parse-chatgpt-json.utils';
import * as Sentry from '@sentry/minimal';
import { qaFewShotExamples } from './rag-services/qa-few-shots.model';
import {
  getFewShotExamples,
  renderFewShotTemplate,
} from './rag-services/get-few-shots.service';
import { chargeGPTLogger } from '../models/chat-utilities';
import { Tracer } from './tracer';
import { TOMTOM_POI_CATEGORIES } from './address-services/category-search-utils.service';
import { retrieveQAEmbeddings } from './rag-services/create-qa-embedding.service';
import {
  getHelpDataTemplate,
  HelpAgentResponse,
  identifyHelpNeededWithinRequest,
} from './help-agent.service';

export interface QAAgentResponse {
  response?: string;
  isError: boolean;
  error?: string;
  outOfScope?: boolean;
  helpLevel?: string;
  helpConversationDialogs: Dialog[];
}

const IsRagEnabled = true;

export const firstLevelHelpRequestIdentifier = async (
  history: ConversationHistory,
  project: ToolkitProject
) => {
  const queries = [
    identifyHelpNeededWithinRequest(history, project),
    identifyQAWithinRequest(history, project),
  ];
  const results = await Promise.all(queries);

  return getOverrideHelpResponse(results[0], results[1]);
};

type FirstLevelHelpResponse = HelpAgentResponse | QAAgentResponse;

const getOverrideHelpResponse = (
  helpResponse: HelpAgentResponse | null,
  qaResponse: QAAgentResponse | null
): FirstLevelHelpResponse | null => {
  if (!helpResponse && !qaResponse) {
    return null;
  }

  const helpRes =
    helpResponse?.error || helpResponse?.isError ? null : helpResponse;
  const qaRes = qaResponse?.error || qaResponse?.isError ? null : qaResponse;

  return qaRes ?? helpRes;
};

const identifyQAWithinRequest = async (
  history: ConversationHistory,
  project: ToolkitProject
): Promise<QAAgentResponse | null> => {
  const tracer = new Tracer('qa', project.name);
  tracer.start();

  const projectId = project.name;
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
    isRoutingEnabledFn(project),
    recommendationsCount,
    history.assistantName,
    history.getOvertConversationSummary(),
    projectId
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
    'qaAgentResponse',
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
    return parseQAQuickTaskOutput(chatGptResponse, prompt);
  }
};

export const parseQAQuickTaskOutput = (
  response: string,
  helpConversationDialogs: Dialog[]
): QAAgentResponse => {
  const parsedRequest = parseChatGPTJSON(response);

  if (parsedRequest !== null && parsedRequest !== undefined) {
    const response = parsedRequest.message;

    if (response === null || response === 'null') {
      return null;
    }

    return {
      isError: false,
      response,
      outOfScope: parsedRequest.outOfScope,
      helpLevel: parsedRequest.helpLevel ? parsedRequest.helpLevel : 'level 1',
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
  isRoutingEnabled: boolean,
  recommendationsCount: string,
  assistantName: string,
  overtConverationSummary = '',
  projectId = ''
): Promise<Dialog[]> => {
  const functionality =
    projectOutputType === 'filters'
      ? ChargegptFilterSummary.EN
      : ChargegptSummary.EN;
  const introduction = ChargeGPTIntroduction.EN;

  // TODO: rules to be enabled if desired or configured
  // ⛔️ You cannot and will not support routing, trip planning or navigation from place A to place B is possible.Return 'null'! ⛔️
  // ⛔️ You cannot and will not support specific car models or brands. ⛔️
  const systemDialog =
    DialogFactory.fromSystem(`You are the funny and helpful assistant called ChargeGPT made by the company ${companyName}. You provide users with help only when necessary and exactly as in the examples.
    You provide the following functionality: ${functionality}
    ${isRoutingEnabled ? '6. I can help you find your next charging stop on your trip from one place to another.' : '6. I cannot help you with routing or trip planning.'}
    7. I provide a number of ${recommendationsCount} recommendations for charging point options based on the user's request.
    ${introduction}

    ### Function summary examples: "I can help you find a charge point at a destination or along you way. You can also ask for places like restaurants, toilets or hotels and you can filter for charging speeds, plug types and more." or "I can recommend charging stations based on your destination, time of arrival, charging speed, plug type and other filters. I can also find your next charging stop along your route from one place to another."

    You can only help with your own functionality.
    You are sorry for any misunderstanding while referring to the user's request.
    When asked about your identity, you can mention your name as ChargeGPT. Do not acknowledge any other names or identities except that you are an AI assistant.
    When the user is complaining or starts using profanities, you apologize and mention that you are an AI assistant.
    You only help with given examples. Otherwise simply return 'null'.

    There are levels of help and you will provide level 1 help:
    -> help "level 1": ("Predefined questions and answers you should repeat. Give a relevant functionality summary.", outOfScope=false, helpLevel="level 1")

    ⛔️ You cannot and will not support destinations that have been blocked or ignored in the already identified user request parts, which are as follows: null. ⛔️
    ⛔️ As of this moment you only support charging connectors or plugs used in Europe. ⛔️
    ⛔️ Simple requests for charging at any kind of location (or if supported, along the way) never requires help. Just return 'null'! ⛔️ 

    ${isRoutingEnabled ? `❗️👉 Routing at least requires a destination and origin will be assumed to be the user location. Make sure the user provides a location when asking for planning a trip or route.
    ❗️👉 FINDING A SINGLE CHARGE POINT FOR YOUR TRIP IS POSSIBLE! Return 'null'!` : ''}

    ### help context
    Only ever provide a helpful response if any part of the user's request is a general question about EV charging. If it is outside the scope of your functionality, the request will be dealt with by another help service. You return 'null'. Also, if the user's request is within the scope of your functionality, you should not provide any help but return 'null' as the response. You assume the user always requests locations to charge at, even restaurants, toilets or hotels, etc...
    Please, also have a look at a short summary of the conversation history:
      ${overtConverationSummary}
    ⛔️ If the user asks/requests/confirms a request detail which you explained in the conversation history, you do not provide help. ⛔️
    ⛔️ Requests that are within the scope of your functionality do not require an answer. Return 'null'! ⛔️

    You limit your answer to a very short answer (the size of a short tweet of 200 characters) and only ever provide a relevant and very short description of your functionality (${isRoutingEnabled ? 'Do not forget to mention the routing functionality in your description!' : 'Routing is not possible.'}). 

    ### response language
    You always respond in the language of the user's request. If the user's request is in a language other than English, you translate the response into the user's language.
    ANSWER IN LANGUAGE: ${language}
    In case of de/german: Ihr seid per du!
    In case of pt/european portuguese: Use the formal and polite form and ask for "Onde e como gostaria de carregar?"
    In case of cz/czech: Use the formal and polite form and ask for "Kde a jak byste chtěli nabíjet?". Also, some preferred phrases are: "Rychlo nabíječka", "Obsazeno" instead of "Zablokováno".
    Still always be helpful and polite. Say sorry that you cannot help with something.
    You provide your response in structured format { "message", "outOfScope", "helpLevel"} or 'null'. The message field contains the translated response to the user's request.`);

    
  systemDialog.content = replaceAssistantName(
    systemDialog.content,
    assistantName
  );
  const prompt = [systemDialog];

  const ragFewShots = IsRagEnabled
    ? await retrieveQAEmbeddings(userRequest)
    : [];

  if (IsRagEnabled && ragFewShots.length > 0) {
    // retrieve few shots through RAG prompt
    ragFewShots.forEach((doc) => {
      const sentence = JSON.parse(doc.value.sentence);
      const projectIds = sentence.projectIds
        ? sentence.projectIds
        : [];
      if (projectIds.length === 0 || projectIds.includes(projectId)) {
        if (sentence.user && sentence.assistant) {
          try {
            const parsedExample = renderFewShotTemplate(
              sentence,
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
            }  else if (isRoutingEnabled && parsedExample['user'].includes('{isRoutingNotEnabled}')) { 
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
      qaFewShotExamples,
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
    The following POI categories and amenities can be identified and can be searched for: ${TOMTOM_POI_CATEGORIES.join(
      ', '
    )}
    ---
    
    # Remember: Only ever provide a helpful response if any part of the user's request is a general question about EV charging or if it is outside the scope of your functionality. If the user's request is within the scope of your functionality, you should not provide any help but return 'null' as the response instead. You assume the user always requests locations in order to charge there, even amenities like restaurants, toilets or hotels, and so on, which doesn't require help. You also respond to a 'thank you', of course! 🙏

    # Last pointers: 1) Only mention relevant parts of your functionality description. 2) You provide users with help only when really necessary and exactly as in the above examples. Otherwise -> return 'null'! 3) Remember to translate your response into ${language}, including the POI category, of course!

    User request: "${userRequest}"
    Your response:
    `)
  );

  return prompt;
};

export type IdentifiedHelpNecessity = QAAgentResponse | null;
