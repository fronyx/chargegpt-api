export const cat7FewShotExamples = [
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Only address is given. Nothing to do, so you return \'null\'!\n    User request: I want to charge at Dornbeger Str. 45, Bielefeld.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Only a new time is given. Update current date_time to reflect the new time today. By default we expect day time.\n    User request: I want to charge at 3.\n    Your response: ',
    assistant: '{"date_time": "{{dateToday}} 15:00:00"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Only a new time is given. Update current date_time to reflect the new time today. By default we expect day time.\n    User request: I want to charge at 5 PM.\n    Your response: ',
    assistant: '{"date_time": "{{dateToday}} 17:00:00"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Current time is referenced. Update current date_time to reflect the new time today. By default we expect day time.\n    User request: Now!\n    Your response: ',
    assistant: '{"date_time": "{{dateTimeToday}}"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: For a future request such as "Charge next Monday." 👉 Set date_time to the following Monday. Today is {{dayOfWeek}}, the {{dateToday}}. Calculate and return date_time for next Monday, noon.\n    User request: Charge next Monday.\n    Your response: ',
    assistant: '{"date_time": "{{dateTimeNoonNextMonday}}"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: For past requests like "Yesterday, nearby" 👉 Return \'null\' because that request is invalid.\n    User request: Yesterday, nearby\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge for 30 minutes at Brandenburger Tor and mentioned they will be there in 30 minutes.\n- The assistant provided different location options to choose from: 1.) Brandenburger Tor, Pariser Platz, Berlin, Germany, 2.) Brandenburger Tor, Berlin, Germany, or 3.) Apartments at Brandenburg Gate, Behrenstraße, Berlin, Germany.}
  
      # Example description: No need to update date_time, as it is not mentioned in the new user request. Return 'null'!
      User request: 1
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Fast charging request. Return \'null\'\n    User request: I want to charge fast.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Fast charging request in the city. Return \'null\'\n    User request: Fast chargers in Berlin.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Slow charging request. Return \'null\'\n    User request: I want to charge while going shopping.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Slow charging request in the city. Return \'null\'\n    User request: Slow charge in Porto.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Request charger while having time to spent. Return \'null\'\n    User request: I have some time to charge.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Overnight charging will not set date_time! Return \'null\'\n    User request: I want to charge through the night.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Over night charging does not set date_time to anything! Return \'null\'\n    User request: I want to charge overnight. I am looking for a charging station near my current location.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Operator name is given. \n    User request: I want to charge at a Fastned station.\n    Your response: ',
    assistant: '{"operator_name": "Fastned"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Operator name is given. \n    User request: Find a McDonalds with EWE chargers.\n    Your response: ',
    assistant: '{"operator_name": "EWE"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user wants to charge tomorrow morning nearby.\n    - The assistant recommended charge points near the user\'s location.\n    }\n\n    # Example description: A restaurant name is given. McDonalds is no charge point operator.\n    User request: Find a McDonalds.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Operator name is given. \n    User request: IONITY\n    Your response: ',
    assistant: '{"operator_name": "IONITY"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Operator name is given. \n    User request: I want to use a Mainova charging station.\n    Your response: ',
    assistant: '{"operator_name": "Mainova"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Operator name is given. \n    User request: I want to use an EWE Go charging station.\n    Your response: ',
    assistant: '{"operator_name": "EWE Go"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Operator name is given. \n    User request: Virta chargers, please.\n    Your response: ',
    assistant: '{"operator_name": "Virta"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Operator name is given. \n    User request: Virta chargers, please.\n    Your response: ',
    assistant: '{"operator_name": "Virta"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Local operator name is given. \n    User request: Stadtwerke Münster chargers only\n    Your response: ',
    assistant: '{"operator_name": "Stadtwerke Münster"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Date and time, power type and operator name are given.\n    User request: I want to charge at 3 PM at a Fastned station.\n    Your response: ',
    assistant:
      '{"date_time": "{{dateToday}} 15:00:00", "operator_name": "Fastned"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Date and time, power type (inferred).\n    User request: Very fast McDonalds chargers nearby, around 5 PM.\n    Your response: ',
    assistant:
      '{"date_time": "{{dateToday}} 17:00:00"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user wants to charge at a Fastned station.\n    - The user wants to charge at 3 PM.\n    - The assistant has set the operator name to Fastned.}\n\n    # Example description: Power type and operator name are given.\n    User request: Instead, I want to charge at an Ionity station.\n    Your response: ',
    assistant: '{"operator_name": "IONITY"}',
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
    user: 'Conversation history: {}\n\n # Example description: The user requested charge points with CCS connectors near their location. Nothing to do here. Return \'null\'!\n  User request: CCS plug charging points near me\n  Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Date and time.\n    User request: Next Monday at 9AM at McDonalds in Lage.\n    Your response: ',
    assistant:
      '{"date_time": "{{dateNextMonday}} 9:00:00"}',
  },
  // {
  //   projectIds: [],
  //     user: 'Conversation history: {}\n\n    # Example description: DC power type is specifically requested.\n  User request: In Berlin with DC chargers.\n  Your response: ',
  //   assistant: '{"power_type": "DC"}',
  // },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {}\n\n    # Example description: AC power type is specifically requested.\n  User request: AC charger points nearby.\n  Your response: ',
  //   assistant: '{"power_type": "AC"}',
  // },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {}\n\n    # Example description: Request for HPC charging does not mention AC or DC. 👉 Set power_type to null.\n  User request: HPC charging at McDonald\'s.\n  Your response: ',
  //   assistant: 'null',
  // },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {}\n\n    # Example description: Request for fast charging does not mention AC or DC. 👉 Set power_type to null.\n  User request: I want to fast charge near the center of Aveiro.\n  Your response: ',
  //   assistant: 'null',
  // },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {}\n\n    # Example description: Request for slow charging does not mention AC or DC. 👉 Set power_type to null.\n  User request: I need slow charging in hamburg near the Reeperbahn.\n  Your response: ',
  //   assistant: 'null',
  // },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {}\n\n    # Example description: AC power type is specifically requested.\n  User request: I need ac charging in stuttgart nearby main station\n  Your response: ',
  //   assistant: '{"power_type": "AC"}',
  // }, 
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {}\n\n    # Example description: DC power type is specifically requested.\n  User request: I want fast charging at DC stations only!\n  Your response: ',
  //   assistant: '{"power_type": "DC"}',
  // },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {}\n\n    # Example description: Request for quick charging does not mention AC or DC. 👉 Set power_type to null.\n  User request: Hello Find Quick charge points in Braga\n  Your response: ',
  //   assistant: 'null',
  // }, 
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {}\n\n    # Example description: Request does not mention AC or DC. 👉 Set power_type to null.\n  User request: I want a super fast or HPC charger nearby\n  Your response: ',
  //   assistant: 'null',
  // },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {}\n\n    # Example description: Charging power value requested does not mention AC or DC. 👉 Set power_type to null.\n    User request: I want to charge fast with at least 70kW.\n    Your response: ',
  //   assistant: 'null',
  // },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to see only DC chargers.}\n\n    # Example description: Previously set power_type filter is reset to null.\n    User request: I want to see all chargers again.\n    Your response: ',
    assistant: 'null',
  },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {}\n\n    # Example description: Request does not mention AC or DC. 👉 Set power_type to null.\n    User request: Fast chargers.\n    Your response: ',
  //   assistant: 'null',
  // },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {}\n\n    # Example description: CCS connector requests (without power-type being mentioned) does not result in power_type being set.\n    User request: Are there any fast CCS chargers in the northern outskirts of Poitiers?\n    Your response: ',
  //   assistant: 'null',
  // },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: CCS connector request does not result in power_type being set.\n    User request: CCS stations only.\n    Your response: ',
    assistant: 'null',
  },
  // {
  //   projectIds: [],
  //   user: 'Conversation history: {}\n\n    # Example description: mentioning "fast" does not result in power_type being set.\n    User request: fast stations only.\n    Your response: ',
  //   assistant: 'null',
  // },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: arrival time mentioned, set date_time.\n    User request: Ultra fast in Ilhavo. I\'m there in 60 minutes.\n    Your response: ',
    assistant: '{"date_time": "{{dateTimeInOneHour}}"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: current time mentioned in some way results in date_time being set to current date_time.\n    User request: Charging in Porto right now.\n    Your response: ',
    assistant: '{"date_time": "{{currentDateTime}}"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: multiple sentence request with one asking for date_time being set to +60 minutes. \n    User request: I want to charge in Beja. I will arrive there in 60 minutes. I want to charge with Type 2 connectors.\n    Your response: ',
    assistant: '{"date_time": "{{dateTimeInOneHour}}"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: multiple sentence request with one asking for date_time being set to tomorrow afternoon minutes. \n    User request: I want to charge close to "Restaurante Quinta da Boavista" in Porto. I will arrive there tomorrow afternoon.\n    Your response: ',
    assistant: '{"date_time": "{{dateTimeTomorrowAfternoon}}"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to see only AC charge points.\n- The assistant presented charge points.}\n\n    # Example description: disable the filter for a specific power_type by setting "all". \n    User request: I want to see all charge points.\n    Your response: ',
    assistant: '{"power_type": "all"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested an EWE charger around their current location and provided their coordinates.\n- The user also provided the address for the given coordinates.\n- The assistant couldn't find any charging stations for EWE or IONITY around the provided address and suggested trying to search for all charge point operators.}

      
# Example description: Request to help with the suggested search for all charge point operators. Apply the proposed change.

      Answer in language: English
      User request: do that
      Your response: `,
    assistant:
      '{"operator_name": "all"}',
  },


  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to see only charge points by the EWE charge point operator.\n- The assistant presented charge points.}\n\n    # Example description: disable the filter for a specific charge points operator_name by setting "all". \n    User request: I want to see all charge points.\n    Your response: ',
    assistant: '{"operator_name": "all"}',
  },

  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to see only charge points by the EWE charge point operator.\n- The assistant could not find any charge points and proposed to search for all operators instead.}\n\n    # Example description: Request to apply the proposed changes. \n    User request: Do that!\n    Your response: ',
    assistant: '{"operator_name": "all"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to see only DC charge points.\n- The assistant could not find any charge points and proposed to search for all power types instead.}\n\n    # Example description: Request to apply the proposed changes. \n    User request: Do that!\n    Your response: ',
    assistant: '{"power_type": "all"}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to see only DC charge points.\n- The assistant could not find any charge points and proposed to search for all power types instead.}\n\n    # Example description: Request to apply the proposed changes. \n    User request: Would you mind handling that?\n    Your response: ',
    assistant: '{"power_type": "all"}',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: request for location and a time for arrival. \n    User request: I want to charge at the Kafka Museum, Prague. I will arrive there in 30 minutes.\n    Your response: ',
    assistant: '{"date_time": "{{dateTimeIn30Minutes}}"}',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: A more general question about electric vehicle charging. Nothing to do, return null! \n    User request: What is the difference between AC and DC charging?\n    Your response: ',
    assistant: 'null',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: A more general question about electric vehicle charging. Nothing to do, return null! \n    User request: Can I charge my electric car overnight?\n    Your response: ',
    assistant: 'null',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: A more general question about electric vehicle charging. Nothing to do, return null! \n    User request: What does kW mean in charging?\n    Your response: ',
    assistant: 'null',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: A more general question about electric vehicle charging. Nothing to do, return null! \n    User request: What is AC charging?\n    Your response: ',
    assistant: 'null',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: A more general question about electric vehicle charging. Nothing to do, return null! \n    User request: What is DC charging?\n    Your response: ',
    assistant: 'null',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Request for power-type reset \n    User request: Charging speed isn\'t a concern for me.\n    Your response: ',
    assistant: '{"power_type":"all"}',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: charge point operator request \n    User request: The charging station should be a ChargePoint station.\n    Your response: ',
    assistant: '{"operator_name":"ChargePoint Austria GmbH"}',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: charge point operator request \n    User request: The charging station should be a Stadtwerke Düsseldorf charger.\n    Your response: ',
    assistant: '{"operator_name":"stadtwerke düsseldorf ag"}',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: charge point operator request \n    User request: I want to charge with a Swisscharge charger.\n    Your response: ',
    assistant: '{"operator_name":"Swisscharge"}',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: charge point operator request \n    User request: I want to charge at an E.On charging station.\n    Your response: ',
    assistant: '{"operator_name":"E.On"}',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: charge point operator request \n    User request: I want to charge at a Compleo Charging Solutions charging station.\n    Your response: ',
    assistant: '{"operator_name":"Compleo Charging Solutions"}',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: charge point operator request \n    User request: The charging station should be an Electra charger.\n    Your response: ',
    assistant: '{"operator_name":"electra sas"}',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: charge point operator request \n    User request: I want to charge with a Shell charger.\n    Your response: ',
    assistant: '{"operator_name":"shell recharge"}',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: charge point operator request \n    User request: I want to charge with an ÜZ Mainfranken charger.\n    Your response: ',
    assistant: '{"operator_name":"ÜZ Mainfranken"}',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: charge point operator request \n    User request: I want to charge with an Eleport charger.\n    Your response: ',
    assistant: '{"operator_name":"Eleport"}',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: charge point operator request \n    User request: The charging station should be an IBIL charger.\n    Your response: ',
    assistant: '{"operator_name":"ibil gestor de carga de ve s.a."}',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: charge point operator request \n    User request: I want to charge with a BP Pulse fast charger.\n    Your response: ',
    assistant: '{"operator_name":"BP Pulse"}',
  },

  
  
  
  
  
];
