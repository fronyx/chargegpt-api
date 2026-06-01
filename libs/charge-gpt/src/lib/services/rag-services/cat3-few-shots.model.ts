export const cat3FewShotExamples = [
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: "public chargers" are mentioned\n    User request: Only show public chargers.\n    Your response: ',
    assistant: '{"only_public": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: neither "public" or "4 or 5 stars" or "customer rating" is mentioned\n    User request: Can you show me charging stations that are free of charge?\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: neither "public" or "4 or 5 stars" or "customer rating" is mentioned\n    User request: I need a charging station near the Tower Bridge in London that I can use.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: neither "public" or "4 or 5 stars" or "customer rating" is mentioned\n    User request: I want to find fast charging stations at a highway service station on the A1 to Porto\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Only high customer ratings and only public\n    User request: Only high customer ratings and only public.\n    Your response: ',
    assistant: '{"only_4_or_5_stars": true, "only_public": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: The "best place to charge" is requested.\n    User request: Traveling to the west of Wuppertal. What is the best place to charge?\n    Your response: ',
    assistant: '{"only_4_or_5_stars": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to charge at McDonalds restaurant in London.\n- The next agent found a charge point at McDonalds in London.\n- The user requested to see only slow chargers.\n- The next agent found a slow charger at McDonalds in London.}\n\n    # Example description: Only good customer ratings\n    User request: only with great customer rating\n    Your response: ',
    assistant: '{"only_4_or_5_stars": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Only charge at very well rated charge points\n    User request: Only show highly rated charge points. Like 4 or 5 stars.\n    Your response: ',
    assistant: '{"only_4_or_5_stars": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: "public" is mentioned\n    User request: I want to charge near my location at an available charge point that are also public chargers\n    Your response: ',
    assistant: '{"only_public": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: neither "public" or "4 or 5 stars" or "customer rating" is mentioned\n    User request: I want an available charge point\n    Your response: ',
    assistant: 'null',
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
    user: 'Conversation history: {- The user requested to see only available charge points.\n- The next agent found available charge points.}\n\n    # Example description: No request for covered services in this request\n    User request: Reset all filters.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to see only public charging stations.\n- The next agent found public charging stations.}\n\n    # Example description: deactivation of a specific filter\n    User request: deactivate the public charging filter.\n    Your response: ',
    assistant: '{ "only_public": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested fast available charging.\n- The next agent found fast and available charging stations.}\n\n    # Example description: deactivate all filters and set mentioned filter again\n    User request: no that is wrong, I only want public charging.\n    Your response: ',
    assistant: '{ "only_public": true, "only_4_or_5_stars": false}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to see only public charging stations.\n- The next agent found public charging stations.}\n\n    # Example description: deactivate all filters and set mentioned filter again (if part of the service), triggered by "that is all wrong"\n    User request: no that is all wrong.\n    Your response: ',
    assistant: '{ "only_public": false, "only_4_or_5_stars": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to see only public charging stations.\n- The next agent found public charging stations.}\n\n    # Example description: reset of all filters and setting address\n    User request: No filters in Lisbon.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: 4-star rating filter mentioned\n    User request: Which stations near the 25 de Abril Bridge have at least 4 stars?\n    Your response: ',
    assistant: '{ "only_public": false, "only_4_or_5_stars": true }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: mixture of filter requests, one is "high rated" chargers\n    User request: Chargers with high rating and remote start.\n    Your response: ',
    assistant: '{"only_4_or_5_stars": true}',
  },
];
