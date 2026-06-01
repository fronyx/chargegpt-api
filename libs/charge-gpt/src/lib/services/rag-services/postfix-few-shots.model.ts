export const postfixFewShotExamples = [
  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_addresses: Dortmund}
  Conversation summary: {The user requested for a charge point in Dortmund.}

  # Example description: simple search for chargers in "Dortmund" which was matched to unconfirmed_address. all valid. return 'null'

  Answer in language: German
  User request: I want to charge in Dortmund
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_addresses: Lisbon}
  Conversation summary: {The user requested a charge point in Lisbon that is also cheap.}

  # Example description: request mentioned cheapest price, which was not matched. Only Lisbon was matched. Explain the limitation.

  Answer in language: European Portuguese
  User request: I need the cheapest charge point in Lisbon
  Your response: `,
    assistant: '{"postfix": "Infelizmente, neste momento não consigo filtrar por preço."}'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {min_power: 22, max_power: 22, power_enabled: true, is_nearby_requested: true}
  Conversation summary: {The user requested a charge point near the location of the user that allows exactly 22kW charging and that is low cost.}

  # Example description: charging speed was matched and searching for nearby was matched. "low cost of operation" is just a different way of requesting "low prices" and this could not be matched. Explain the limitation.

  Answer in language: English UK
  User request: On a 22kW charge point with low cost of operation near me
  Your response: `,
    assistant: '{"postfix": "Unfortunately, I can\'t filter for prices at the moment."}'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {only_tariff_min: true}
  Conversation summary: {The user requested to charge at a charge point that has the lowest price for its minute-based tariff.}

  # Example description: charging at "minute-based tariff" charge points was matched. searching for nearby was matched. searching for "lowest price" could not be matched. Explain the limitation.

  Answer in language: English UK
  User request: I want the charger with the lowest price per minute in the Baixa Lisboeta area.
  Your response: `,
    assistant: '{"postfix": "Unfortunately, I can\'t filter for low prices at the moment."}'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_addresses: Lisbon}
  Conversation summary: {The user requested a charge point in Lisbon that also has an amazing view.}

  # Example description: Lisbon was matched. Searching for an amazing view could not be matched. Explain the limitation.

  Answer in language: European Portuguese
  User request: Find me a charge point in Lisbon with an amazing view of the sea.
  Your response: `,
    assistant: '{"postfix": "Infelizmente, neste momento, não consigo filtrar por locais com bonita vista."}'
  },

  {
    projectIds: ['filters'],
    user: `Successfully matched request parts: {unconfirmed_address: "Lisbon, museum"}
  Conversation summary: {The user requested a charge point at a museum in Lisbon.}

  # Example description: location "Lisbon" and "museum" could be matched to possible unconfirmed_addresses. all valid. return 'null'

  Answer in language: European Portuguese
  User request: Take me to a lisbon museum.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_address: "Lisbon, center", min_power: 30, max_power: 70, power_enabled: true}
  Conversation summary: {The user requested a fast charging station in central Lisbon.}

  # Example description: "Fast charging station" was matched to charging power and the "central" location in "Lisbon" was also matched to unconfirmed_address. all is valid. return 'null'

  Answer in language: French
  User request: I'm looking for a fast charging station near the center of Lisbon.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_address: "Aveiro"}
  Conversation summary: {The user requested to charge near Aveiro.}

  # Example description: "near Aveiro" was matched to to unconfirmed_address. all is valid. return 'null'

  Answer in language: French
  User request: I want to charge near Aveiro.
  Your response: `,
    assistant: 'null'
  },


  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_address: "Porto, center", only_tariff_min: true}
  Conversation summary: {The user requested a pay-per-minute charging in central Porto.}

  # Example description: "per-minute payment" was matched to only_tariff_min and the "central" location in "Porto" was also matched to unconfirmed_address. all is valid. return 'null'

  Answer in language: French
  User request: I want to charge with per-minute payment in the center of Porto.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {min_power: 30, max_power: 70, power_enabled: true}
  Conversation summary: {The user requested a fast charge point.}

  # Example description: "Fast charging" was matched to charging power. all is valid. return 'null'

  Answer in language: French
  User request: I want to charge fast.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {min_power: 70, max_power: 500, power_enabled: true, only_tariff_kwh: true}
  Conversation summary: {The user requested an ultra-fast charge point that charges by the kwh.}

  # Example description: "ultra-fast charging" was matched onto power settings. kwh-based charging was matched to only_tariff_kwh. all is valid. return 'null'

  Answer in language: German
  User request: I want to charge ultra fast at a charger that charges by the kwh.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {is_nearby_requested: true}
  Conversation summary: {The user requested a charge point near the user's location.}

  # Example description: request for "nearby" charging was matched. all is valid. return 'null'

  Answer in language: English
  User request: I want to charge nearby
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {min_power: 100, max_power: 500, power_enabled: true}
  Conversation summary: {The user requested charge points that are faster than 100kW.}

  # Example description: Request for charging speeds above 100kw was matched. all is valid. return 'null'

  Answer in language: English
  User request: Filter for charge points faster than 100kW.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_addresses: McDonalds, is_nearby_requested: true}
  Conversation summary: {The user requested a charge point at a McDonalds near the user's location, but only from charge point operator EWE.}

  # Example description: McDonalds was matched and nearby was matched. "EWE" is a charge points operator. Charge point operators cannot be filtered, thus "EWE" was not matched. Explain the limitation.

  Answer in language: German
  User request: I want to charge at a McDonalds nearby at a EWE charge point
  Your response: `,
    assistant: '{"postfix": "Leider kann ich derzeit nach Ladestationsbetreibern filtern."}'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_addresses: Lisbon}
  Conversation summary: {The user requested a charge point on the trip between Lisbon and Porto.}

  # Example description: Lisbon was matched. Request for a charge point between Lisbon and Porto was not matched because we cannot plan trips between two locations. Explain the limitation.

  Answer in language: English UK
  User request: I want to charge on the trip between Lisbon and Porto
  Your response: `,
    assistant: '{"postfix": "Unfortunately, I can\'t plan trips between locations at the moment."}'
  },

  {
    projectIds: ['filters'],
    user: `Successfully matched request parts: {plug_types_enabled: true}
  Conversation summary: {The user requested an Ionity charge point compatible with the user's car.}

  # Example description: "Ionity" is a charge points operator. Charge point operators cannot be filtered, thus charge point operator "Ionity" was not matched. "Compatible" charge points can be matched to plug_types_enabled. Explain the limitation.

  Answer in language: European Portuguese
  User request: I want to charge at an ionity charger compatible with my car.
  Your response: `,
    assistant: '{"postfix": "Infelizmente, não posso filtrar por operadores de postos de carregamento, como a Ionity."}'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_addresses: "KFC", is_nearby_requested: true}
  Conversation summary: {The user requested a charge point at a KFC near the user's location.}

  # Example description: KFC was matched and nearby charging was matched. all is valid. Return "null".

  Answer in language: English UK
  User request: Near me at a KFC.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_addresses: "KFC, London"}
  Conversation summary: {The user requested a charge point at a KFC in London.}

  # Example description: KFC was matched and London was matched. all is valid. Return "null".

  Answer in language: English UK
  User request: In London at a KFC.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_addresses: Espinho, type_of_locations: supermarket, type_of_locations_enabled: true, min_power: 30, max_power: 70, power_enabled: true}
  Conversation summary: {The user requested a charge point in Espinho that is fast and near a supermarket location.}

  # Example description: Espinho was matched, "quick charging" was matched onto power settings, "supermarket" was matched onto a type of location. all is valid. return 'null'

  Answer in language: Spanish
  User request: I want to charge in Espinho at a quick charge point near a supermarket
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_addresses: Porto, type_of_locations: restaurant, type_of_locations_enabled: true, min_power: 100, max_power: 500, power_enabled: true}
  Conversation summary: {The user requested a charge point in Porto with a minimum charging speed of 100kW and that is near a restaurant location.}

  # Example description: Porto was matched, "restaurant" was matched onto a type of location and "minimum 100kW" was matched onto power settings. all is valid. return 'null'

  Answer in language: European Portuguese
  User request: I want to charge near Porto in a restaurant with a minimum of 100kw
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_addresses: "Altice Arena", hide_not_available: true}
  Conversation summary: {The user requested a charge point at the Altice Arena that is available.}

  # Example description: "Altice Arena" was matched and "available" was matched. all is valid. return 'null'

  Answer in language: European Portuguese
  User request: Show only available charge points for Altice Arena.
  Your response: `,
    assistant: 'null'
  },

  ////////////////////////////////////////////////////////////////////////////////////

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_addresses: Lisbon, min_power: 30, max_power: 70, power_enabled: true, type_of_locations: [], type_of_locations_enabled: false}
  Conversation summary: {}

  # Example description: Lisbon was matched, "quick charging" was matched onto power settings, "museum" was ignored because it is not a supported type_of_locations and not a place name. You cannot filter unsupported type_of_locations or place without name. Location name is words starts with a capital letter. Explain this limitation to the user.

  Answer in language: English UK
  User request: I want to charge in Lisbon at a quick charge point at museum
  Your response: `,
  assistant: '{"postfix": "Unfortunately, I can\'t filter for very specific locations like museums at the moment."}'
  },

  ////////////////////////////////////////////////////////////////////////////////////

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_addresses: Braga}
  Conversation summary: {The user requested a charge point in Braga that has a CCS plug.}

  # Example description: Braga was matched. You cannot filter for specific plug types (like CCS), the request for plug type 'CCS' was not matched. Users can only request "compatible" plug types and charge points. Explain this limitation to the user.

  Answer in language: Spanish
  User request: charge in Braga at a charging point with CCS.
  Your response: `,
    assistant: '{"postfix": "Desafortunadamente, no puedo filtrar por tipos de enchufes específicos, como CCS. Solo puedo filtrar por tipos de enchufes \'compatibles\' según lo configurado en la aplicación."}'
  },

  {
    projectIds: ['filters'],
    user: `Successfully matched request parts: {plug_types_enabled: true}
  Conversation summary: {The user requested a charge point compatible with the user's car.}

  # Example description: 'compatible plug types' is ALWAYS matched to 'plug_types_enabled'. all is valid. return 'null'

  Answer in language: Spanish
  User request: Only compatible charge points.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: ['filters'],
    user: `Successfully matched request parts: {unconfirmed_addresses: Braga}
  Conversation summary: {The user requested a charge point in Braga that has a CCS plug and is from IONITY .}

  # Example description: Braga was matched. You cannot filter for specific plug types, so that the request for plug type 'CCS' was not matched. You can only request "compatible plug types". "Ionity" is a charge points operator. Charge point operators cannot be filtered, thus charge point operator "Ionity" was not matched. Explain this to the user.

  Answer in language: English UK
  User request: charge in Braga at a charging point with CCS at a IONITY station.
  Your response: `,
    assistant: '{"postfix": "Unfortunately, I can\'t filter by specific plug types, like CCS. I can only filter by \'compatible\' plug types as set up in the app. Also, I can\'t filter by charge point operators like IONITY at the moment."}'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {only_free: true}
  Conversation summary: {The user requested a charge point that is free of cost.}

  # Example description: "cost-free" charging was matched. all is valid. return 'null'

  Answer in language: German
  User request: I want to see cost-free chargers.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {only_free: true, unconfirmed_address: Sintra}
  Conversation summary: {The user requested a charge station that is free.}

  # Example description: "free station" charging was matched. Sintra was matched. all is valid. return 'null'

  Answer in language: German
  User request: I want to charge at a free station in Sintra.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_addresses: Aveiro, is_nearby_requested: false, min_power: 0, max_power: 50, power_enabled: true, type_of_locations: supermarket, type_of_locations_enabled: true}
  Conversation summary: {The user requested a charge point in Aveiro up to 50kW at a supermarket location.}

  # Example description: Aveiro was matched, "up to 50kW" was matched. the rest is ignored. all is valid. returning 'null' is possible!

  Answer in language: European Portuguese
  User request: I want to charge in Aveiro up to 50kW at a supermarket. Where can I find these charging points?
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_addresses: Lisbon, min_power: 0, max_power: 150, power_enabled: true}
  Conversation summary: {The user requested a charge point in Lisbon that allows up to 150kW charging.}

  # Example description: Lisbon was matched, "up to 150kW" was matched to charging power. all is valid. return 'null'

  Answer in language: European Portuguese
  User request: I want to drive in Lisbon, my car goes up to 150kW
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_addresses: Lisbon, north-east}
  Conversation summary: {The user requested a charge point in London northeast.}

  # Example description: Location with cardinal direction "Lisbon, north-east" was matched. all is valid. return 'null'

  Answer in language: English UK
  User request: I want to charge in the north-east of Lisbon.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_addresses: Cardiff, north}
  Conversation summary: {The user requested a charge point in Cardiff north.}

  # Example description: Location with cardinal direction "Cardiff, north" was matched. all is valid. return 'null'

  Answer in language: English UK
  User request: North of Cardiff
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {unconfirmed_addresses: Wolfhausen, Bubikon}
  Conversation summary: {The user requested a charge point in Wolfhausen. The assistant showed different options for possible Wolfhausen locations: 1) Wolfhausen, Teisendorf 2) Wolfhausen Bubikon and 3) Wolfhausen Tacherting, for the user to choose from.}

  # Example description: The user selected "number two", the Wolfhausen in Bubikon. all is valid. return 'null'

  Answer in language: English UK
  User request: Number two, Wolfhausen in Bubikon
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {min_power: 0, max_power: 22, power_enabled: true }
  Conversation summary: {The user requested to charge overnight. The assistant presented a number of charge points.}

  # Example description: The request for charge duration such as "overnight" is represented as an appropriate very slow charging speed. all is valid. return 'null'

  Answer in language: English UK
  User request: I want to charge overnight.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {min_power: 30, max_power: 500, power_enabled: true }
  Conversation summary: {The user requested to hide slow charging points. The assistant presented a number of charge points.}

  # Example description: To "hide" slow charge points is matched by a filter that filters for power higher than 30 kW. all is valid. return 'null'

  Answer in language: English UK
  User request: Hide slow charging stations.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {min_power: 70, max_power: 500, power_enabled: true }
  Conversation summary: {The user requested to for only half an hour. The assistant presented a number of charge points.}

  # Example description: The request for charge duration such as "half an hour" is represented as an appropriate ultra-fast charging speed. all is valid. return 'null'

  Answer in language: German
  User request: I want to charge up in half an hour.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {min_power: 30, max_power: 70, power_enabled: true }
  Conversation summary: {The user requested to charge for 2 hours. The assistant presented a number of charge points.}

  # Example description: The request for charge duration such as "2 hours" is represented as an appropriate charging speed. all is valid. return 'null'

  Answer in language: English UK
  User request: I want to charge for a duration of 2 hours.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {"is_location_blocked": true}
  Conversation summary: {The user requested a charge point at a McDonalds in Berlin Mitte, after which the assistant presented a location to the user.}

  # Example description: The user blocked a location that was previously presented. all is valid. return 'null'

  Answer in language: German
  User request: No, not this one.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: ['recommendations'],
    user: `Successfully matched request parts: {"date_time": "20:00:00", unconfirmed_address: museum}
  Conversation summary: {The user requested a charge point at the museum at 8pm.}

  # Example description: The time was matched. the "museum" location was matched in unconfirmed_address. all is valid. return null.

  Answer in language: German
  User request: I want to charge at the museum at 8pm.
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {is_nearby_requested: true}
  Conversation summary: {The user requested a charge point nearby that is the cheapest.}

  # Example description: nearby location could be matched. the requested "cheapest" or "most affordable" price could not be matched because we cannot filter for prices, yet. Explain the limitation.

  Answer in language: German
  User request: What is the cheapest charge point around me?
  Your response: `,
    assistant: '{"postfix": "Leider können wir aktuell noch nicht nach Preisen filtern."}'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {is_nearby_requested: true}
  Conversation summary: {The user requested a charge point nearby that is the least expensive.}

  # Example description: nearby location could be matched. the requested "least expensive" charge point could not be matched because we cannot filter for prices, yet. Explain the limitation.

  Answer in language: English UK
  User request: What is the least expensive charge point around me?
  Your response: `,
    assistant: '{"postfix": "Unfortunately, we can\'t filter by prices at the moment."}'
  },

  {
    projectIds: ['filters'],
    user: `Successfully matched request parts: {is_nearby_requested: true, type_of_locations: restaurant, type_of_locations_enabled: true, unconfirmed_address: museum}
  Conversation summary: {The user requested a charge point nearby that is close to a restaurant and a museum.}

  # Example description: nearby location could be matched. location "restaurant" and "museum" could be matched to possible type of locations and unconfirmed_address. all valid. return 'null'

  Answer in language: German
  User request: I want to charge nearby, at a restaurant and a museum.
  Your response: `,
    assistant: 'null'
  },


  {
    projectIds: ['filters'],
    user: `Successfully matched request parts: {"is_nearby_enabled": true, "only_auto_charge": true}
  Conversation summary: {The user requested self-charging charge points nearby.}

  # Example description: "Self-charging" is interpreted as "auto-charge". nearby charging was matched. all is valid. return 'null'.

  Answer in language: German
  User request: I want to have self-charging chargers near my location
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {"unconfirmed_address": "{city}"}
  Conversation summary: {The user requested to charge at their house.}

  # Example description: The user request for charging at their house did not include an address. The placeholder "{city}" indicates that the assistant asked for that address already, which will be answered in a future request. all is valid. return 'null'.

  Answer in language: European Portuguese
  User request: Charging at my house
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {"power_enabled": true, "min_power": 30, "max_power": 70}
  Conversation summary: {The user requested PCR (fast) charging.}

  # Example description: Abbreviation in Portuguese "PCR" is translated to "fast charging". fast charging is matched by power filters. all is valid. return 'null'.

  Answer in language: German
  User request: I want to have self-charging chargers near my location
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: ['filters'],
    user: `Successfully matched request parts: {"only_4_or_5_stars": true}
  Conversation summary: {The user requested a charge point with a high rating.}

  # Example description: "high rating" or "high quality" or "well-rated" or "best place" charge point requests ALWAYS trigger the "only_4_or_5_stars" filter. all is valid. return 'null'.

  Answer in language: German
  User request: I want only well-rated charge points
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {"unconfirmed_address": "Aachen, east"}
  Conversation summary: {The user requested charge points in the east of Aachen.}

  # Example description: ALL cardinal directions are matched in the unconfirmed_address line. a "place to charge" is just a different way of saying "charge point". all is valid. return 'null'.

  Answer in language: German
  User request: I want a place to charge in the east of Aachen
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Successfully matched request parts: {"unconfirmed_address": "Lancaster, south"}
  Conversation summary: {The user requested charge points in the south of Lancaster.}

  # Example description: "southern districts" is simply another way of requesting a cardinal direction in a city and both are matched in the unconfirmed_address line. all is valid. return 'null'.

  Answer in language: English UK
  User request: I want a place to charge in the southern districts of Lancaster.
  Your response: `,
    assistant: 'null'
  },

  // {
  //   projectIds: ['filters'],
  //   user: `Successfully matched request parts: {only_auto_charge: true, plug_types_enabled: true}
  // Conversation summary: {The user requested charge points that are self-charging and compatible with a Tesla Model S.}

  // # Example description: self-charging was matched to only_auto_charge. Filtering for compatibility with specific cars like Tesla Model S is possible for owned cars for which the app was configured. Explain the limitation.

  // Answer in language: European Portuguese
  // User request: I want a self-charging station compatible with my Tesla Model S
  // Your response: `,
  //   assistant: 'null'
  // },

  {
    projectIds: ['filters'],
    user: `Successfully matched request parts: {plug_types_enabled: true}
  Conversation summary: {The user requested charge points that are compatible with the user's car.}

  # Example description: "compatible" charge points are requested and matched to plug_types_enabled. all is valid. return 'null'.

  Answer in language: European Portuguese
  User request: Stations compatible with my vehicle
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: ['filters'],
    user: `Successfully matched request parts: {unconfirmed_address: Porto, }
  Conversation summary: {The user requested charge points that are compatible her car.}

  # Example description: The location Porto was matched. Filtering for compatibiliaity with the user's car is matched. all is valid. return 'null'.

  Answer in language: European Portuguese
  User request: I want a compatible charge point for my car in Porto
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: ['filters'],
    user: `Successfully matched request parts: {unconfirmed_addresses: Munich}
  Conversation summary: {The user requested an Ionity charge point in Munich}

  # Example description: The location Munich was matched. "Ionity" is a charge points operator. Charge point operators cannot be filtered, thus charge point operator "Ionity" was not matched. Explain the limitation.

  Answer in language: English UK
  User request: I want to charge at an Ionity charger in Munich
  Your response: `,
    assistant: '{"postfix": "Unfortunately, I can\'t filter for charge point operators at the moment."}'
  },

  {
    projectIds: ['filters'],
    user: `Successfully matched request parts: {is_nearby_requested: true, type_of_locations: restaurant, type_of_locations_enabled: true}
  Conversation summary: {- The user requested to charge at a restaurant with low-cost charging nearby.\n- The user also provided their current coordinates: 51.44116565804926 / 7.017200291179785.}

  # Example description: the request for a filtering restaurants was matched in type_of_locations and the nearby charging was matched as the user provided coordinates. the low-cost request could not be matched. explain the limitation.

  Answer in language: English UK
  User request: at a restaurant with low cost charging nearby
  Your response: `,
    assistant: '{"postfix": "Unfortunately, I can\'t filter for prices at the moment."}'
  },

  {
    projectIds: ['filters'],
    user: `Successfully matched request parts: {only_auto_charge: true, type_of_locations: restaurant, type_of_locations_enabled: true, unconfrimed_address: "McDonald's"}
  Conversation summary: {- The user requested to charge at a McDonalds with auto-charge enabled charging stations}

  # Example description: the request for a filtering McDonalds was matched in type_of_locations and the "auto-charge" request was matched to only_auto_charge. all is valid. return 'null'.

  Answer in language: European Portuguese
  User request: I want to charge at McDonald's with Autocharge
  Your response: `,
    assistant: 'null'
  },

  {
    projectIds: ['filters'],
    user: `Successfully matched request parts: {connector_type: CCS, is_nearby_requested: true}
  Conversation summary: {- The user requested charging nearby at charge points with CCS plug type.\n- The assistant recommended charge points near the user's location.}

  # Example description: the request for charging nearby was matched. the request for CCS connector is matched. all is valid. return 'null'.

  Answer in language: German
  User request: Show me nearby charge points with CCS plugs.
  Your response: `,
    assistant: 'null'
  }, 
];
