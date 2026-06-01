export const cat5FewShotExamples = [
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: neither "automatic" or "start" or "remote" is mentioned\n    User request: I want an available charge point\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: combination of only_remote_start_capable and others 🔋\n    User request: I want to use a charger with remote start capabilities that is near Giants Causeway. At least 70 kW.\n    Your response: ',
    assistant: '{"only_remote_start_capable": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: combination of auto charge, and others 🔋\n    User request: I want to use a charger with auto start capabilities. At least 70 kW.\n    Your response: ',
    assistant: '{"only_auto_charge": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: combination of auto charge, and others 🔋\n    User request: I want to charge at a supermarket in Espinho with autocharge\n    Your response: ',
    assistant: '{"only_auto_charge": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: automatic start of charging 🔋\n    User request: I want to see only charging stations that support automatic charging.\n    Your response: ',
    assistant: '{"only_auto_charge": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: remote starting of a charge via App 🔋\n    User request: I want to use the App to start charging\n    Your response: ',
    assistant: '{"only_remote_start_capable": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: start charging using a charging card or eKey 🔋\n    User request: I have a charging card, I don\'t want to use the app to start.\n    Your response: ',
    assistant: '{"only_remote_start_capable": false}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: charge using the app 🔋\n    User request: I have lost my eKey or charging card.\n    Your response: ',
    assistant: '{"only_remote_start_capable": true}',
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
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {}\n\n    # Example description: "reset" is request specifically and by name, so return {"reset": true}\n    User request: Reset all filters.\n    Your response: ',
  //   assistant: '{"reset": true}',
  // },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {- The user requested to charge in Lisbon city center.\n- The assistant found charge points in Lisbon city center.}\n\n    # Example description: The user requests a reset by calling "clear all filters"\n    User request: Clear all my filter settings and start over.\n    Your response: ',
  //   assistant: '{"reset": true}',
  // },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {- The user requested to see charge points close to Restaurants and Supermarkets.\n- The assistant found charge points close to Restaurants and Supermarkets.}\n\n    # Example description: "starting over" is a request to reset all filters\n    User request: lets start over.\n    Your response: ',
  //   assistant: '{"reset": true}',
  // },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {- The user requested to see only available charge points.\n- The assistant found available charge points.}\n\n    # Example description: You always interpret "show me all charge points" as a request for "reset".\n    User request: show me all charge points.\n    Your response: ',
  //   assistant: '{"reset": true}',
  // },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to see only public stations that allow auto-start.\n- The assistant found public stations that allow auto-start.}\n\n    # Example description: deactivation of a specific filter\n    User request: deactivate the auto charge filter.\n    Your response: ',
    assistant: '{ "only_auto_charge": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to use a charging card.\n- The assistant found charging stations that support charging cards.}\n\n    # Example description: To pay using the app you both, deactivate the only_auto_charge filter and activate only_remote_start_capable filter.\n    User request: that is wrong, I only want to pay using the app.\n    Your response: ',
    assistant:
      '{ "only_auto_charge": false, "only_remote_start_capable": true }',
  },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {- The user requested to see only charging stations that are available.\n- The assistant found available charging stations.}\n\n    # Example description: You always interpret "no that is all wrong" as a request for a "reset".\n    User request: that is all wrong.\n    Your response: ',
  //   assistant: '{"reset": true}',
  // },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: "self-charging" ALWAYS triggers auto-charging\n    User request: Show only self-charging charging points in Setúbal.\n    Your response: ',
    assistant:
      '{ "only_auto_charge": true, "only_remote_start_capable": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: "self-charging" ALWAYS triggers auto-charging\n    User request:I want a self-charging station for my Tesla Model S in the central region of Coimbra.\n    Your response: ',
    assistant:
      '{ "only_auto_charge": true, "only_remote_start_capable": false  }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: nothing to do for you. Return \'null\'!\n    User request: Only fast charging stations\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: nothing to do for you. Return \'null\'!\n    User request: I want to charge in Espinho at a quick charge point near a supermarket\n    Your response: ',
    assistant: 'null',
  },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {- The user requested to see only charging stations that are available.\n- The assistant found available charging stations.}\n\n    # Example description: reset everything by requesting "restart"\n    User request: Restart\n    Your response: ',
  //   assistant: '{"reset": true}',
  // },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {- The user requested to see only charging stations near by.\n- The assistant found nearby charging stations.}\n\n    # Example description: reset everything by calling "restart"\n    User request:  Restart the conversation\n    Your response: ',
  //   assistant: '{"reset": true}',
  // },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {- The user requested to see only charging stations that are free.\n- The assistant found only_free charging stations.}\n\n    # Example description: reset everything by requesting "Reset"\n    User request:  Reset\n    Your response: ',
  //   assistant: '{"reset": true}',
  // },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {- The user requested to charge in Bielefeld\n- The assistant found available charging stations.}\n    \n    # Example description: request "start over" to reset everything\n    User request: I want to start over again\n    Your response: ',
  //   assistant: '{"reset": true}',
  // },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {- The user requested to charge in Bielefeld\n- The assistant found available charging stations.}\n    \n    # Example description: request "start again" to reset everything\n    User request: I want to start again\n    Your response: ',
  //   assistant: '{"reset": true}',
  // },
  {
    projectIds: [],
    user: 'Conversation history: {}\n    \n    # Example description: request for physical card charging in Lisbon with ultra-fast chargers\n    User request: Ultra-fast chargers in Lisbon using a physical card\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n    \n    # Example description: nearby request with only free stations. Return \'null\' as reset is not requested specifically or by name.\n    User request: show me only stations that are free near me.\n    Your response: ',
    assistant: 'null',
  },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {}\n    \n    # Example description: "clear" is a request for reset, specifically and by name\n    User request: reset my filters\n    Your response: ',
  //   assistant: '{"reset": true}',
  // },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {- The user requested to see only fast charging stations close to restaurants and supermarkets.\n- The assistant found fast charging stations close to restaurants and supermarkets.}\n\n    # Example description: reset of all filters and setting other filter again\n    User request: that is wrong, I only want to charge at Restaurants.\n    Your response: ',
  //   assistant:
  //     '{ "reset": true }',
  // },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Island and power mentioned. Nothing to do for you, set null!\n    User request: I want to charge on island in a charger with over 300kw.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to charge in Porto with at least 150 kW.\n - The assistant provided information on what was found near Porto.}\n\n    # Example description: Multiple requests for different filter settings. "reset" is not mentioned. Nothing to do for you, set null!\n    User request: I want to see charging stations at supermarkets that are compatible with my vehicle.\n    Your response: ',
    assistant: 'null',
  },
  
  
];
