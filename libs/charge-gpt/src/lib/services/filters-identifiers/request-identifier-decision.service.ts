import { Injectable } from '@nestjs/common';
import { ConversationHistory } from '../../models/conversation-history.model';
import { quickCompletion } from '../chat-gpt.service';
import { DialogFactory, Dialog } from '../../models/prompt';
import { parseChatGPTJSON } from '../parse-chatgpt-json.utils';
import { Tracer } from '../tracer';
import { ToolkitProject } from '@fronyx/toolkit';

const in_scope_filters = {
  'type_of_locations': {
    'type': [],
    'default': [],
    'possibleValues': ['Restaurant', 'Hotel', 'Supermarket', 'Shopping center', 'Service station', 'Motorway service station', 'Paid parking', 'Free car park', 'Dealer', 'Taxi', 'Company', 'Store', 'Workshop', 'Camping', 'Airport'],
    'description': 'An array of location types to filter for. Only these types of locations are valid and they have to be requested specifically and by name. If the user requests type of location you also enable the type_of_locations_enabled. Only set type of locations if a possibleValue is requested specifically! Never ever assume the type_of_location about a requested location name!'
  }, 
  'type_of_locations_enabled': {
    'type': Boolean,
    'default': false,
    'possibleValues': [true, false],
    'description': 'Determines whether the type_of_locations filter is active. Only use this filter setting when a specific type_of_locations is requested by name. Never ever assume to know the type of location just by the name of a location!'
  }, 
  'plug_types_enabled': {
    'type': Boolean,
    'default': false,
    'possibleValues': [true, false],
    'description': 'Determines whether the filter for compatible types of plug or connector or socket is active. Filtering charge points with plug types that my car is compatible with (as defined in the App). Also use when asked for charge points that "suit" the user\'s car, meaning they have compatible plugs.'
  }
}

const few_shot_examples = [
    {'user': `User request: I want to charge at a supermarket in Lisbon.

    Your response:`,
    'assistant': '{"redIdentNecessary": true}'},

    {'user': `User request: I want to charge in Lisbon.

    Your response:`,
    'assistant': '{"redIdentNecessary": false}'},

    {'user': `User request: Motorway service station close to Berlin.

    Your response:`,
    'assistant': '{"redIdentNecessary": true}'},

    {'user': `User request: along a highway close to Munich.

    Your response:`,
    'assistant': '{"redIdentNecessary": true}'},

    {'user': `User request: I want to charge at the A3 fast.

    Your response:`,
    'assistant': '{"redIdentNecessary": true}'},


    {'user': `User request: Show me chargers at resturants close by

    Your response:`,
    'assistant': '{"redIdentNecessary": true}'},

    {'user': `User request: Show me chargers at a thai resturant

    Your response:`,
    'assistant': '{"redIdentNecessary": true}'},

    {'user': `User request: I want to charge at compatible chargers.

    Your response:`,
    'assistant': '{"redIdentNecessary": true}'},

    {'user': `User request: A hotel in central of Porto

    Your response:`,
    'assistant': '{"redIdentNecessary": true}'},

    {'user': `User request: Airport in Paris.

    Your response:`,
    'assistant': '{"redIdentNecessary": true}'},

    {'user': `User request: Only compatible plug types.

    Your response:`,
    'assistant': '{"redIdentNecessary": true}'},

    {'user': `User request: Only CCS chargers that are compatible.

    Your response:`,
    'assistant': '{"redIdentNecessary": true}'},

     {'user': `User request: Only compatible chargers at comping sites.

    Your response:`,
    'assistant': '{"redIdentNecessary": true}'},
]

@Injectable()
export class RequestIdentifierDecisionService {
  async makeDecision(
    history: ConversationHistory,
    project: ToolkitProject,
  ): Promise<{
    useIdentifier: boolean,
    error: string | undefined
  }> {
    const tracer = new Tracer('identDecision', project.name);
    tracer.start(); 

    const userRequest = history.getData().lastUserInput;

    if (!userRequest) {
      return {
        useIdentifier: false,
        error: undefined,
      };
    }

    const userEnglishTranslation = history.getData().english_translation ?? userRequest;

    const prompt: Dialog[] = [];
    const projectOutputType = project.chargegpt_output_type;

    prompt.push(DialogFactory.fromSystem(`You are an expert decision maker that decides if the given user request requires to be checked for a number of filter settings in App for finding charging stations for electric vehicles.

    Description of the filter settings you are responsible for:
    ${in_scope_filters}

    You answer in a structured JSON format returning the variable "redIdentNecessary" with the value "true" or "false" depending on whether the user request requires to be checked for the filter settings or not.`));

    
    few_shot_examples.forEach(example => {
        prompt.push(DialogFactory.fromUser(example['user']));
        prompt.push(DialogFactory.fromAssistant(example['assistant']));
    });

    prompt.push(DialogFactory.fromUser(`User request: ${userEnglishTranslation}

    Your response: `));

    const {
      isError: chatGptError,
      chatGptResponse,
      errorMessage
    } = await quickCompletion(
      prompt,
      history.id,
      project.name,
      projectOutputType,
      history.language,
    );

    tracer.end();

    if (chatGptError) {
      return {
        useIdentifier: false,
        error: errorMessage,
      };
    }

    const parsedRequest = parseChatGPTJSON(chatGptResponse);
    const result = { useIdentifier: undefined, error: undefined };

    if (parsedRequest !== null) {
        result.useIdentifier = parsedRequest.redIdentNecessary;
    }

    return result;
  }
}
