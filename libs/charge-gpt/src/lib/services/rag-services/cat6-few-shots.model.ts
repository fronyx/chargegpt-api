export const cat6FewShotExamples = [
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Inverted or negated request. So set all types of location, except the mentioned one.\n    User request: Not at a supermarket.\n    Your response: ',
    assistant:
      '{"type_of_locations": ["Restaurant", "Hotel", "Shopping center", "Service station", "Motorway service station", "Paid parking", "Free car park", "Dealer", "Taxi", "Company", "Store", "Workshop", "Camping", "Airport"], "type_of_locations_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Request for free charging stations cannot be handled.\n    User request: I want free charging stations.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Request for free charging stations cannot be handled.\n    User request: I want to charge free of cost.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: POI mentioned, but no type of loction is mentioned\n    User request: Rewe\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: auto-charging stations and near me mentioned. No location or plug type is mentioned\n    User request: I want auto-charging stations near me.\n\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: No location or plug type is mentioned\n    User request: I want to see only charging stations that support automatic charging and remote start of charge points.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: No location or plug type is mentioned\n    User request: I want self-charging stations.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: "Free charging" requested. NO request for "free parking"\n    User request: I want to charge for free\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: a city or address or poi is mentioned, but neither a location or plug type is mentioned\n    User request: I want to charge in Porto\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: neither a location or plug type is mentioned\n    User request: I want an available charge point\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: 🔍 ⛔️ Never try to assume a type_of_location that wasn\'t specifically mentioned! There is no default location type!\n    User request: I need a charging station near the Tower Bridge in London that I can use.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: combination of request including request to charge at a highway service station. translate highway service station to possibleValue: Motorway service station 🔋\n    User request: I want to find fast charging stations at a highway service station on the A1 to Porto\n    Your response: ',
    assistant:
      '{"type_of_locations": ["Motorway service station"], "type_of_locations_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: combination of irrelevant requests including mentioning a highway. return null.\n    User request: I want to find fast charging stations at highway A1 to Porto\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Request does not trigger a specific location type\n    User request: at home\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: charging on a highway. translate "highway" into "Motorway service station" 🔋\n    User request: I want to charge at a free charging point on a highway\n    Your response: ',
    assistant:
      '{"type_of_locations": ["Motorway service station"], "type_of_locations_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Refinement of type_of_location to contain \'restaurants\' 🔌\n    User request: I want to charge at a restaurant\n    Your response: ',
    assistant:
      '{"type_of_locations": ["Restaurant"], "type_of_locations_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: POI restaurant search request 🍕\n    User request: Pizza-Restaurant, Oldenburg\n    Your response: ',
    assistant:
      '{"type_of_locations": ["Restaurant"], "type_of_locations_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: POI restaurant or food franchise in search request 🍕\n    User request: Burger King, Lisbon\n    Your response: ',
    assistant:
      '{"type_of_locations": ["Restaurant"], "type_of_locations_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: type_of_locations translate gas station to service station\n    User request: I want to charge at a gas station\n    Your response: ',
    assistant:
      '{"type_of_locations": ["Service station"], "type_of_locations_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: type_of_locations example\n    User request: I want to charge at a supermarket\n    Your response: ',
    assistant:
      '{"type_of_locations": ["Supermarket"], "type_of_locations_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Any POI that is of type of location in the list of possibleValues should be set in type_of_locations 🔋\n    User request: I want to charge at a shopping center in Norwich\n    Your response: ',
    assistant:
      '{"type_of_locations": ["Shopping center"], "type_of_locations_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: exact power value, different words for it: "with"/"at"/"exactly" => no type_of_location or plug type mentioned\n    User request: I want to use a charger with 30 kW in Lisbon.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Multiple types of locations are mentioned that are in the list of possibleValues are put together.\n    User request: I want to charge at a supermarket which is also close to a camping site.\n    Your response: ',
    assistant:
      '{"type_of_locations": ["Supermarket", "Camping"], "type_of_locations_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: the work location is mentioned but that is not a type_of_location.\n    User request: I want to charge near my location at an available charge point that are also public chargers\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: "public chargers" are requested, these are NOT in type_of_location.\n    User request: Are there any public chargers in the north of Bonn?\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: no explicit request for type_of_location.\n    User request: In Munich, only at rapid chargers\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: 🔌 ⛔️ If the user request contains a specific plug type, you cannot help him. Set null!\n    User request: I want to charge at stations with CCS plug type.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: 🔌 ⛔️ If the user request contains a specific plug type, you cannot help him. Set null!\n    User request: charge stations with Type-2.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: 🔌 ⛔️ If the user request contains a specific plug type, you cannot help him. Set null!\n    User request: charge stations with Chademo.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: 🔌 If the user request contains the words "compatible", enable the plug_types_enabled filter.\n    User request: Can I find charging stations equipped only with types of plugs compatible with my car?\n    Your response: ',
    assistant: '{"plug_types_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: enable the plug_types_enabled filter.\n    User request: I want to find charging stations that have a compatible connector or plug type for my car.\n    Your response: ',
    assistant: '{"plug_types_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: enable the plug_types_enabled filter.\n    User request: Show me compatible charging stations.\n    Your response: ',
    assistant: '{"plug_types_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: enable the plug_types_enabled filter, because no specific connector is mentioned.\n    User request: Enable plug types.\n    Your response: ',
    assistant: '{"plug_types_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to charge in Lisbon.\n- The next agent found charge points in Lisbon.}\n\n    # Example description: enable the plug_types_enabled filter, because the user requested charge points that "suit" the user\'s car.\n    User request: Interesting, and which ones suit my car?\n    Your response: ',
    assistant: '{"plug_types_enabled": true}',
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
    user: 'Conversation history: {- The user requested charging stations compatible with her car.\n- The next agent activated the plug type compatibility filter.}\n\n    # Example description: No request for covered services in this request\n    User request: Reset all filters.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested charging stations compatible with her car.\n- The next agent activated the plug type compatibility filter.}\n\n    # Example description: deactivation of a specific filter\n    User request: deactivate the filter for plug types.\n    Your response: ',
    assistant: '{ "plug_types_enabled": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested charging stations compatible with her car.\n- The next agent activated the plug type compatibility filter.}\n\n    # Example description: deactivation of a specific filter\n    User request: don\'t show me charge points that don\'t suit my car.\n    Your response: ',
    assistant: '{ "plug_types_enabled": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to see only fast charging stations close to restaurants and supermarkets.\n- The next agent found fast charging stations close to restaurants and supermarkets.}\n\n    # Example description: reset of all filters and setting other filter again\n    User request: no that is wrong, I only want to charge at Restaurants.\n    Your response: ',
    assistant:
      '{ "type_of_locations": ["Restaurant"], "type_of_locations_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user wanted to charge at compatible charge points.\n- The next agent found compatible charge points.}\n\n    # Example description: reset of all filters and setting other filter again, triggered by "that is all wrong"\n    User request: no that is all wrong.\n    Your response: ',
    assistant:
      '{ "plug_types_enabled": false, "type_of_locations_enabled": false }',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested to see only public charging stations close to supermarkets, restaurants and the highway service stations.\n- The next agent found public charging stations close to restaurants, supermarkets and motorway service stations.}\n\n    # Example description: we have a number of location filters set and want to remove one specific location from the array. current filters contain: {"type_of_locations": ["Supermarket", "Motorway service station", "Restaurant"], "type_of_locations_enabled": true}. You remove only the supermarket location from the array and leave the rest as it is.\n    User request: remove supermarket filter.\n    Your response: ',
    assistant:
      '{"type_of_locations": ["Motorway service station", "Restaurant"], "type_of_locations_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user requested charge points close to airports and a pizza restaurant.\n- The next agent found charge points close to airports and a pizza restaurant.}\n\n    # Example description: we have filters set and want to remove one specific location from the array. current filters contain: {"type_of_locations": ["Restaurant", "Airport"], "type_of_locations_enabled": true}\n    User request: remove the Restaurant location.\n    Your response: ',
    assistant:
      '{"type_of_locations": ["Airport"], "type_of_locations_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {- The user wanted to charge at a supermarket in Lisbon.\n- The next agent found a charge point at a supermarket in Lisbon.}\n\n    # Example description: reset of all filters and setting address\n    User request: No filters in Lisbon.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: Island and power mentioned. No fitting location type in possibleValues. Nothing to do for you, set null!\n    User request: I want to charge on island in a charger with over 300kw.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: No request for covered services in this request\n    User request: I want to charge my tesla model 3 in Viseu.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: No request for covered services in this request\n    User request: I want to charge in Porto up to 50kw.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: No request for covered services in this request\n    User request: I want to charge at a slow charger in Lisbon.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: No specific request for location type in this request.\n    User request: I want to charge at a fast charger close to the Aisingerwies in Rosenheim\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: No specific request for location type in this request.\n    User request: I desperately need a charge anywhere near the Porsche Museum in Stuttgart\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: No specific request for location type in this request.\n    User request: Hello find fast charging points in Braga\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: \'Arena\' is not a location type. Return \'null\'.\n    User request: Show only available charge points for Altice Arena.\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: "In Lisboa near a supermarket" triggers type_of_locations filter\n    User request: In Lisboa near a supermarket\n    Your response: ',
    assistant:
      '{"type_of_locations": ["Supermarket"], "type_of_locations_enabled": true}',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: "At a museum" cannot trigger this filter. That type_of_locations is not available\n    User request: At a museum\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {The user requested an Ionity charge point in Munich}\n\n    # Example description: Charging speed and charge point operator mentioned. No fitting location type in possibleValues and no plug type compatibility mentioned. Nothing to do for you, set null!\n\n    Answer in language: English\n    User request: I want to charge a 250kw charge point from Ionity\n    Your response: ',
    assistant: 'null',
  },
  {
    projectIds: [],
    user: 'Conversation history: {}}\n\n   # Example description: Charging close to a Thai restaurant. Filter for Restaurant locations!\n    User request: Show me only fast chargers near Thai restaurants\n    Your response: ',
    assistant: '{"type_of_locations": ["Restaurant"], "type_of_locations_enabled": true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: The user wants to charge at a supermarket or highway. Both are present in possibleValue of type_of_locations: ["supermarket", "motorway service station"]. 
      User request: I want to charge near a supermarket or highway
      Your response: `,
    assistant:
      '{"type_of_locations": ["supermarket", "motorway service station"], "type_of_locations_enabled": true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at a restaurant with low cost charging nearby.}
  
      # Example description: low cost charging at a restaurant near the user's location. you can only provide a filter for the restaurant. return that!
      User request: at a restaurant with low-cost charging nearby
      Your response: `,
    assistant:
      '{"type_of_locations": ["restaurant"], "type_of_locations_enabled": true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested charging stationts at supermarkets that are compatible with her vehicle.}
  
      # Example description: Charging stations at supermarkets that are compatible with the user's vehicle. Filter for supermarket locations! Filter for compatible plug types is needed!
      User request: I want to see charging stations at supermarkets that are compatible with my vehicle
      Your response: `,
    assistant:
      '{"type_of_locations": ["supermarket"], "type_of_locations_enabled": true, "plug_types_enabled": true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at ultra-fast stations in Lisbon.\n- The assistant acknowledged the request and confirmed readiness for the user in Lisbon.}
  
      # Example description: Charging stations at supermarkets only. Filter for supermarket locations!
      User request: At a supermarket only
      Your response: `,
    assistant:
      '{"type_of_locations": ["supermarket"], "type_of_locations_enabled": true}',
  },
];
