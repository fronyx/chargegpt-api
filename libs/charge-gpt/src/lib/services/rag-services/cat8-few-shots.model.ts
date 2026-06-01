export const cat8FewShotExamples = [
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Connector type mentioned. Set the conncetor type!\n    User request: I want to charge close to Hauptbahnhof in Bielefeld with Type 2.\n    Your response: ',
    assistant: '{"connector_type": "Type 2"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Connector type mentioned. Set the conncetor type!\n    User request: I want to charge at the highway A1 near Osnabrück with CCS.\n    Your response: ',
    assistant: '{"connector_type": "CCS"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Connector type mentioned. Set the conncetor type!\n    User request: Type 2 connector.\n    Your response: ',
    assistant: '{"connector_type": "Type 2"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Connector type mentioned. Set the conncetor type!\n    User request: CCS plug.\n    Your response: ',
    assistant: '{"connector_type": "CCS"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Connector type mentioned. Set the conncetor type!\n    User request: Find me a Chademo charge point.\n    Your response: ',
    assistant: '{"connector_type": "Chademo"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Only address is given. Nothing to do, so you return \'null\'!\n    User request: I want to charge at Dornbeger Str. 45, Bielefeld.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Only a new time is given. Nothing to do, so you return \'null\'!\n    User request: I want to charge at 5 PM.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Current time is referenced. Nothing to do, so you return \'null\'!\n    User request: Now!\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: For a request with a duration, set the connector-type to "all"\n    User request: I want to charge at Amsterdam central for 30 minutes.\n    Your response: ',
    assistant: '{"connector_type": "all"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Fast charging request. Set connector type to "all".\n    User request: I want to charge fast.\n    Your response: ',
    assistant: '{"connector_type": "all"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Charging power value given above 22 kW. Set connector_type to "all".\n    User request: I want to charge fast with 70 kW.\n    Your response: ',
    assistant: '{"connector_type": "all"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Charging power value given below 22 kW. Set connector type to "all".\n    User request: I want to charge slowly at most 22 kW.\n    Your response: ',
    assistant: '{"connector_type": "all"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Charging over night request. Nothing to do. Return "null".\n    User request: I want to charge through the night.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: DC power type request. Nothing to do. Return "null".\n    User request: I want to charge very fast with DC chargers only\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: DC power type request. Nothing to do. Return "null".\n    User request: DC chargers.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: AC power type request. Nothing to do. Return "null".\n    User request: AC chargers.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Operator name is given. Nothing to do, so you return \'null\'!\n    User request: I want to charge at a Fastned station.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user wants to charge tomorrow morning nearby.\n    - The assistant recommended charge points near the user\'s location.\n    }\n\n    # Example description: A restaurant name is given. Nothing to do, so you return \'null\'!\n    User request: Find a McDonalds.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n    \n    # Example description: Random request, no specific information given. Return \'null\'!\n    User request: I want to charge.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n    \n    # Example description: Invalid request. Return \'null\'!\n    User request: Please turn on the radio.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Request with information that you cannot cover in this request identifier. Return \'null\'!\n    User request: I want to charge nearby.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to see only CCS charge points.\n- The assistant could not find any charge points and proposed to search for all connector types instead.}\n\n    # Example description: Request to apply the proposed changes. \n    User request: Would you mind handling that?\n    Your response: ',
    assistant: '{"connector_type": "all"}',
  },

  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to see only charge points using Type-2 plugs.\n- The assistant could not find any charge points and proposed to search for all connector types instead.}\n\n    # Example description: disable the filter for a specific charge points plug type by setting "all". \n    User request: Would you be able to assist?\n    Your response: ',
    assistant: '{"connector_type": "all"}',
  }, 
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: When a combo plug is requested, you identify this as "IEC_62196_T2_COMBO"\n    User request:  I want to charge with a combo plug.\n    Your response: ',
    assistant: '{"connector_type": "IEC_62196_T2_COMBO"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: A more general question about electric vehicle charging. Nothing to do, return null! \n    User request: How can I charge with a Type 2 charger?\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: A more general question about electric vehicle charging. Nothing to do, return null! \n    User request: Can I charge fast with a CCS / CHAdeMO plug?\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Connector type mentioned. Set the conncetor type!\n    User request: I want to charge with a Chademo connector.\n    Your response: ',
    assistant: '{"connector_type": "CHAdeMO"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Connector type mentioned. Set the conncetor type!\n    User request: I want to charge with a CCS connector.\n    Your response: ',
    assistant: '{"connector_type": "CCS"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Connector type mentioned. Set the conncetor type!\n    User request: I want to charge with a Combined Charging System(CCS) DC charger.\n    Your response: ',
    assistant: '{"connector_type": "CCS"}',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Connector type mentioned. Set the conncetor type!\n    User request: I want to charge with a type 2 AC charger.\n    Your response: ',
    assistant: '{"connector_type": "Type 2"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Connector type mentioned. Set the conncetor type!\n    User request: I want to charge with a DC charger. I want to charge with a Chademo connector.\n    Your response: ',
    assistant: '{"connector_type": "CHAdeMO"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Connector type mentioned. Set the conncetor type!\n    User request: I want to charge with a DC charger. I want to charge with a CCS connector.\n    Your response: ',
    assistant: '{"connector_type": "CCS"}',
  },
  
];
