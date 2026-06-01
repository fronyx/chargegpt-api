import { ConversationHistory } from '../../models/conversation-history.model';
import {
    ProjectOutputType as ChatGptServiceProjectOutputType,
    NecessaryInformationPayload,
    quickCompletion,
} from '../chat-gpt.service';
import { DialogFactory, Dialog } from '../../models/prompt';
import { parseChatGPTJSON } from '../parse-chatgpt-json.utils';
import {
    detectOutOfScope,
    filterValidSettingsFromResponse,
    getFiltersString,
} from '../filters-identifiers/request-identifier.utils';
import { Tracer } from '../tracer';
import { routeNeedsFewShotExamples } from '../rag-services/route-needs-few-shots.model';
import { getValidFewshotsForProjectOutputType } from '../rag-services/few-shots-extractor.service';
import { chargeGPTLogger } from '../../models/chat-utilities';
import {
    SUPPORTED_PEER_ID,
} from '../filters-identifiers/operator-names.constant';
import * as fastJson from 'fast-json-stringify';
import { ToolkitProject } from '@fronyx/toolkit';
import { TOMTOM_POI_CATEGORIES } from '../address-services/category-search-utils.service';

export enum CategoryPropertiesEnum {
    ROUTE_NEED = 'route_need',
}

const stringifier = fastJson({
    title: 'RouteNeedsResponse',
    type: 'object',
    properties: {
        route_need: { type: 'string' },
    },
});

const routeNeedsResponseStringify = (data) => {
    if (!data) {
        return null;
    }

    return stringifier(data);
};

export const necessaryInformation: Record<
    CategoryPropertiesEnum,
    NecessaryInformationPayload
> = {
    [CategoryPropertiesEnum.ROUTE_NEED]: {
        type: String,
        default: null,
        possibleValues: [''],
        description:
            `Information about a specific requirement for the next charging stop. Examples for these needs are POI categories, like "toilet", or specific POI names for fast-food chains, like "McDonalds" or "Subway". Possible POI categories are limited to: ${TOMTOM_POI_CATEGORIES}`,
    },
};

export type IdentifiedRouteNeedsRequest = Record<
    CategoryPropertiesEnum,
    string
> | null;

export interface IdentifiedRouteNeeds {
    request: IdentifiedRouteNeedsRequest;
    error: string | null;
}

export const identifyRouteNeeds = async (
    history: ConversationHistory,
    project: ToolkitProject
): Promise<IdentifiedRouteNeeds> => {
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
    const tracer = new Tracer('identRouteNeeds', project.name);
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

    const parsedOutput = await parseRouteNeedQuickTaskOutput(
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
        'reqIdentRouteNeedsResponse',
        routeNeedsResponseStringify(parsedOutput.request)
    );

    return parsedOutput;
}

export const parseRouteNeedQuickTaskOutput = async (
    response: string,
    conversationId: string,
    projectName: string,
    projectOutputType: string,
    language: string,
    peerId: SUPPORTED_PEER_ID
): Promise<IdentifiedRouteNeeds> => {
    const parsedRequest = parseChatGPTJSON(response);
    const result = { request: undefined, error: null };

    if (parsedRequest !== null) {
        const isValid = !detectOutOfScope(parsedRequest);

        if (isValid) {
            const routeNeed = parsedRequest.route_need
                ? parsedRequest.route_need
                : null;
            const filters = {
                [CategoryPropertiesEnum.ROUTE_NEED]: routeNeed,
            };

            result.request = filterValidSettingsFromResponse(
                filters,
                Object.keys(necessaryInformation)
            );
        } else {
            result.request = null;
        }
    }
    return result;
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

    const reqIdentPrompt = `You are part of a larger system that helps drivers of electric vehicles to find charging stations. You are aware of the user request and the conversation history. The user wants to plan a route from location A to location B. Sometimes, the user might have a specific need for the next charging stop as signified in the user request.
    If a user mentions a specific need for the next charging stop, you compare if it agrees with the following definition. If it does, you identify the need and respond accordingly: ${JSON.stringify(necessaryInformation)}

    Charge point requirements can only be POI categories or specific POI names for fast-food chains. Request for fast charging etc. are not part of the requirements. When a POI category is mentioned you match it to one of the available categories above (NEVER DEVIATE): ${TOMTOM_POI_CATEGORIES.join(', ')} (e.g., use "shopping center" instead of "shopping mall"!

    You respond in structured JSON format identifying the request: '{"<filter category>": "<value>"}' or '{"<filter category>": "<value>", "<filter category>": "<value>"}' for multiple changes at once. With <filter category> or <value> indicating placeholders for the actual filter category or value.

    Return 'null' if you cannot identify any additional requirement for the next charging stop. Otherwise, encode the identified requirement in the JSON format mentioned above.
    Now follow the examples below to learn how to better understand the system prompt and respond to user requests:
  `;
    prompt.push(DialogFactory.fromSystem(reqIdentPrompt));

    getValidFewshotsForProjectOutputType(
        projectOutputType,
        routeNeedsFewShotExamples
    ).forEach((example) => {
        prompt.push(DialogFactory.fromUser(example.user));
        prompt.push(DialogFactory.fromAssistant(example.assistant));
    });


    prompt.push(
        DialogFactory.fromUser(`
  # Now follows an actual user request. Please identify the need for the next charging stop, if any.
  User request: ${englishTranslation}
  Your response: `)
    );

    return prompt;
};
