export const cat2FewShotExamples = [
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: power request. neither "available", "coming soon", or "hide" mentioned. Return \'null\'! No request for covered services in this request\n    User request: 50kW\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Inverted or negated request. neither "available", "coming soon", or "hide" mentioned. Return \'null\'! No request for covered services in this request\n    User request: Not supermarket\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: neither "available", "coming soon", or "hide" mentioned. Return \'null\'!\n    User request:  In Porto, very fast charging\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: "available" mentioned\n    User request: only available ones\n    Your response: ',
    assistant: '{"hide_not_available": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: neither "available", "coming soon", or "hide" mentioned. Return \'null\'!\n    User request: Only fast charging stations\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: User requests "available"/"open" charge points in a city 🔋\n    User request: I\'m looking for available charging points in Glasgow\n    Your response: ',
    assistant: '{"hide_not_available": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: hide not available: show only chargers where no one is at the charging points\n    User request: Points with no one there.\n    Your response: ',
    assistant: '{"hide_not_available": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: hide not available: hide charge points that are not used right now\n    User request: Hide used chargers.\n    Your response: ',
    assistant: '{"hide_not_available": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: charge at available/open charge points, "available" triggers this filter!\n    User request: I want to charge near my location at an available charge point that are also public chargers\n    Your response: ',
    assistant: '{"hide_not_available": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: neither "available", "coming soon", or "hide" mentioned. Return \'null\'!\n    User request: Can I see public chargers?\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Hide charge points that are coming soon\n    User request: Show no charge points that are coming soon.\n    Your response: ',
    assistant: '{"hide_coming_soon": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Show coming soon\n    User request: Show charge points that are coming soon.\n    Your response: ',
    assistant: '{"hide_coming_soon": false}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Hide charge points that are coming soon\n    User request: Hide charge points that are coming soon.\n    Your response: ',
    assistant: '{"hide_coming_soon": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: free charging points\n    User request: I want to charge at stations free of charge\n    Your response: ',
    assistant: '{"only_free": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: free charging points\n    User request: I don\'t want to pay for charging.\n    Your response: ',
    assistant: '{"only_free": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: free charging points\n    User request: Don\'t show me paid stations!\n    Your response: ',
    assistant: '{"only_free": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: multiple requests for filters, among them: free charging points\n    User request: i need to charge near a supermarket on a free charging point\n    Your response: ',
    assistant: '{"only_free": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: currently available charging points and free of charge\n    User request: I want to charge at currently available stations free of charge\n    Your response: ',
    assistant: '{"hide_not_available": true, "only_free": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Simple charging in a city. Nothing to do. Return null.\n    User request: Charging in Lisbon\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: neither "available", "coming soon", or "hide" mentioned. Return \'null\'!\n    User request: What can you do for me?\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: neither "available", "coming soon", or "hide" mentioned. Return \'null\'!\n    User request: I want to charge on the way from Hamburg to Berlin\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: neither "available", "coming soon", or "hide" mentioned. Return \'null\'!\n    User request: Please, turn on the radio!\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to be charged by the kwh.\n- The assistant presented charge points that charge by the kwh.}\n\n    # Example description: neither "available", "coming soon", or "hide" mentioned. Return \'null\'!\n    User request: Reset all filters.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: deactivation of a specific filter\n    User request: deactivate the free charging filter.\n    Your response: ',
    assistant: '{ "only_free": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requsted available charge points in Lisbon.\n- The assistant presented available charge points in Lisbon.}\n\n    # Example description: reset of all filters and setting other filter again\n    User request: no that is wrong, I only want free charging.\n    Your response: ',
    assistant:
      '{ "only_free": true, "hide_not_available": false, "hide_coming_soon": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to charge in Lisbon.\n- The assistant presented charge points in Lisbon.}\n\n    # Example description: reset of all filters and setting other filter again, triggered by "that is all wrong"\n    User request: no that is all wrong.\n    Your response: ',
    assistant:
      '{ "only_free": false, "hide_not_available": false, "hide_coming_soon": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to charge at free charge points.\n- The assistant presented free charge points only.}\n\n    # Example description: reset of all filters and setting address\n    User request: No filters in Lisbon.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: neither "available", "coming soon", or "hide" mentioned in CURRENT request\n    User request: At very fast chargers only in Lisbon.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to charge at free charge points.\n- The assistant presented free charge points only.}\n\n    # Example description: deactivate the only_free filter\n    User request: I want to see paid stations.\n    Your response: ',
    assistant: '{ "only_free": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to charge at free charge points.\n- The assistant presented free charge points only.}\n\n    # Example description: deactivate the only_free filter\n    User request: I want to pay at a station.\n    Your response: ',
    assistant: '{ "only_free": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: interpret "open" chargers as request for available chargers\n    User request: Looking for an open charger in Prague\n    Your response: ',
    assistant: '{ "hide_not_available": true }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: neither "available", "coming soon", or "hide" mentioned. Return \'null\'!\n    User request: Hello find fast charging points in Braga\n    Your response: ',
    assistant: '{ "hide_not_available": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: neither "available", "coming soon", or "hide" mentioned. Return \'null\'!\n    User request: Show only auto-charging charge points.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: neither "available", "coming soon", or "hide" mentioned. Return \'null\'!\n    User request: I want to charge as quickly as possible and near where I am.\n    Your response: ',
    assistant: 'null',
  },
];
