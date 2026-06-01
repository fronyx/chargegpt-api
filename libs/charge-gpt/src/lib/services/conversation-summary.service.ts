import { Injectable } from '@nestjs/common';
import { ConversationHistory } from '../models/conversation-history.model';
import { quickCompletion } from './chat-gpt.service';
import { DialogFactory } from '../models/prompt';
import { replaceAssistantName } from './replace-assistant-name.utils';
import { chargeGPTLogger } from '../models/chat-utilities';
import { Tracer } from './tracer';
import { TOMTOM_POI_CATEGORIES } from './address-services/category-search-utils.service';
import { ToolkitProject } from '@fronyx/toolkit';

export interface ConversationSummaryResponse {
  response?: string;
  isError: boolean;
  error?: string;
}

@Injectable()
export class ConversationSummaryService {
  async process(
    history: ConversationHistory,
    project: ToolkitProject,
  ): Promise<ConversationSummaryResponse> {
    const tracer = new Tracer('summary', project.name);
    tracer.start();

    const conversationHistory = this.prepareConversationHistory(history);

    const systemDialog = DialogFactory.fromSystem(`You are a very intelligent assistant as part of a bigger system that consists of multiple agents. Your goal is to translate and summarize an ongoing conversation so that different agents can understand the state of the conversation. You should provide a summary of the conversation that is helpful for the next agent.
    
    The conversation is always about identifying the charging needs of an electric vehicle (EV) driver. Different agents can fulfil different charging needs but they all need to know the state of the conversation. This is where you come in and summarize the conversation history for the next agent without leaving out any important details. If there are any numbered bullet points in the conversation history, you should include them in the summary.

    You translate the conversation (do not mention request in original language) and summarize it in english only. You limit the summary to use the following POI categories when mentioned (NEVER DEVIATE): ${TOMTOM_POI_CATEGORIES.join(', ')}  

    For example: The user requested to charge at a McDonalds restaurant without providing the name of the city where that restaurant is in. Next an agent asked the user for the city name. The user responded with the city name. The next agent can use this information to help the user find a charge point at the McDonalds restaurant in the city the user mentioned. For the next agent to understand the user's response with the city name in context, you summarize this conversation history as follows.

    Summary in bullet points:
    - The user requested to charged at McDonalds restaurant without providing the city name.
    - The next agent asked the user for the city name.
    - You can now expect the user to provide the city name in which the McDonalds restaurant is in.
    `);
    systemDialog.content = replaceAssistantName(systemDialog.content, history.assistantName);
    const prompt = [systemDialog];

    prompt.push(DialogFactory.fromUser(`
    Conversation history:
    [user] "I want to charge at McDonalds."
    [assistant] "In which city?"

    Summary in bullet points:
    `));
    prompt.push(DialogFactory.fromAssistant(`- The user requested to charge at McDonalds restaurant without providing the city name.
    - The assistant asked the user for the city name.
    - You can now expect the user to provide the city name in which the McDonalds restaurant is in.`));

    prompt.push(DialogFactory.fromUser(`
    Conversation history:
    [user] "I want to charge at McDonalds."
    [assistant] "In which city?"
    [user] "Around me."

    Summary in bullet points:
    `));
    prompt.push(DialogFactory.fromAssistant(`- The user requested to charge at McDonalds restaurant without providing the city name.
    - The assistant asked the user for the city name.
    - The user requested to charge nearby.`));

    prompt.push(DialogFactory.fromUser(`
    Conversation history:
    [user] "I want very slow charging around me"
    [assistant] "Please provide access to your current location."
    [user] "I want very slow charging around me - My current coordinates are: 52.013405755809316 / 8.745638215220723"
    [user] "The address for that given coordinates is: Goekenbrede 28, 32791 Lage"

    Summary in bullet points:
    `));
    prompt.push(DialogFactory.fromAssistant(` - The user requested very slow charging around their current location.
- The assistant asked the user to provide access to their current location.
- The user provided their current coordinates and the corresponding address (Goekenbrede 28, 32791 Lage).`));

    prompt.push(DialogFactory.fromUser(`
    Conversation history:
    [user] "I want to charge at McDonalds in London."
    [assistant] "I found a charge point at McDonalds in London."
    [user] "I only want to see fast chargers."
    [assistant] "I found a fast charger at McDonalds in London."
    [user] "Better show me chargers in the city center."

    Summary in bullet points:
    `));
    prompt.push(DialogFactory.fromAssistant(`- The user requested to charge at McDonalds restaurant in London.
    - The assistant found charge points that match those parameters.
    - The user requested to see only fast chargers.
    - The assistant found charge points that match those parameters.
    - The user requested to see chargers in the city center instead of McDonalds.
    - The assistant found charge points that match those parameters.`));

    prompt.push(DialogFactory.fromUser(`
    Conversation history:
    [user] "I want to charge a 250kw charge point from Ionity"
    [assistant] "I'm sorry, I cannot filter for charge point operators like Ionity."
    [user] "Then just above 250 kW."

    Summary in bullet points:
    `));
    prompt.push(DialogFactory.fromAssistant(`- The user requested to charge at a 250kW charge point from Ionity.
    - The assistant informed the user that they cannot filter for charge point operators like Ionity.
    - The user requested to see charge points just above 250kW.
    - The assistant found charge points that match those parameters.`));

    prompt.push(DialogFactory.fromUser(`
    Conversation history:
    [user] "Apenas postos rápidos"
    [assistant] "Os seguintes postos de carregamento correspondem ao seu pedido:"

    Summary in bullet points:
    `));
    prompt.push(DialogFactory.fromAssistant(`- The user requested only fast chargers.
    - The assistant found charge points that match those parameters.`));

    prompt.push(DialogFactory.fromUser(`
    Conversation history:
    [user] "Let me see chargers in Wolfhausen"
    [assistant] "Which of the options would you like to choose: 1.) Wolfhausen, Bubikon, 2.) Wolfhausen, Teisendorf, 3.) Wolfhausen, Tacherting?"

    Summary in bullet points:
    `));
    prompt.push(DialogFactory.fromAssistant(`- The user requested to see chargers in Wolfhausen.
    - The assistant provided different location options to choose from and you can expect an answer related to that: 1.) Wolfhausen, Bubikon, 2.) Wolfhausen, Teisendorf, 3.) Wolfhausen, Tacherting.`));

    prompt.push(DialogFactory.fromUser(`
    Conversation history:
    [user] "I want to charge near me at a McDonald's."
    [assistant] "Please provide access to your current location."
    [user] "I want to charge near me at a McDonald's - My current coordinates are: 51.52707 / 7.58324
    [user] The address for that given coordinates is: Von-Seeckt-Straße 9, 45130 Essen
    [assistant] "Which McDonald's location would you like to charge your electric vehicle at: 1.) Eleonorastraße 12, Essen, 2.) Am Hauptbahnhof 5, Essen, or 3.) Kettwiger Str. 56, Essen?"

    Summary in bullet points:
    `));
    prompt.push(DialogFactory.fromAssistant(`- The user requested to charge near a McDonald's.\n- The user provided the address for the given coordinates (Von-Seeckt-Straße 9, 45130 Essen).
- The assistant provided different McDonald's location options to choose from and you can expect an answer related to that: 1.) Eleonorastraße 12, Essen, 2.) Am Hauptbahnhof 5, Essen, or 3.) Kettwiger Str. 56, Essen`));

    prompt.push(DialogFactory.fromUser(`
    Conversation history:
    ${conversationHistory}

    Summary in bullet points: `));

    const {
      isError,
      chatGptResponse,
      errorMessage
    } = await quickCompletion(prompt, history.id, project.name, project.chargegpt_output_type, history.language);

    tracer.end();

    if (isError) {
      chargeGPTLogger(history.id, project.name, 'summaryResponseError', errorMessage)

      return {
        isError,
        error: errorMessage,
        response: errorMessage
      };
    } else {
      chargeGPTLogger(history.id, project.name, 'summaryResponse', chatGptResponse);

      return {
        isError: false,
        response: chatGptResponse,
      }
    };
  }

  prepareConversationHistory(history: ConversationHistory): string {
    const overtConversation = history.getOvertConversation();
    let conversationHistory = '';
    overtConversation.forEach((message) => {
      conversationHistory += `[${message.role}] "${message.content}"\n`;
    });

    return conversationHistory;
  }
}
