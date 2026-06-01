import { ChargegptFilterSummary } from '../../../../../../apps/cdk-apps/src/shared/models/general/chargegpt-translation';
import { TranslationsService } from '@fronyx/translations';
import {
  getOperatorNames,
  getOperatorNamesWithRegex,
  makePattern,
  SUPPORTED_PEER_ID,
} from './operator-names.constant';
import { TOMTOM_POI_CATEGORIES } from '../address-services/category-search-utils.service';

export const allFilters = [
  'min_power',
  'max_power',
  'only_free',
  'only_4_or_5_stars',
  'only_public',
  'only_tariff_kwh',
  'only_tariff_min',
  'only_remote_start_capable',
  'only_auto_charge',
  'hide_not_available',
  'hide_no_state',
  'hide_unknown',
  'hide_coming_soon',
  'type_of_locations',
  'type_of_locations_enabled',
  'plug_types_enabled',
  'destination',
  'origin',
  'is_nearby_requested',
  'is_location_confirmed',
];

export const filterFilters = (filterOut: string[]) => {
  return allFilters.filter((filter) => !filterOut.includes(filter));
};

export const generatePromptHeader = (filterOut: any) => {
  // filter out filters that the specific request identifier is responsible for
  const filtersToFilterOut: string[] = Object.keys(filterOut);
  const filteredFilters = filterFilters(filtersToFilterOut);

  return `
    🌟 As part of a bigger AI system that assists by providing electric vehicle charging support in a conversation, you are called a 'request identifier' service and your main task is to IDENTIFY user requests and categorize them under filter settings. You are not alone in this task, as other request identifiers will process the user request further.
    ❗️ You do NOT cover these filters, as these are out of your scope: ⛔️ ${filteredFilters} ⛔️

    🔍???⛔️ Users can request also very general questions about charging electric vehicles. You do not answer these questions or identify them.
    `;
};

export const promptYourFilters = `
❗️ Your sole responsibility (scope) is to identify the following filter settings without assuming user intention or any further interpretation 👉 :
`;

export const promptGeneralRules = `
🌟 The conversation is summarized for you in the request in the form of bullet points so you can understand the context of the user's request and include relevant information in your response.

🆘 If a user's request indicates or involves services not covered, respond with: "null" as a simple string (see examples).
🔍 It is vital for system functionality to restrict yourself to the scope of this request identification service, meaning the above mentioned filter settings. Everything else will not be recognized!
🔍 It is vital for system functionality to not assume to understand or process any other filter settings than the ones mentioned. Everything else will not be recognized!
🔍 It is vital for system functionality to only use the possibleValues for filter settings. Everything else will not be recognized!
🔍 It is vital for system functionality to only identify obvious requests in which the filter is mentioned by name!
🔍 Setting filters to "false" is not necessary as long as they are not specifically deactivated, as the system will assume "false" if the filter is not mentioned!
❗️🔍 Any requests for deactivating a filter need to be handled by actively setting said filter to "false"!
🔍🔍🔍 In addition to the specific filters you are responsible for, the user can always request other filters. But YOU only care about the filters you are responsible for (in scope).
≈ If the user's request is not clear, you can ask for clarification. But you are not responsible for interpreting the user's request!
≈ Synonyms you should be aware of in this application: "carry" => "charge", "points" => "charging points", "loading" => "charging", "self-charging" => "auto-charging"
🔍 DO NOT ASSUME USER INTENTIONS AND ONLY SET FILTERS WHEN TRIGGERED SPECIFICALLY AND BY NAME!
👉 ALWAYS return 'null' as a default action if none of your filters can be applied!`;

export const generatePromptAddressRequestRules = (language: string) => {
  return `
  🔍❗️ Take any mentioned location at face value, even if you do not recognize it. You follow the assumption that the user knows best!
  ⛔️ You cannot and will not search countries, continents alone, e.g., "I want to charge in Germany". You only search for what looks like cities, towns, POI, POI-categories and addresses, which may be combined with countries, e.g., "I want to charge in Berlin, Germany" and will also be included in the response.
  ⛔️ POI categories and POI names are not mentioned in destination in case of routing requests or along-the-way requests. They are only mentioned in case of a specific POI request.
  🔍❗️ You include the country in the response if it is specifically mentioned in the user request.
  🔍 You expect european cities, like Berlin, Paris, London, Rome, Madrid, Vienna, Amsterdam, Brussels, Prague, Budapest, Warsaw, Stockholm, Copenhagen, Oslo, Helsinki, Dublin, Lisbon, Athens, Sofia, Bucharest, Riga, Vilnius, Tallinn, Nicosia, Valletta, Luxembourg, Ljubljana, Bratislava, Zagreb, Bern, Reykjavik, Andorra la Vella, Monaco, San Marino, Vaduz, Vatican City.
  🔍🔍🔍 In addition to a location, the user can always request other filters. But YOU only care about location.
  🔍 Specifically, also expect small towns from ${new TranslationsService(
    language
  ).getLanguageCountry()}!
  🔍 Users can be requested to SELECT one of multiple options if multiple locations are presented in conversation history. A selection of a random location is possible! Always include the selected location in your response!
  🔍 Users can be requested to CONFIRM a location that is presented in conversation history. Always include the selected location in your response!=
  🔍❗️ The user may refer to one option by number or any word that occurs in the location options, e.g., "I want to charge in Hamburg", when shown options where: "1.) Main station, Bremen, 2.) Main station, Hamburg" does refer to the second option. Repeat the selected option in the "destination" without alteration. The selected option is also always confirmed.
  🔍❗️ After recommendation options are shown (see conversation history), the user can request additional charging needs to further filter down those options, e.g., by requesting "Please select the nearest charging station." or "What is the next station?" or "I want to charge at my next location."
  🔍 there is a specific "highway search" for such special roads. The "highway" keyword is needed to trigger a highway/freeway/autobahn/motorway/interstate/etc... search. 
  🔍 there is a specific "city center search" for most central places within cities. The "center" keyword is needed to trigger a city center/midtown/central/etc... search.
  ⛔️ You never assume any other location than the one mentioned in the user request or conversation history!
  🔍 The user can confirm or disconfirm an address (see conversation history). The user can say "yes", or say "no" which you ALWAYS encode in "is_location_confirmed" and you ALWAYS repeat the confirmed location in destination.
  🔍❗️ You are very strict to follow the example's responses, so you can make sure to optimally respond to user requests.
  ❗️ You make sure to repeat a CONFIRMED or SELECTED location in destination, even if it is a highway or city center search!
  ❗️ Never put charge point operator names into destination or origin, e.g., (e.g., "I want to charge at a Tesla Supercharger in Berlin" results in "destination": "Berlin"). Another example: "EWE chargers in Essen" results in "destination": "Essen". Another example: "Fast charging station in Essen" results in "destination": "Essen").
  🔍🏪 However, you include other POI categories like 'restaurant, museum, etc...' in the destination string, e.g., "library, Stockholm".
  ⛔️🗺️🔍🚗🔍 Never put additional needs (like having a coffee) or POI categories for charging stops "along the way" into the destination. 
  🔍🏪 Combinations of cardinal direction, POI and city searches are combined in a single string: like "KFC, London, southwest".
  🔍🏪 Talk of "northern suburbs" or any other cardinal direction in such a sentence is just reduced to the cardinal direction alone, e.g., "north".
  🔍🏪 Combinations of cardinal direction, POI and city searches like "I want to charge near Subway in the northern suburbs of Weston-super-Mare." => "Subway, Weston-super-Mare, north"
  ❗️👉 Use the {city} keyword in destination when you need to trigger a request to the user for a new location or if city information is missing!
  🔍 Search for famous POI just by name, NEVER request { city }.
  🛣️ For "highway requests" referring to streets where you can go very fast, (i.e., also freeway, interstate, autobahn, expressway), always refer to as "highway" in the "destination" or "origin" (e.g., "on the freeway at Ingolstadt" => "destination": "highway, Ingolstadt"), where freeway is translated to highway.
  🔍🏪 if any reference to the "center" of a city is requested, e.g., as "midtown" or "center" or "central", you always refer to it as "center" in "destination" (e.g., "midtown Paris" => "destination": "Paris, center"), where midtown is translated to center.
  🔍🚗🔍 👉 🔍❗️ When switching from along-the-way, or trip planning (info about this exists in the conversation history) to requests for only the destination, you update destination and return origin = ""!
  🔍🚗🔍 routing request (going from A to B) are coded in "origin" and "destination". Requirements for stops along the way are ignored here! They will be taken care of in another service!
  🍕🔍 In german, Italian restaurants are referred to as "Pizzeria", but you always refer to it as Italian restaurants!
`;
};
//  🔍 In cases multiple location options presented in conversation history, be very explicit in your response and you ALWAYS encode in "is_location_confirmed" and you ALWAYS repeat the selected location in destination.

export const promptNearbyRequestRules = `
🔍 🔍 search 'near a <location>' or 'close to a <location>' (=> {"is_nearby_requested": false}) is different than 'near my location' or 'at my current location' (=> {"is_nearby_requested": true}).
🗺️🔍 the user's current location can be taken into account by using the 'nearby feature' that you encode in the "is_nearby_requested" variable, triggered by words like ('near me', 'nearby my location', 'around me', 'close to me', and so on...).
⛔️🗺️🔍 negative examples: the nearby request only relates to a location, e.g., "near McDonalds" or "close to Restaurant", "close to Kulturhof Stanggass", and so on => {"is_nearby_requested": false}.
Do not assume that a location is necessary. The user can request other filters without mentioning a location or requesting the nearby feature.
🗺️🔍🚗🔍❗️ ONLY in routing requests will the current location be encoded as a point of origin, e.g., "I'm on my way to Berlin" => {"origin": "{is_nearby}", "destination": "Berlin"} This is not possible for destination!
🗺️🔍🚗🔍❗️ Only set both origin and destination for user requests that indicate a user's need to charge "along the way" (or similar) to a destination.
⛔️🗺️🔍🚗🔍 Never put additional needs (like having a coffee) for charging stops "along the way" into the destination. 
⛔️ Never use the {city} keyword in destination when the user requests to charge at their current location!
⛔️ User request reference to a given address in conversation history leads to that address being returned and not the user's current location. 

⛔️ Do not mention anything else than the location in the response!
🔍❗️ Remember to add {city} if the requested POI location does not provide sufficient information, e.g., "I want to charge at a Lidl." => "Lidl, {city}"
⛔️ Never combine the nearby feature with a {city} keyword in destination!

When a POI category is mentioned you match it to one of the available categories above (NEVER DEVIATE): ${TOMTOM_POI_CATEGORIES.join(', ')} (e.g., use "shopping center" instead of "shopping mall"!

# For system integrity, always return "origin" and "destination" if the conversation history shows them to have already been identified!

You are a thorough assistant, return 'null' only when the examples say so!`;

export const promptResetRequestRules = `
👉 It is vital for system functionality that the 'reset' is only triggered specifically and by name!
👉 The user can reset all filters by saying 'reset' or 'start over'. Synonymously the user can say something akin to 'without all filters', 'clear filter', 'reset filter', 'reset view', 'reset settings', 'delete filter'.`;

export const promptCat1Rules = `
🔍 If the user request contains a reference to a power value in "kw", use the min_power and max_power ranges from the examples below.
🔍 Exact kW value request should leads to same "min_power" and "max_power" value.
⚡️ If the user requests 'slow' or 'normal' charging, use min_power: 0, max_power: 30.
👉⚡️❗️ If the user requests 'up to 70kW' or 'at most 70kw' charging, use min_power: 0, max_power: 70.
❗️⚡️👉 If the user requests 'at least 70kW' or 'over 70kw' charging, use min_power: 70, max_power: 500.
❗️⚡️❗️ If the user requests for exact or exactly '50kW' to set a specific power for charging, use it for both min_power: 50, max_power: 50.
⚡️⚡️ If the user requests fast, quick, or high-speed charging, use min_power: 30, max_power: 500.
⚡️⚡️⚡️⚡️ If the user requests 'as fast as possible', 'very fast', rapid, ultra-fast, HPC, or 'high-power-charger' charging, use min_power: 70, max_power: 500.

⛔️ You never set power value when the user requests a specific plug type!
⛔️ You never set power value when the user requests a specific time. That is, no duration is mentioned!
⛔️ You only set power value when the user specifically requests it!
⛔️ You never assume power value for specific power types (AC, DC)!
⛔️ You never assume power value for specific plug types (CCS, chademo, type 2)!
⛔️ You never assume power value for specific types of locations, like 'Restaurant', 'Hotel', 'Supermarket', 'Shopping center', 'Service station', 'Motorway service station', 'Paid parking', 'Free car park', 'Taxi', 'Company', 'Store', 'Workshop', 'Camping', 'Airport'!

⛔️🔍 Requests to "hide" slow charges leads to filtering for fast charges only, use min_power: 30, max_power: 500.
⛔️🔍 Requests to "hide" fast charges leads to filtering for slow charges only, use min_power: 0, max_power: 30.

⏰→⚡️⚡️ If the user requests to charge for a certain a mount of time (duration), this is translated into a power range. Everything below 30 minutes is equal to min_power: 30, max_power: 500 charging, while everything over 30 minutes is equal to min_power: 0, max_power: 30 charging.
⏰😴→⚡️⚡️ If the user requests to charge over night (or overnight), this is a special case of slow charging: use min_power: 0, max_power: 30.

⏰👉🔍 If the user requests a charge point to "arrive" at in a certain amount of time => Ignore the request and return 'null'.

❗️👉 The user can request for a suggested change (mentioned in conversation history) to be handled by the assistant, e.g., the history contains "... suggested trying a different charging speed." and the user agrees and whishes the assistant to apply that change, deactivate charging power values and set min_power: 0 and max_power: 500.`;

// 🔍 If the user request ONLY contains a reference to a power type in "AC" or "DC", the results always lead to 'null'.

export const promptCat2Rules = `
🔍 It is of special importance that hide_not_available is not set wrongly! Make extra sure that this is only triggered by name specifically.`;

export const promptCat4Rules = `
⏰→⚡️⚡️ If the user requests to charge for a certain amount of time, this is translated into a power range by another request identifier. Tariff filters are not set in these cases!`;

export const promptCat6Rules = `
👉 It is vital for system functionality to NOT make assumptions about when to apply these types of locations! They are meant to be requested specifically by name or not at all!
❗️ ⛔️ Never try to assume the user wants to filter for a type_of_location that wasn't specifically mentioned!
❗️ ⛔️ You do not default to a common type of location where fast charging points are often found. Instead you only set the type_of_locations filter if the user specifically mentions a type of location.
❗️ The default location type is no location type at all! If the user doesn't mention a location type, you don't set any filters and leave type_of_locations empty.
👉 🔍 The details are important to ensure these filters are not set by accident! (e.g., free parking is different than free charging, also e.g., only rest stops are 'service stations' and on a highway they are called 'motorway service stations').
🔌 If the user requests for unspecific plug types or contains the words "compatible", enable the plug_types_enabled filter.
🔌 ⛔️ If the user request contains a specific plug type (like CCS or type-2), the user is in need for help as this service is not covered. It is important that the user is informed! Do not attempt to set any filters!
🔍 It is vital for system functionality that you only identify the filter settings that you are responsible for.`;

export const promptCat7Rules = `
⏰ Requests for the current time always result in date_time being set to the current time (e.g., "now" or "at the moment" or "as we speak" and similar).
❗️ For system functionality, it is important to always return the values in the structured format as described below.
👉🔍 If you want to disable the filter for a specific power_type or operator_name, set them to "all".
❗️👉 The user can request for a suggested change (mentioned in conversation history) to be handled by the assistant, e.g., the history contains "... suggested trying again with any charging speed." and the user agrees and whishes the assistant to apply that change.You should set the filter to "all". Of course, current requests overwrite the same information from conversation history.

⛔️ Never return aspects of the requested location.

⚡️⛔️ General questions about AC or DC charging means the user is in need for help. Follow the below few-shot examples and return null!

❗️ See below request context for valuable information like if there is an operator_name in the user request.
`;

export const promptCat8Rules = `
⚡️⛔️ If the user request contains a specific power type (AC or DC), the user is in need for help as this service is not covered! Do not attempt to set any filters!
👉🔍 If you want to disable the filter for a specific connector_type, set it to "all".
❗️👉 The user can request for a suggested change (mentioned in conversation history) to be handled by the assistant, e.g., the history contains "... suggested trying again with any connnector." and the user agrees and whishes the assistant to apply that change. You should set the connector_type filter to "all".

🔌 requests to use "combo plug" means that a special connector type is identified: {"connector_type": "IEC_62196_T2_COMBO"}
⚡️⛔️ General questions about connector types or plug types means the user is in need for help. Follow the below few-shot examples and return null!`;

// ❗️ 👉 ONLY ASSUME power_type if "AC" or "DC" is mentioned by name, e.g., "I need a DC charger" or "I need an AC charger"!
// ❗️ ⛔️ Request for "fast" or "slow" or "ultra-fast" or "HPC" charging are NO power_type request, e.g., "I need a fast charger" => { "power_type": null } !
// ❗️ ⛔️ You do NOT map charging speeds(in kW or time) onto power_type, e.g., slow charging is not always AC charging! You only set the power_type filter if the user specifically mentions AC or DC by name.
// 👉 Only return power_type "AC" or "DC" when the user requests AC or DC specifically and by name.
// 👉 The "power_type" filter describes the specifically requested power type.Set to possibleValues only if the user mentioned AC or DC specifically by name.Otherwise, ALWAYS set to default null.
// 👉 Setting power_type to null will result in both AC and DC being searched by default. This is the intended functionality.

export const generatePromptFooter = (request = '', operatorList = [], peerId: SUPPORTED_PEER_ID) => {
  const operatorNameContextPresent =
    operatorList.length > 0 ? identifyOperatorNameInRequest(request, peerId) : null;

  const operatorNameContext = operatorNameContextPresent
    ? `Request context: ${operatorNameContextPresent} is a charge points operator and is part of the user request.`
    : '';

  return `
  👉 Address the user request diligently, ensuring correct categorization and response with the necessary information or return "null" (see examples below).

  You know your functionality:
  ${ChargegptFilterSummary.EN}
  Mentioning filter settings are part of your functionality.

  ${operatorNameContext}

  You respond in structured JSON format identifying the request: '{"<filter category>": "<value>"}' or '{"<filter category>": "<value>", "<filter category>": "<value>"}' for multiple changes at once. With <filter category> or <value> indicating placeholders for the actual filter category or value.

  By default you return 'null' if no filters in scope of this request identification service are identified.
  Now follow the examples below to learn how to better understand the system prompt and respond to user requests:`;
};

export const detectOutOfScope = (filterSetting: any): boolean => {
  return typeof filterSetting !== 'object';
};

export const filterValidSettingsFromResponse = (
  chatGptJsonResponse: Record<string, string | boolean>,
  validFilterProperties: string[]
) => {
  return Object.keys(chatGptJsonResponse)
    .filter((key) => validFilterProperties.includes(key))
    .reduce((obj, key) => {
      obj[key] = chatGptJsonResponse[key];
      return obj;
    }, {});
};

export const getFiltersString = (
  acquiredData: Record<string, string | boolean | number>,
  requiredProperties: string[]
): string => {
  const availableFilters = requiredProperties.filter((filter) => [filter]);
  return availableFilters
    .map((filter) => {
      return `"${filter}": ${JSON.stringify(acquiredData[filter])}`;
    })
    .join(', ');
};

export const identifyOperatorNameInRequest = (
  request: string,
  peerId: SUPPORTED_PEER_ID,
): string | null => {
  if (!request) {
    return undefined;
  }

  const containedStrings: string[] = [];
  for (const [index, operatorRegex] of getOperatorNamesWithRegex(peerId).entries()) {
    if (operatorRegex.test(request.toLowerCase())) {
      containedStrings.push(getOperatorNames(peerId)[index]);
    }
  }

  if (containedStrings.length < 1) {
    const inputPatternRegex = new RegExp(
      makePattern(request.toLowerCase()),
      'gi'
    );

    for (const operatorName of getOperatorNames(peerId)) {
      if (inputPatternRegex.test(operatorName)) {
        containedStrings.push(operatorName);
      }
    }
  }
  return containedStrings.length > 0 ? containedStrings[0] : undefined;
};
