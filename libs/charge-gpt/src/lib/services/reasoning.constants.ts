export enum SubComponentEnums {
  START = 'start',
  REASONING = 'reasoning',
  RETURN_TO_USER = 'returnToUser',
  DESTINATION = 'destination',
  ROUTING = 'routing',
  POI_SEARCH = 'poiSearch',
  CHARGING_STATION_SEARCH = 'chargingStationSearch',
  ROUTING_SEARCH = 'routingSearch',
  SANITY_CHECK = 'sanityCheck',
  ENABLE_USER_LOCATION = 'enableUserLocation',
  REFINEMENT = 'refinement',
  HELP = 'help',
  FILTER = 'filter',
  RESET_FILTERS = 'reset_all_filters',
};

const necessaryInformationDestination = '{address, date_time, power_type, operator_name, min_power, max_power}';
const necessaryInformationRouting = '{origin_address, departure_date_time, destination_address}';
export const necessaryInformationFilter = '{min_power, max_power, power_enabled, only_free, only_4_or_5_stars, only_public, only_tariff_kwh, only_tariff_min, only_remote_start_capable, only_auto_charge, hide_not_available, hide_no_state, hide_unknown, hide_coming_soon, type_of_locations, type_of_locations_enabled, plug_types_enabled, unconfirmed_address, latitude, longitude, address, done}';

export const genRules = (isRouting = false) => {
  const information = isRouting ? necessaryInformationRouting : necessaryInformationDestination;

  return `
0. pay attention to lastUserInput, chat history and switch_reason as it contains information about what the user wants. 
1. PRIORITIZE SPEED OVER MANNERS! NO THANKING OR APOLOGIZING OR SUMMARIZING OR CONFIRMING!
2. ALWAYS answer using {message} using the ${SubComponentEnums.RETURN_TO_USER} function
3. collect or infer all necessary information ${information} before returning {done: true} 
4. address must not be left empty 
5. take whatever resembles an address. you possess no knowledge about addresses
6. when asked for a personal place (Grandma's place, Girlfriend's home) you must ask for a street name or known public place that is close by using the ${SubComponentEnums.RETURN_TO_USER} function
7. ALWAYS use the current date_time if nothing else is mentioned, but past times are not valid
8. power_type is optional and "both" by default if duration of stay cannot directly be inferred from a mentioned request or from time spent at destination. Use DC for stays shorter than 1 hour or if HPC is needed and use AC for longer stays. Do not explicitly ask for it
9. NEVER talk about functions or chargegpt
10. NEVER summarize or ask for confirmation
11. pay attention to mentioned 'times of day' like 'in the evening' and replace them in {date_time}: "morning" replaced by '08:00:00'; "afternoon"/"nachmittag" replaced by '15:00:00'; "evening" replaced by '20:00:00'; "night" replaced by '00:00:00'; "noon"/"mittag" replaced by '12:00:00'"
12. operator_name is optional and "all" by default if nothing else is mentioned
13. any address has to be confirmed first, so put it in unconfirmed_address and call ${SubComponentEnums.POI_SEARCH} function to get latitude and longitude
14. The user can define charge point speeds by kiloWatt (kW)
`;
};

export const generateAvailableReasoningFunctions = (isFilter = false, isRoutingActivated = false) => {

  const destinationFunction = [
    {
      name: SubComponentEnums.DESTINATION,
      description: `The ${SubComponentEnums.DESTINATION} function quickly COLLECTS ${necessaryInformationDestination} information in a step-by-step manner. DO NOT USE if information is already collected!`,
      parameters: {
        type: 'object',
        properties: {
          switch_reason: {
            type: 'string',
            description: 'ask it to gather latitude and longitude information and whatever may be missing'
          }
        },
        required: ['switch_reason']
      }
    },
    {
      name: SubComponentEnums.REFINEMENT,
      description: `The ${SubComponentEnums.REFINEMENT} function allows to EDIT and CHANGE gathered information and remember {address, date_time, power_type} in order to find a more fitting charge points in a step-by-step manner.`,
      parameters: {
        type: 'object',
        properties: {
          switch_reason: {
            type: 'string',
            description: 'why you want to make this function call (<50 characters)'
          }
        },
        required: ['switch_reason']
      },
    },
    {
      name: SubComponentEnums.CHARGING_STATION_SEARCH,
      description: `The ${SubComponentEnums.CHARGING_STATION_SEARCH} function looks up charge points for the coordinates of a point of interest or address. returns {chargingStopData}.`,
      parameters: {
        type: 'object',
        properties: {
          latitude: {
            type: 'number',
            description: 'the latitude of a coordinate that is not "null"'
          },
          longitude: {
            type: 'number',
            description: 'the longitude of a coordinate that is not "null"'
          },
          power_type: {
            type: 'string',
            description: 'DC: <=1 hour / AC: >1 hour / "both" by default'
          },
          min_power: {
            type: 'number',
            description: 'minimum power in kW'
          },
          max_power: {
            type: 'number',
            description: 'maximum power in kW'
          },
          date_time: {
            type: 'string',
            description: 'date and time'
          },
          operator_name: {
            type: 'string',
            description: 'the charge-point operator name / "all" by default'
          }
        },
        required: ['latitude', 'longitude', 'power_type', 'date_time', 'operator_name']
      },
    },
  ];

  const filterFunctions = [
    {
      name: SubComponentEnums.FILTER,
      description: `The ${SubComponentEnums.FILTER} function quickly COLLECTS ${necessaryInformationFilter} information in a step-by-step manner. DO NOT USE if information is already collected!`,
      parameters: {
        type: 'object',
        properties: {
          
        },
      }
    },
  ];

  const baseFunctions = [
    {
      name: SubComponentEnums.RETURN_TO_USER,
      description: `The ${SubComponentEnums.RETURN_TO_USER} function is used to request information from the user using a very short question`,
      parameters: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'the message to the driver/user'
          }
        },
        required: ['message']
      },
    },
    {
      name: SubComponentEnums.HELP,
      description: `The ${SubComponentEnums.HELP} function is used when users ask assistant or ChargeGPT what they can do or ask for a functionality description or guidance for help on how to formulate requests for destination charging or the user request does not pertain to electric vehicle charging. Sometimes all information are there but user still can ask a question like "what else can you do?"`,
      parameters: {
        type: 'object',
        properties: {
          switch_reason: {
            type: 'string',
            description: 'describe user request'
          }
        },
        required: ['switch_reason']
      },
    },
  ];

  const routingFunctions = [
    {
      name: SubComponentEnums.ROUTING,
      description: `
            This is the ${SubComponentEnums.ROUTING} function of ChargeGPT and your task is to quickly collect "origin_address", "departure_date_time" and "destination_address" information in a step-by-step manner.`,
      parameters: {
        type: 'object',
        properties: {
          switch_reason: {
            type: 'string',
            description: 'why you want to make this function call (<50 characters)'
          }
        },
        required: ['switch_reason']
      },
    },
    {
      name: SubComponentEnums.ROUTING_SEARCH,
      description: `The ${SubComponentEnums.ROUTING_SEARCH} function follows the following rules:
            1. look up a route to get from origin to destination
            2. return a list of charging stops at recommended charge points
            3. return information in JSON format with the keys: {chargingStopData, navigationLink}
            4. NEVER talk about functions or chargegpt
            5. NEVER summarize or ask for confirmation`,
      parameters: {
        type: 'object',
        properties: {
          origin_coordinates: {
            type: 'object',
            description: 'the address as coordinates described as a place or point of interest where the user wants to depart from',
            properties: {
              latitude: {
                type: 'number',
                description: 'latitude of the origin address coordinate'
              },
              longitude: {
                type: 'number',
                description: 'longitude of the origin address coordinate'
              }
            }
          },
          departure_date_time: {
            type: 'string',
            description: 'the described date and time of departure in 2023-05-15 14:00:00 format'
          },
          destination_coordinates: {
            type: 'object',
            description: 'the address as coordinates described as a place or point of interest where the user wants to arrive at',
            properties: {
              latitude: {
                type: 'number',
                description: 'latitude of the destination address coordinate'
              },
              longitude: {
                type: 'number',
                description: 'longitude of the destination address coordinate'
              }
            }
          }
        },
        required: ['origin_coordinates', 'departure_date_time', 'destination_coordinates']
      },
    }
  ];

  if (isRoutingActivated) {
    const merged = [
      ...destinationFunction,
      ...baseFunctions,
      ...routingFunctions
    ];
    return merged;
  }

  if (isFilter) {
    const merged = [
      ...filterFunctions,
      ...baseFunctions
    ];
    return merged;
  }

  const merged = [
    ...destinationFunction,
    ...baseFunctions
  ];
  return merged;
};
