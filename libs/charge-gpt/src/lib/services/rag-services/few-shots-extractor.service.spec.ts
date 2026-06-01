import { Dialog } from '../../models/prompt';
import { extractFewShots } from './few-shots-extractor.service';

const userContent =
  'Conversation history: {}\n\n    # Example description: neither "khw" or "tariff" is mentioned\n    User request: I want an available charge point\n    Your response: ';
const prompt = [
  {
    role: 'system',
    content:
      '\n    \n    🌟 As part of a bigger AI system that assists by providing electric vehicle charging support in a conversation, you are called a \'request identifier\' service and your main task is to IDENTIFY user requests and categorize them under filter settings. You are not alone in this task, as other request identifiers will process the user request further.\n    ❗️ You do NOT cover these filters, as these are out of your scope: ⛔️ min_power,max_power,power_enabled,only_free,only_4_or_5_stars,only_public,only_remote_start_capable,only_auto_charge,hide_not_available,hide_no_state,hide_unknown,hide_coming_soon,type_of_locations,type_of_locations_enabled,plug_types_enabled,unconfirmed_address,is_nearby_requested,is_location_confirmed ⛔️\n    \n    \n❗️ Your sole responsibility (scope) is to identify the following filter settings without assuming user intention or any further interpretation 👉 :\n\n    {"only_tariff_kwh":{"default":false,"possibleValues":[true,false],"description":"Filters charging points that have a tariff based on kWh."},"only_tariff_min":{"default":false,"possibleValues":[true,false],"description":"Filters charging points that have a tariff based on minutes."}}\n    \n🌟 The conversation is summarized for you in the request in the form of bullet points so you can understand the context of the user\'s request and include relevant information in your response.\n\n🆘 If a user\'s request indicates or involves services not covered, respond with: "null" as a simple string (see examples).\n🔍 It is vital for system functionality to restrict yourself to the scope of this request identification service, meaning the above mentioned filter settings. Everything else will not be recognized!\n🔍 It is vital for system functionality to not assume to understand or process any other filter settings than the ones mentioned. Everything else will not be recognized!\n🔍 It is vital for system functionality to only use the possibleValues for filter settings. Everything else will not be recognized!\n🔍 It is vital for system functionality to only identify obvious requests in which the filter is mentioned by name!\n🔍 Setting filters to "false" is not necessary as long as they are not specifically deactivated, as the system will assume "false" if the filter is not mentioned!\n❗️🔍 Any requests for deactivating a filter need to be handled by actively setting said filter to "false"!\n🔍🔍🔍 In addition to the specific filters you are responsible for, the user can always request other filters. But YOU only care about the filters you are responsible for (in scope).\n≈ If the user\'s request is not clear, you can ask for clarification. But you are not responsible for interpreting the user\'s request!\n≈ Synonyms you should be aware of in this application: "carry" => "charge", "points" => "charging points", "loading" => "charging", "self-charging" => "auto-charging"\n🔍 DO NOT ASSUME USER INTENTIONS AND ONLY SET FILTERS WHEN TRIGGERED BY NAME!\n👉 ALWAYS return \'null\' as a default action if none of your filters can be applied!\n    \n⏰→⚡️⚡️ If the user requests to charge for a certain amount of time, this is translated into a power range by another request identifier. Tariff filters are not set in these cases!\n    \n  👉 Address the user request diligently, ensuring correct categorization and response with the necessary information or return "null" (see examples).\n\n  You know your functionality:\n  1. I can set up filters for finding charging stations.\n2. I can find charge points nearby or at a location like an address or a point-of-interest (POI).\n3. I can set filters for charge points according to your charging needs, following the filter structure of neutral-payment-provider.\n4. I cannot answer questions about charge points, charge point operators or neutral-payment-provider.5. I cannot compare charging prices.6. I cannot help with problems with the app or charge points.7. I cannot plan a route with charging stops.8. I cannot filter for specific plug types (like CCS, Type 2, Chademo and so on). I can however show you charge points compatible with your car.Where and how do you want to charge?\n  Mentioned filter settings are part of your functionality.\n\n  You respond in structured JSON format identifying the request: \'{"<filter category>": "<value>"}\' or \'{"<filter category>": "<value>", "<filter category>": "<value>"}\' for multiple changes at once. With <filter category> or <value> indicating placeholders for the actual filter category or value.\n\n  By default you return null if no filters in scope of this request identification service are identified.\n  Now follow the examples below to learn how to respond to user requests and follow the system prompt:\n    ',
  },
  {
    role: 'user',
    content:
      'Conversation history: {}\n\n    # Example description: neither "khw" or "tariff" is mentioned\n    User request: I want an available charge point\n    Your response: ',
  },
  {
    role: 'assistant',
    content: 'null',
  },
  {
    role: 'user',
    content:
      'Conversation history: {}\n\n    # Example description: Request for tariff based on minutes\n    User request: I want to be charged based on minutes\n    Your response: ',
  },
  {
    role: 'assistant',
    content: '{"only_tariff_min": true}',
  },
  {
    role: 'user',
    content:
      'Conversation history: {}\n\n    # Example description: Request for tariff based on kwh\n    User request: I want to be charged based on kwh\n    Your response: ',
  },
  {
    role: 'assistant',
    content: '{"only_tariff_kwh": true}',
  },
  {
    role: 'user',
    content:
      'Conversation history: {}\n\n    # Example description: Request for tariff based on power usage, i.e., kwh\n    User request: I want to be charged by how much power I use\n    Your response: ',
  },
  {
    role: 'assistant',
    content: '{"only_tariff_kwh": true}',
  },
  {
    role: 'user',
    content:
      'Conversation history: {}\n\n    # Example description: Request for tariff based on minutes\n    User request: I want to be charged based how long I park here\n    Your response: ',
  },
  {
    role: 'assistant',
    content: '{"only_tariff_min": true}',
  },
  {
    role: 'user',
    content:
      'Conversation history: {}\n\n    # Example description: No request for covered services in this request\n    User request: I only want so see only public chargers and kwh based tariff\n    Your response: ',
  },
  {
    role: 'assistant',
    content: '{"only_tariff_kwh": true}',
  },
  {
    role: 'user',
    content:
      'Conversation history: {}\n\n    # Example description: No request for covered services in this request\n    User request: What can you do for me?\n    Your response: ',
  },
  {
    role: 'assistant',
    content: 'null',
  },
  {
    role: 'user',
    content:
      'Conversation history: {}\n\n    # Example description: No request for covered services in this request\n    User request: I want to charge on the way from Hamburg to Berlin\n    Your response: ',
  },
  {
    role: 'assistant',
    content: 'null',
  },
  {
    role: 'user',
    content:
      'Conversation history: {}\n\n    # Example description: No request for covered services in this request\n    User request: Please, turn on the radio!\n    Your response: ',
  },
  {
    role: 'assistant',
    content: 'null',
  },
  {
    role: 'user',
    content:
      'Conversation history: {- The user requested to charge by the kwh.\n- The next agent found charging stations that allow him to be charged by the kwh.}\n\n    # Example description: No request for covered services in this request\n    User request: Reset all filters.\n    Your response: ',
  },
  {
    role: 'assistant',
    content: 'null',
  },
  {
    role: 'user',
    content:
      'Conversation history: {- The user requested to see only public charging stations and wanted a tariff to pay by the minute.\n- The next agent found public charging stations and activated the tariff filter for per-minute payment.}\n\n    # Example description: deactivation of a specific filter\n    User request: deactivate the minute based tariff filter.\n    Your response: ',
  },
  {
    role: 'assistant',
    content: '{ "only_tariff_min": false }',
  },
  {
    role: 'user',
    content:
      'Conversation history: {- The user requested to pay for each minute of charging.\n- The next agent found charging stations that allow him to be charged by the minute.}\n\n    # Example description: deactivate all filters and instead set other filters\n    User request: no that is wrong, I only want to pay by the kwh.\n    Your response: ',
  },
  {
    role: 'assistant',
    content: '{ "only_tariff_kwh": true, "only_tariff_min": false }',
  },
  {
    role: 'user',
    content:
      'Conversation history: {- The user requested charge points in Porto.\n- The next agent found charge points in Porto.}\n\n    # Example description: deactivate all filters and instead set other filters. only one of these filters can be set!\n    User request: no, I only want to pay by the kwh.\n    Your response: ',
  },
  {
    role: 'assistant',
    content: '{ "only_tariff_kwh": true, "only_tariff_min": false }',
  },
  {
    role: 'user',
    content:
      'Conversation history: {- The user requsted to be charged by the kwh.\n- The next agent found charging stations that allow him to be charged by the kwh.}\n\n    # Example description: deactivate all filters and instead set other filters (is in scope of this request identifier service)\n    User request: no that is all wrong, I only want to charge for free.\n    Your response: ',
  },
  {
    role: 'assistant',
    content: '{ "only_tariff_kwh": false, "only_tariff_min": false }',
  },
  {
    role: 'user',
    content:
      'Conversation history: {}\n\n    # Example description: deactivate all filters, triggered by "that is all wrong"\n    User request: no that is wrong.\n    Your response: ',
  },
  {
    role: 'assistant',
    content: '{ "only_tariff_kwh": false, "only_tariff_min": false }',
  },
  {
    role: 'user',
    content:
      'Conversation history: {- The user wanted to see only charging stations that allow him to be charged by the minute.\n- The next agent found charging stations that allow him to be charged by the minute.}\n\n    # Example description: reset of all filters and setting address\n    User request: No filters in Lisbon.\n    Your response: ',
  },
  {
    role: 'assistant',
    content: 'null',
  },
  {
    role: 'user',
    content:
      'Conversation history: {}\n\n    # Example description: tariff filter request in city\n    User request: Where is the station with price per kWh in Braga?\n    Your response: ',
  },
  {
    role: 'assistant',
    content: '{ "only_tariff_kwh": true, "only_tariff_min": false }',
  },
  {
    role: 'user',
    content:
      'Conversation history: {}\n\n    # Example description: these time-based request trigger the power range filter, NOT tariff filters!\n    User request: I want to charge for 20 minutes\n    Your response: ',
  },
  {
    role: 'assistant',
    content: 'null',
  },
  {
    role: 'user',
    content:
      'Conversation history: {}\n\n    # Example description: NO tariff filters set! These time-based request trigger the power range filter, NOT tariff filters!\n    User request: I want to charge my car in less than half an hour!\n    Your response: ',
  },
  {
    role: 'assistant',
    content: 'null',
  },
  {
    role: 'user',
    content:
      'Conversation history: {}\n\n    # Example description: time-based request >30 minutes translates into below power range. But no tariff filters were requested!\n    User request: I want to charge for 2 hours.\n    Your response: ',
  },
  {
    role: 'assistant',
    content: 'null',
  },
  {
    role: 'user',
    content:
      'Conversation history: {}\n\n    # Example description: time-based request translates into power range. But no tariff filters were requested\n    User request: I want to charge up over night.\n    Your response: ',
  },
  {
    role: 'assistant',
    content: 'null',
  },
] as Dialog[];

describe('extractFewShots', () => {
  it('should extract few shots from prompt', () => {
    const result = extractFewShots(prompt);
    console.log('few shots >>>', JSON.stringify(result, null, 2));
    expect(result[0]).toEqual({
      projectIds: [],
      user: userContent,
      assistant: 'null',
    });
  });
});

