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
import { retrieveRecommendationHelpEmbeddings } from './rag-services/create-recommendation-help-embedding.service';
import * as Sentry from '@sentry/minimal';
import { recommendationHelpFewShotExamples } from './rag-services/recommendation-help-few-shots.model';
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
import { isRoutingEnabled as isRoutingEnabledFn, ToolkitProject } from '@fronyx/toolkit';
import { getChargingStationsAggregatedPropertiesValues } from './scoring-services/aggregated-scores.service';
import { last } from 'rxjs';

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

const IsRagEnabled = false;

export const identifyRecommendationHelpNeeded = async (
  history: ConversationHistory,
  project: ToolkitProject,
  previousRecommendation = ''
): Promise<HelpAgentResponse | null> => {
  const tracer = new Tracer('recommendationHelp', project.name);
  tracer.start();

  const chargegptOutputType =
    project.chargegpt_output_type as ChatGptServiceProjectOutputType;
  const recommendationsCount = project.chargegpt_charge_point_recommendation_count;

  const userRequest = history.getData().lastUserInput;
  const userEnglishTranslation =
    history.getData().english_translation ?? userRequest;
  const recommendations = history.getRecommendedChargingStations();
  // const previousRecommendationsString = previousRecommendation !== '' ? previousRecommendation : recommendations.map(point => { return ` - charge point: ${JSON.stringify(point)}` }).join('\n');
  const generatedRecommendationSummaryStatistics = recommendations.length > 0 ? await generateRecommendationSummaryStatistics(recommendationsCount, history) : '';

  const prompt = await getPrompt(
    userEnglishTranslation,
    chargegptOutputType,
    new TranslationsService(history.language).getLanguageName(),
    recommendationsCount.toString(),
    isRoutingEnabledFn(project),
    history.assistantName,
    history.getOvertConversationSummary(),
    generatedRecommendationSummaryStatistics
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
    'recommendationHelpAgentResponse',
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

export const parseHelpQuickTaskOutput = (
  response: string,
  helpConversationDialogs: Dialog[]
): HelpAgentResponse => {
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
  recommendationsCount: string,
  isRoutingEnabled: boolean,
  assistantName: string,
  overtConverationSummary = '',
  previousRecommendations = '',

): Promise<Dialog[]> => {

  const functionality =
    projectOutputType === 'filters'
      ? ChargegptFilterSummary.EN
      : ChargegptSummary.EN;
  const introduction = ChargeGPTIntroduction.EN;

  // TODO: rules to be enabled if desired or configured
  //  ⛔️ You cannot and will not support specific car models or brands. ⛔️
  const systemDialog =
    DialogFactory.fromSystem(`You are the funny and helpful assistant called ChargeGPT. You can only help with questions about the above described recommendation algorithm or the recommended charge points and why they were chosen. You will not answer questions about other topics or answer other kinds of requests. In those cases you always return 'null'.

    ### recommendation algorithm
    ChargeGPT recommends according to the following criteria:
    - Number of destination options checked for this search.
    - Search radius applied: 1,5 km or 15km around destination, accessible charge points 50km along route. 
    - Applied the filters provided by the user: destination, route user is on, operator, time, charging speed, power type, connector type.
    - Number of charge points checked for this search.
    - Applied a scoring based on distance, charging speed, (predicted) availability and the last time the charge point was used.

    ### help context
    You can only help with questions about the above described recommendation algorithm or the recommended charge points and why they were chosen. You will not answer questions about other topics or answer other kinds of requests. In those cases you always return 'null'.
    When asked about your identity, you can mention your name as ChargeGPT. Do not acknowledge any other names or identities except that you are an AI assistant.
    When the user is using profanities, just return 'null'.
    #### Conversation history: Please, also have a look at a short summary of the conversation history:
      ${overtConverationSummary}
    ⛔️ You never respond with a confirmation that something is possible, only when help is needed. Return 'null'! ⛔️
    #### Recommendation history: The previously provided recommendations:
      ${previousRecommendations}
    ❗️  You can also evaluate if the provided charge point parameters match the conversation history. For example, if the user asked for a specific connector type and this matches any of the charge point's "connectorTypes", you will point that out. Same for the other parameters, of course. ❗️

    ### response language
    You limit your answer to a very short answer (the size of a short tweet of 200 characters) and only ever provide a relevant and very short description of your functionality. 

    You always respond in the language of the user's request. If the user's request is in a language other than English, you translate the response into the user's language.
    ANSWER IN LANGUAGE: ${language}
    In case of de/german: Ihr seid per du!
    In case of pt/european portuguese: Use the formal and polite form and ask for "Onde e como gostaria de carregar?"
    In case of cz/czech: Use the formal and polite form and ask for "Kde a jak byste chtěli nabíjet?". Also, some preferred phrases are: "Rychlo nabíječka", "Obsazeno" instead of "Zablokováno".
    Still always be helpful and polite. Say sorry that you cannot help with something.
    You provide your response in structured format { "message", "outOfScope", "helpLevel"} or 'null'. The message field contains the translated response to the user's request. outOfScope is a boolean that is always false. helpLevel is always "level 4".`);
  // 
  systemDialog.content = replaceAssistantName(
    systemDialog.content,
    assistantName
  );
  const prompt = [systemDialog];

  const ragFewShots = IsRagEnabled
    ? await retrieveRecommendationHelpEmbeddings(userRequest)
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
      recommendationHelpFewShotExamples,
      getHelpDataTemplate(
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
    #### Conversation history: Please, also have a look at a short summary of the conversation history:
      ${overtConverationSummary}
    ⛔️ You never respond with a confirmation that something is possible, only when help is needed. Return 'null'! ⛔️
    #### Recommendation statistics:
      ${previousRecommendations}
    ❗️ You can also evaluate if the provided charge point parameters match the conversation history. For example, if the user asked for a specific connector type and this matches any of the charge point's "connectorTypes", you will point that out. Same for the other parameters, of course. ❗️

    # Remember: You can only help with questions about the above described recommendation algorithm or the recommended charge points and why they were chosen. You will not answer questions about other topics or answer other kinds of requests. In those cases you always return 'null'.
    # YOU ANSWER IN LANGUAGE: ${language}

    User request that you should help with: "${userRequest}"
    Your response:
    `)
  );
  console.log('recommendation stats', previousRecommendations);
  return prompt;
};

export const getHelpDataTemplate = (
  language: string,
  assistantName: string,
  functionality: string,
  recommendationsCount: string
): {
  language: string;
  assistantName: string;
  functionality: string;
  recommendationsCount: string;
} => {
  return {
    language,
    assistantName,
    functionality,
    recommendationsCount
  };
};

export const generateRecommendationSummaryStatistics = async (recommendationsCount: number, history: ConversationHistory): Promise<string> => {
  const aggregateScores = getChargingStationsAggregatedPropertiesValues(history);

  const splitRecommendedScores = {
    availability: aggregateScores.availability.slice(0, recommendationsCount),
    distance: aggregateScores.distance.slice(0, recommendationsCount),
    powerKw: aggregateScores.powerKw.slice(0, recommendationsCount),
  };
  const splitUnrecommendedScores = {
    availability: aggregateScores.availability.slice(recommendationsCount),
    distance: aggregateScores.distance.slice(recommendationsCount),
    powerKw: aggregateScores.powerKw.slice(recommendationsCount),
  };

  const recommendedStats = {
    availability: {
      meaning: 'the lower the better, 0 meaning 0 chance that the charger is in use',
      max: Math.max(...splitRecommendedScores.availability),
      min: Math.min(...splitRecommendedScores.availability),
      avg: splitRecommendedScores.availability.reduce((a, b) => a + b, 0) / splitRecommendedScores.availability.length,
      variance: splitRecommendedScores.availability.reduce((a, b) => a + Math.pow(b - (splitRecommendedScores.availability.reduce((a, b) => a + b, 0) / splitRecommendedScores.availability.length), 2), 0) / splitRecommendedScores.availability.length,
    },
    distance: {
      meaning: 'the lower the better, the lower the closer to the destination',
      max: Math.max(...splitRecommendedScores.distance),
      min: Math.min(...splitRecommendedScores.distance),
      avg: splitRecommendedScores.distance.reduce((a, b) => a + b, 0) / splitRecommendedScores.distance.length,
      variance: splitRecommendedScores.distance.reduce((a, b) => a + Math.pow(b - (splitRecommendedScores.distance.reduce((a, b) => a + b, 0) / splitRecommendedScores.distance.length), 2), 0) / splitRecommendedScores.distance.length,
    },
    powerKw: {
      meaning: 'the higher the better',
      max: Math.max(...splitRecommendedScores.powerKw),
      min: Math.min(...splitRecommendedScores.powerKw),
      avg: splitRecommendedScores.powerKw.reduce((a, b) => a + b, 0) / splitRecommendedScores.powerKw.length,
      variance: splitRecommendedScores.powerKw.reduce((a, b) => a + Math.pow(b - (splitRecommendedScores.powerKw.reduce((a, b) => a + b, 0) / splitRecommendedScores.powerKw.length), 2), 0) / splitRecommendedScores.powerKw.length,
    },
    lastUsed: {
      meaning: 'the higher the better, the higher the more recently the charger was used',
      max: Math.max(...aggregateScores.lastUsed),
      min: Math.min(...aggregateScores.lastUsed),
      avg: aggregateScores.lastUsed.reduce((a, b) => a + b, 0) / aggregateScores.lastUsed.length,
      variance: aggregateScores.lastUsed.reduce((a, b) => a + Math.pow(b - (aggregateScores.lastUsed.reduce((a, b) => a + b, 0) / aggregateScores.lastUsed.length), 2), 0) / aggregateScores.lastUsed.length,
    },
  }

  const unrecommendedStats = aggregateScores.length > 3 ? {
    availability: {
      meaning: 'the lower the better, 0 meaning 0 chance that the charger is in use',
      max: Math.max(...splitUnrecommendedScores.availability),
      min: Math.min(...splitUnrecommendedScores.availability),
      avg: splitUnrecommendedScores.availability.reduce((a, b) => a + b, 0) / splitUnrecommendedScores.availability.length,
      variance: splitUnrecommendedScores.availability.reduce((a, b) => a + Math.pow(b - (splitUnrecommendedScores.availability.reduce((a, b) => a + b, 0) / splitUnrecommendedScores.availability.length), 2), 0) / splitUnrecommendedScores.availability.length,
    },
    distance: {
      meaning: 'the lower the better, the lower the closer to the destination',
      max: Math.max(...splitUnrecommendedScores.distance),
      min: Math.min(...splitUnrecommendedScores.distance),
      avg: splitUnrecommendedScores.distance.reduce((a, b) => a + b, 0) / splitUnrecommendedScores.distance.length,
      variance: splitUnrecommendedScores.distance.reduce((a, b) => a + Math.pow(b - (splitUnrecommendedScores.distance.reduce((a, b) => a + b, 0) / splitUnrecommendedScores.distance.length), 2), 0) / splitUnrecommendedScores.distance.length,
    },
    powerKw: {
      meaning: 'the higher the better',
      max: Math.max(...splitUnrecommendedScores.powerKw),
      min: Math.min(...splitUnrecommendedScores.powerKw),
      avg: splitUnrecommendedScores.powerKw.reduce((a, b) => a + b, 0) / splitUnrecommendedScores.powerKw.length,
      variance: splitUnrecommendedScores.powerKw.reduce((a, b) => a + Math.pow(b - (splitUnrecommendedScores.powerKw.reduce((a, b) => a + b, 0) / splitUnrecommendedScores.powerKw.length), 2), 0) / splitUnrecommendedScores.powerKw.length,
    },
    lastUsed: {
      meaning: 'the higher the better, the higher the more recently the charger was used',
      max: Math.max(...aggregateScores.lastUsed),
      min: Math.min(...aggregateScores.lastUsed),
      avg: aggregateScores.lastUsed.reduce((a, b) => a + b, 0) / aggregateScores.lastUsed.length,
      variance: aggregateScores.lastUsed.reduce((a, b) => a + Math.pow(b - (aggregateScores.lastUsed.reduce((a, b) => a + b, 0) / aggregateScores.lastUsed.length), 2), 0) / aggregateScores.lastUsed.length,
    },
  } : {};

  return recommendationsCount > 0 ? `I generated ${recommendationsCount} recommendations. To highlight the difference between recommended charge points and unrecommended ones, here are some statistics:
  # stats for recommended charge points: ${JSON.stringify(recommendedStats)}
  # stats for unrecommended charge points: ${JSON.stringify(unrecommendedStats)}` : '';
}
