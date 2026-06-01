export const cat4FewShotExamples = [
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: simple charging in city request. nothing to do here. Return null.\n    User request: Charging in Porto.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: neither "khw" or "tariff" is mentioned\n    User request: I want an available charge point\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Request for tariff based on minutes\n    User request: I want to be charged based on minutes\n    Your response: ',
    assistant: '{"only_tariff_min": true}',
  }, 
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Request for low cost chargers and tariff based on minutes\n    User request: I want the charger with the lowest price per minute in the Baixa Lisboeta area\n    Your response: ',
    assistant: '{"only_tariff_min": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Request for tariff based on kwh\n    User request: I want to be charged based on kwh\n    Your response: ',
    assistant: '{"only_tariff_kwh": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Request for tariff based on power usage, i.e., kwh\n    User request: I want to be charged by how much power I use\n    Your response: ',
    assistant: '{"only_tariff_kwh": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Request for tariff based on minutes\n    User request: I want to be charged based how long I park here\n    Your response: ',
    assistant: '{"only_tariff_min": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: No request for covered services in this request\n    User request: I only want so see only public chargers and kwh based tariff\n    Your response: ',
    assistant: '{"only_tariff_kwh": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: No request for covered services in this request\n    User request: What can you do for me?\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: No request for covered services in this request\n    User request: I want to charge on the way from Hamburg to Berlin\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: No request for covered services in this request\n    User request: Please, turn on the radio!\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to charge by the kwh.\n- The next agent found charging stations that allow him to be charged by the kwh.}\n\n    # Example description: No request for covered services in this request\n    User request: Reset all filters.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to see only public charging stations and wanted a tariff to pay by the minute.\n- The next agent found public charging stations and activated the tariff filter for per-minute payment.}\n\n    # Example description: deactivation of a specific filter\n    User request: deactivate the minute based tariff filter.\n    Your response: ',
    assistant: '{ "only_tariff_min": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to pay for each minute of charging.\n- The next agent found charging stations that allow him to be charged by the minute.}\n\n    # Example description: deactivate all filters and instead set other filters\n    User request: no that is wrong, I only want to pay by the kwh.\n    Your response: ',
    assistant: '{ "only_tariff_kwh": true, "only_tariff_min": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested charge points in Porto.\n- The next agent found charge points in Porto.}\n\n    # Example description: deactivate all filters and instead set other filters. only one of these filters can be set!\n    User request: no, I only want to pay by the kwh.\n    Your response: ',
    assistant: '{ "only_tariff_kwh": true, "only_tariff_min": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requsted to be charged by the kwh.\n- The next agent found charging stations that allow him to be charged by the kwh.}\n\n    # Example description: deactivate all filters and instead set other filters (is in scope of this request identifier service)\n    User request: no that is all wrong, I only want to charge for free.\n    Your response: ',
    assistant: '{ "only_tariff_kwh": false, "only_tariff_min": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: deactivate all filters, triggered by "that is all wrong"\n    User request: no that is wrong.\n    Your response: ',
    assistant: '{ "only_tariff_kwh": false, "only_tariff_min": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user wanted to see only charging stations that allow him to be charged by the minute.\n- The next agent found charging stations that allow him to be charged by the minute.}\n\n    # Example description: reset of all filters and setting address\n    User request: No filters in Lisbon.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: tariff filter request in city\n    User request: Where is the station with price per kWh in Braga?\n    Your response: ',
    assistant: '{ "only_tariff_kwh": true, "only_tariff_min": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: these time-based request trigger the power range filter, NOT tariff filters!\n    User request: I want to charge for 20 minutes\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: NO tariff filters set! These time-based request trigger the power range filter, NOT tariff filters!\n    User request: I want to charge my car in less than half an hour!\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: time-based request >30 minutes translates into below power range. But no tariff filters were requested!\n    User request: I want to charge for 2 hours.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: time-based request translates into power range. But no tariff filters were requested\n    User request: I want to charge up over night.\n    Your response: ',
    assistant: 'null',
  },
];
