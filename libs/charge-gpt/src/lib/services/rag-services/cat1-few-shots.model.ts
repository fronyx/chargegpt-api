export const cat1FewShotExamples = [
  // {
  //   projectIds: [],
  //   user: `Conversation history: {}
  //   # Example description: now power or speed is mentioned
  //   User request: I want to see only charging stations that support automatic charging.
  //   Your response: `,
  //   assistant: 'null'
  // },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: no power or speed is mentioned in this request for nearby charge points. Return null.
    User request: I want to charge nearby my current location.
    Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: Ignore request for nearby charging. Focus on the request for 'very fast' charging.
    User request: I want very fast charging station. I want to charge nearby my current location.
    Your response: `,
    assistant: '{ "min_power": 70, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: limit maximum power, translates to min_power set to minimum value and max_power set to the mentioned value. 🔋
    User request: I want to charge with at most 22kW.
    Your response: `,
    assistant: '{ "min_power": 0, "max_power": 22}'
  },

  // {
  //   projectIds: [],
  //   user: `Conversation history: {}
  //   # Example description: no charging speed is mentioned
  //   User request: I want an available charge point
  //   Your response: `,
  //   assistant: 'null'
  // },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested charge points that provide a 200kW charging capacity.\n- The assistant informed the user that they couldn't find any with 200kW charging stations around them and suggested trying again at a different place and time.}
    
    # Example description: change charging speed
    User request: I want to charge with at least 70kW.
    Your response: `,
    assistant: '{ "min_power": 70, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested slow chargers in Coimbra.\n- The assistant provided recommendations based on the current availability of charge points at 08:00 AM with a maximum of 30kW.}
    # Example description: change charging speed
    User request: I want to charge with a super fast charging station.
    Your response: `,
    assistant: '{ "min_power": 70, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: exact power value, different words for it: "with"/"at"/"exactly", translates to the same kW value for min_power and max_power 🔋
    User request: I want to charge with exactly 30kW.
    Your response: `,
    assistant: '{ "min_power": 30, "max_power": 30}'
  },
  {
    projectIds: [],
    user: `Conversation history: {}
    User request: I want to charge with exactly 50kW.
    Your response: `,
    assistant: '{ "min_power": 50, "max_power": 50}'
  },
  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: Mixture request for a location and ultra-fast charging (rapid charging). Ignore the location and set min and max power accordingly.
    User request: I want to charge in Matosinhos. I want to charge at a rapid charging point.
    Your response: `,
    assistant: '{ "min_power": 70, "max_power": 500}'
  },
  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: combination of type_of_location, (fast or high speed power) and unconfirmed_address 🔋. This is not rapid charging!
    User request: I want to charge at a fast charging station. I want to charge at the A1 highway, Porto.
    Your response: `,
    assistant: '{ "min_power": 30, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: combination of type_of_location, power and unconfirmed_address 🔋
    User request: I want to charge in Águeda. I want to charge with 50kW. I want to charge at a supermarket.
    Your response: `,
    assistant: '{ "min_power": 50, "max_power": 50}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: Simple charging in a city. Nothing to do here. Return null.
    User request: I want to charge in Porto.
    Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: "fast" charging power and unconfirmed_address, translates to 30kW-70kW 🔋 This is not rapid charging!
    User request: I want to charge in Lisbon. I want to charge at a fast charging station.
    Your response: `,
    assistant: '{ "min_power": 30, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: Fast charging on a highway requested.  This is not rapid charging!
    User request: I want to charge at the A3 highway. I want to charge with fast charging stations.
    Your response: `,
    assistant: '{ "min_power": 30, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: Focus on "ultra-fast" or "HPC" or "rapid" or "super-fast" charging, which translates to 70kW-500kW 🔋
    User request: I want to charge at a HPC or ultra-fast charger.
    Your response: `,
    assistant: '{ "min_power": 70, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: multiple filter requests, including "ultra-fast" or "HPC" or "rapid" or "super-fast" charging, translates to 70kW-500kW 🔋
    User request: I want to charge at a super-fast charging station.
    Your response: `,
    assistant: '{ "min_power": 70, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: "ultra-fast" or "HPC" or "rapid" or "super-fast" charging 🔋
    User request: I want to charge at an ultra-fast charging station.
    Your response: `,
    assistant: '{ "min_power": 70, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: Charging 'nearby' or 'close by' can be ignored. Focus only on "fast" charging, which translates to 30kW-70kW 🔋
    User request: I want a fast charging station. I want to charge nearby my current location.
    Your response: `,
    assistant: '{ "min_power": 30, "max_power": 500}'
  },

  // {
  //   projectIds: [],
  //   user: `Conversation history: {}
  //   # Example description: mixture of filter requests - one is "fast" chargers.
  //   User request: Fast chargers with high rating and remote start.
  //   Your response: `,
  //   assistant: '{ "min_power": 30, "max_power": 500}'
  // },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: request for "fast" charging and some other stuff, translates to 30kW-70kW 🔋
    User request: I want to charge with fast charging points. I want to charge at Aveiro, center.
    Your response: `,
    assistant: '{ "min_power": 30, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: Charging with a normal or slow charging speed 🔋
    User request: I want normal charging speeds.
    Your response: `,
    assistant: '{ "min_power": 0, "max_power": 30}'
  },
  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: Charging with a very slow charging speed 🔋
    User request: I want very slow charging.
    Your response: `,
    assistant: '{ "min_power": 0, "max_power": 30}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: No request for charging speed in this request
    User request: I want to charge at a Hofer supermarket.
    Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: request to charge "with" a specific charging speed, translates to the same kW value for min_power and max_power
    User request: I want to charge with exactly 150kW. I want to charge on the way to Algarve, coming from Lisbon.
    Your response: `,
    assistant: '{ "min_power": 150, "max_power": 150}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: request to charge for a specific charging speed, translates to the same kW value for min_power and max_power
    User request: I want to charge with exactly 150kW. I want to charge in Essen.
    Your response: `,
    assistant: '{ "min_power": 150, "max_power": 150}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: City information missing for specific place and HPC charging 🏪
    User request: I want to charge with HPC charge points only. I want to charge at McDonald's.
    Your response: `,
    assistant: '{ "min_power": 70, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: No request for charging speed power in this request
    User request: What can you do for me?
    Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: Routing request. No request for charging speed power in this request
    User request: I want to charge on the way from Hamburg to Berlin
    Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: Routing request and request for charging speed power. 
    User request: I want to charge on the way from Hamburg to Berlin at an HPC charger.
    Your response: `,
    assistant: '{ "min_power": 70, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: Routing request and request for charging speed power. 
    User request: I want to charge on the way from main station Paris to main station Prague. I want to charge at a fast charger.
    Your response: `,
    assistant: '{ "min_power": 30, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: Routing request and request for charging speed power. 
    User request: I want to charge on my way to the main station, Essen. I want to charge with at least 150kW.
    Your response: `,
    assistant: '{ "min_power": 150, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: Routing request and request for charging speed power. 
    User request: I want to charge on my way to the main station, Stuttgart. I want to charge fast.
    Your response: `,
    assistant: '{ "min_power": 30, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested very slow charging around their current location.\n- The assistant asked the user to provide access to their current location.\n- The user provided their current coordinates.\n- The assistant recommended charge points with a maximum of 30kW.}

    # Example description: Request to change the charging speed to fast charging. Ignore the conversation history and set the min_power to 30 and max_power to 500.
    User request: I want to charge fast.
    Your response: `,
    assistant: '{ "min_power": 30, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}

    User request: I want to charge fast.
    Your response: `,
    assistant: '{ "min_power": 30, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: Location request and request for charging speed power. 
    User request: I want to charge in Stuttgart. I want to charge with a high - power charger (HPC).
    Your response: `,
    assistant: '{ "min_power": 70, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: Location request and power type request. No request for charging speed. Return null.
    User request: I want to charge in Porto. I want to charge with an AC charger.
    Your response: `,
    assistant: 'null'
  }, 

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: Location request and connector type request. No request for charging speed. Return null.
    User request: I want to charge in Angers, south. I want to charge with a CCS connector.
    Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: Location request and connector type request. No request for charging speed. Return null.
    User request: I want to charge in La Rochelle, south. I want to charge with a chademo connector.
    Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: No request for charging speed in this request
    User request: Please, turn on the radio!
    Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: AC charger and location request. No request for charging speed power in this request
    User request: I want to charge in Lille.I want to charge with an AC charger.
    Your response: `,
    assistant: 'null'
  },
  
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at a slow charger.\n- The next agent presented fitting charge points.}
    # Example description: No request for charging speed in this request
    User request: Reset all filters.
    Your response: `,
    assistant: '{ "min_power": 0, "max_power": 500 }'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at Braga.\n- The next agent presented fitting charge points.}
    # Example description: fast chargers and other filters requested
    User request: I want to charge at fast charging points. I want chargers to be compatible with my car.
    Your response: `,
    assistant: '{ "min_power": 30, "max_power": 500}'
  },

  // filter deactivation examples
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at a slow charger.\n- The next agent presented fitting charge points.}
    # Example description: deactivation of a specific filter
    User request: deactivate the charging speed filter.
    Your response: `,
    assistant: '{  "min_power": 0, "max_power": 500 }'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at a slow charger.\n- The next agent presented fitting charge points.}
    # Example description: reset of all filters and setting other filter again
    User request: no that is wrong. I want to charge with exactly 50kW.
    Your response: `,
    assistant: '{ "min_power": 50, "max_power": 50}'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge with 50kW.\n- The next agent presented fitting charge points.}
    # Example description: reset of all filters and setting other filter again, triggered by "that is all wrong"
    User request: No that is all wrong.
    Your response: `,
    assistant: '{  "min_power": 0, "max_power": 500 }'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: deactivate the charging speed filter by mentioning "normal"/"fast"/"ultra-fast"/"rapid"/"super-fast" charging
    User request: Remove the fast charging filter.
    Your response: `,
    assistant: '{  "min_power": 0, "max_power": 500 }'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested fast charging.\n- The next agent presented fitting charge points.}
    # Example description: deactivate the charging speed filter by mentioning that "power does not matter"
    User request: Actually, the power of the station doesn't matter.
    Your response: `,
    assistant: '{  "min_power": 0, "max_power": 500 }'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested fast charging.\n- The next agent presented fitting charge points.}
    # Example description: deactivate the charging speed filter by mentioning that "power does not matter"
    User request: I don't care about kW values.
    Your response: `,
    assistant: '{  "min_power": 0, "max_power": 500 }'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge ultra-fast.\n- The next agent presented fitting charge points.}
    # Example description: reset of all filters and setting address
    User request: I want to disable power filters. I want to charge in Lisbon.
    Your response: `,
    assistant: '{  "min_power": 0, "max_power": 500 }'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: very high minimum charging speed requested
    User request: I want to charge on Iceland. I want to charge with at least 300kW.
    Your response: `,
    assistant: '{ "min_power": 300, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: "rapid charger" requested among other filter requests, set the following values for min_power and max_power
    User request: I want to charge in Prague. I want to charge with rapid charge points.
    Your response: `,
    assistant: '{ "min_power": 70, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: "rapid charger" requested among other filter requests, set the following values for min_power and max_power
    User request: I want to charge with a rapid charge point.
    Your response: `,
    assistant: '{ "min_power": 70, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: people get confused and request kwh instead of kw
    User request: I want to cahrge with minimum 300kW.
    Your response: `,
    assistant: '{ "min_power": 300, "max_power": 500}'
  },

  // time based charging
  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: time-based request for specific time and date NEVER translates into power range. Return null.
    User request: I want to charge tomorrow at 9AM.
    Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: charge duration request: "less than" 30 minutes translates into power range 30-70
    User request: I want to charge for 20 minutes.
    Your response: `,
    assistant: '{ "min_power": 30, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description:  charge duration request: "less than" 30 minutes translates into power range 30-70
    User request: I want to charge for 30 minutes.
    Your response: `,
    assistant: '{ "min_power": 30, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at McDonalds restaurant in central London for 20 minutes.\n- The next agent found a charge point at McDonalds in central London.}
    # Example description: charge duration request: "over" 30 minutes translates into power range 0-30
    User request: I want to charge for 1 hour.
    Your response: `,
    assistant: '{ "min_power": 0, "max_power": 70}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: charge duration request: "over" 30 minutes translates into power range 0-30
    User request: I want to charge for 40 minutes or longer.
    Your response: `,
    assistant: '{ "min_power": 0, "max_power": 70}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: charge duration request: "over" 30 minutes translates into power range 0-30
    User request: I want to charge for 2 hours.
    Your response: `,
    assistant: '{ "min_power": 0, "max_power": 70}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: charge duration request: "over night" charging translates into power range 0-30
    User request: I want to charge overnight. 
    Your response: `,
    assistant: '{ "min_power": 0, "max_power": 70}'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to see available chargers for overnight charging.\n- The next agent found a charge point for overnight charging.}
    # Example description: change of overnight charging to ultra-fast charging. this is rapid charging!
    User request: I want to charge at an ultra-fast charger. Change of plans.
    Your response: `,
    assistant: '{ "min_power": 70, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: charge up to 150kW maximum at most. power range 0-150
    User request: I want to charge in Lisbon. I want to charger with a maximum of 150kW.
    Your response: `,
    assistant: '{ "min_power": 0, "max_power": 150}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: ultra-fast charging with physical card in Lisbon. this is rapid charging!
    User request: I want to charge at ultra-fast charge points. I want to charge in Lisbon. I want to use a physical card.
    Your response: `,
    assistant: '{ "min_power": 70, "max_power": 500}'
  },

  {
    projectIds: [],
    user: `Conversation history: {The user requested to charge at a highway or supermarket. The assistant presented fitting charge points. The user requested to charge at the National Tile Museum. The assistant presented fitting charge points.}
    # Example description: In a long list of requests, the user asks for a charge point at Aveiro. Previous requests are irrelevant!
    User request: I want to charge near Aveiro.
    Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: just a request for charging at a supermarket. <city> is a placeholder. no speed or power explicitly mentioned. return null.
    User request: In <city> at a supermarket.
    Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
    # Example description: just a request for charging at a restaurant. <city> is a placeholder. no speed or power explicitly mentioned. return null.
    User request: Show me restaurants in <city> with chargers.
    Your response: `,
    assistant: 'null'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: The user requested charge points with CCS connectors near their location. Do not set power filters! Return 'null'!
      User request: I want to charge near my current location. I want to charge at charge points with a CCS connector.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: The user requested charge points with Type 2 connectors and slow charging. Ignore connector and set min and max power for slow charging
      User request: I want to charge slowly. I want to charge at charge points with a type 2 connector.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 30}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: The user requested charge points with Type 2 connectors. Do not set power filters! Return 'null'!
      User request: I want to charge at charge points with Type 2 connectors.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Request for faster charging. You have no idea to make charging faster. Return 'null'!
      User request: Is there a way to make charging faster?
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: If you cannot directly match the request, do not set power filters! Return 'null'!
      User request: Can you charge my car to 80%?
      Your response: `,
    assistant:
      'null',
  },
  
  {
    projectIds: [],
    user: `Conversation history: {- The user requested fast chargers in Berlin.\n- The assistant provided recommendations based on the current availability of charge points at 9:34 PM with at least 30kW.}
  
      # Example description: change charging speed to min_power: 50, max_power: 500
      User request: I want to charge with at least 50kW.
      Your response: `,
    assistant:
      '{ "min_power": 50, "max_power": 500 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested slow chargers in Berlin.\n- The assistant provided recommendations based on the current availability of charge points at 08:00 AM with a maximum of 30kW.}
  
      # Example description: change charging speed to rapid charging to min_power: 70, max_power: 500
      User request: I want to charge at a rapid charge point.
      Your response: `,
    assistant:
      '{ "min_power": 70, "max_power": 500 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: If you think the user needs help with their request, do not set power filters! Return 'null'!
      User request: How can I give an electric shock with a charge point?
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: A complex request with multiple filters. The user requested charge points with exactly 22kW.
      User request: I want to charge at Schönbrunn Palace, Vienna. I want to charge with a NewMotion charge point. The charging speed should be exactly 22 kW.
      Your response: `,
    assistant:
      '{ "min_power": 22, "max_power": 22}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: A complex request, combining location, charging speed and connector type.
      User request: I want to charge in Hamburg. I want to charge ultra-fast. I want a charge point with a chademo connector.
      Your response: `,
    assistant:
      '{ "min_power": 70, "max_power": 500}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: A complex request for POI location and a time to charge at that in in the future. This does not translate into power filters. Return 'null'!
      User request: I want to charge close to "Restaurante Quinta do Piloto" in Palmela. I will arrive there in 30 minutes.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: A request for charging at a specific time. This does not translate into power filters. Return 'null'!
      User request: I want to charge in 30 minutes. I want to charge near my current location.
      Your response: `,
    assistant:
      'null',
  },
  
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: A request for charging for a specific amount of time (less than 30 minutes). This does translate into power filter. Return min_power: 30, max_power: 70
      User request: I want to charge for 30 minutes. I want to charge near my current location.
      Your response: `,
    assistant:
      '{ "min_power": 30, "max_power": 500}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge in Berlin.\n- The assistant provided recommendations.}
  
      # Example description: A request for charging for a specific amount of time (more than 1 hours). This does translate into power filter. Return min_power: 0, max_power: 30
      User request: I want to charge for over 1 hour.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 30}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: A request for charging for a specific amount of time (more than 2 hours). This does translate into power filter. Return min_power: 0, max_power: 30
      User request: I want to charge for at least 2 hours. I want to charge in Bielefeld.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 30}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: A complex request a location and cardinal direction. And a request for a fast charger. And a request for a specific connector type. The request for fast charging translates into 30kW-500kW. This is not rapid charging!
      User request: I want to charge in the northern outskirts of Poitiers. I want to charge with a fast charge points. The charger should have a CCS connector.
      Your response: `,
    assistant:
      '{ "min_power": 30, "max_power": 500}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: A complex request a location and POI. Ignore everything except for the "fast charger" part.
      User request: I want to charge near the Prado Museum in Madrid. I want fast chargers only. The charging station should be a ChargePoint charging station.
      Your response: `,
    assistant:
      '{ "min_power": 30, "max_power": 500}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: only focus on the charging speeds. Ignore power type and location. Return null.
      User request: I want to charge in Bonn. I want to charge with an AC charger.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: only focus on the charging speeds. Ignore power type and location. Return null.
      User request: I want to charge in Lisbon. I want to charge with an DC charger.
      Your response: `,
    assistant:
      'null',
  },


  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge in Bonn with AC.
- The assistant provided a recommendation based on the current availability of slow charge points at 4:11 PM.}
  
      # Example description: only focus on the charging speeds. Ignore power type and location. Return null.
      User request: I prefer DC charging.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: only DC power type being requested and a location. nothing to do, nothing to interpret! Return null!
      User request: I want to charge at a DC charging station in Bonn.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge with 150kW.\n- The assistant presented fitting charge points.}
  
      # Example description: only DC power type being requested. nothing to do, nothing to interpret! Nothing to change! Return null!
      User request: I want to charge at a DC charging station.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge with AC charging.\n- The assistant presented fitting charge points.}
  
      # Example description: only DC power type being requested. nothing to do, nothing to interpret! Return null!
      User request: I want to charge at a DC charging station instead.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: only AC power type being requested. nothing to do, nothing to interpret! Return null!
      User request: I want to charge at a AC charging station.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: A complex request a location. And a request minimum charging speeds (at least). And a request for a specific connector type.
      User request: I want to charge in Lisbon. The charging speed should be at least 150kW.
      Your response: `,
    assistant:
      '{ "min_power": 150, "max_power": 500}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for rapid chargers translates to ultra-fast charging!
      User request: I want to charge with a rapid chager.
      Your response: `,
    assistant:
      '{ "min_power": 70, "max_power": 500}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for chargers with over 300kw. (ignore the wrong kwh) set 300kW minimum and 500kW maximum
      User request: I want to charge at a charging point with over 300kW.
      Your response: `,
    assistant:
      '{ "min_power": 300, "max_power": 500}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description:  # example: request for charging with exact power value. set the same kW value for min_power and max_power
      User request: I want to charge in Dublin. I want to charge with a 200kW charger.
      Your response: `,
    assistant:
      '{ "min_power": 200, "max_power": 200}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for chargers with over 300kw. set 300kW minimum and 500kW maximum
      User request: I want to know if I can use a charger with over 300kW at charging stations in Ostrava.
      Your response: `,
    assistant:
      '{ "min_power": 300, "max_power": 500}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for chargers with over 300kw and above.
      User request: I want to charge in Ilhavo. I want to charge with a charger that has over 300kW.
      Your response: `,
    assistant:
      '{ "min_power": 300, "max_power": 500}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for chargers with exactly 300kw.
      User request: I want to charge in Ilhavo. I want to charge at a charging point with 300kW.
      Your response: `,
    assistant:
      '{ "min_power": 300, "max_power": 300}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for very fast charging
      User request: I want to charge very fast. I want to charge in Lisbon.
      Your response: `,
    assistant:
      '{ "min_power": 70, "max_power": 500}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for charging near the user location. No power filter request. Ignore the request and return null.
      User request: I want to charge at a charging point near my current location.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for rapid charging
      User request: I want to charge in Madrid. I want to charge at a ChargePoint charging station. The charging station should support rapid charging.
      Your response: `,
    assistant:
      '{ "min_power": 70, "max_power": 500}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for rapid charging
      User request: I want to charge in Matosinhos. I want to charge at a rapid charging point.
      Your response: `,
    assistant:
      '{ "min_power": 70, "max_power": 500}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for very fast charging
      User request: I want to charge very fast.
      Your response: `,
    assistant:
      '{ "min_power": 70, "max_power": 500}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for maximum 22kw charging
      User request: I want to charge near Santa Cruz do Bispo. I want to charge with a maximum of 22kW.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 22}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for as fast as possible charging
      User request: I want to charge as fast as possible. I want to charge close to my current location.
      Your response: `,
    assistant:
      '{ "min_power": 70, "max_power": 500}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for exact 100kw charging
      User request: I want to charge in Évora. I need a charging station with 100kW.
      Your response: `,
    assistant:
      '{ "min_power": 100, "max_power": 100}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Focus on the request for half an hour charging, i.e., rapid charging. Ignore the request for charging near the user location
      User request: I have half an hour for charging. I want a charge point near my current location.
      Your response: `,
    assistant:
      '{ "min_power": 70, "max_power": 500}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for minimum 300kw charging. ignore the rest
      User request: I want to charge at a charging point with over 300kWh.
      Your response: `,
    assistant:
      '{ "min_power": 300, "max_power": 500}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for charging within 15 minutes, so rapid charging 
      User request: I want to charge for 15 minutes. I want to charge with Chademo.
      Your response: `,
    assistant:
      '{ "min_power": 30, "max_power": 500}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for charging in 2 hours, so slow charging 
      User request: I want to charge for 2 hours.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 30}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for charging in less than half an hour, so rapid charging 
      User request: I want to charge my car with a CCS connector. I want the charging to take less than half an hour.
      Your response: `,
    assistant:
      '{ "min_power": 70, "max_power": 500}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for charging over night, so slow charging
      User request: I want to charge overnight. I want a charging station near my current location.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 30}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for charging with minimum 150kw
      User request: I want to charge in Porto. I want to charge with at least 150 kW.
      Your response: `,
    assistant:
      '{ "min_power": 150, "max_power": 500}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for slow charging
      User request: I want to charge in Aveiro. I want to charge slowly. I want to charge with a type 2 connector.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 30}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for charging with maximum 22kw. Ignore the rest
      User request: I want to charge in Lisbon. I want to charge with AC charging. I want to charge with maximum 22kW.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 22}',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge with a minimum of 300kW.\n- The assistant presented fitting charge points.\n- The user requested to charge at another time.}
  
      # Example description: request different time does not change the power filter
      User request: I want to charge in the evening instead.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge with a minimum of 300kW.\n- The assistant presented fitting charge points.}
  
      # Example description: request different time does not change the power filter
      User request: I want to charge at 18:00.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge with a maximum of 300kW.\n- The assistant presented fitting charge points.}
  
      # Example description: request of different power filters does change power filters
      User request: I want to charge with a minimum of 150kW. 
      Your response: `,
    assistant:
      '{ "min_power": 150, "max_power": 500}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge with 150kW.\n- The assistant presented fitting charge points.}
  
      # Example description: request of different power filters does change power filters
      User request: I want to charge with normal charging instead. 
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 30}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge with 150kW.\n- The assistant presented fitting charge points.}
  
      # Example description: request of different power filters does change power filters
      User request: I want to charge with fast charging instead. 
      Your response: `,
    assistant:
      '{ "min_power": 30, "max_power": 500}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: request for charging near the user location. No power filter request. Ignore the request and return null.
      User request: I want to charge at a nearby charging point.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: { - The user requested fast charging near their current location.\n- The assistant asked for access to the user's current location.\n- The user provided their current coordinates and address.\n- The assistant informed the user that they could not find a charging station with at least 30kW near the provided address and suggested trying a different charging speed.}
  
      # Example description: Request to apply the proposed changes by deactivating the charging speed filter. 
      User request: Do that!
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 500 }',
  },

  {
    projectIds: [],
    user: `Conversation history: { - The user requested fast and DC charging near their current location.\n- The assistant asked for access to the user's current location.\n- The user provided their current coordinates and address.\n- The assistant informed the user that they could not find a charging station with at least 30kW near the provided address and suggested trying a different charging speed.}
  
      # Example description: Request to apply the proposed changes by deactivating the charging speed filter. 
      User request: ok
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 500 }',
  },


  {
    projectIds: [],
    user: `Conversation history: { - The user requested fast and DC charging near their current location.\n- The assistant asked for access to the user's current location.\n- The user provided their current coordinates and address.\n- The assistant informed the user that they could not find a charging station with at least 30kW near the provided address and suggested trying a different charging speed.}
  
      # Example description: Request to apply the proposed changes by deactivating the charging speed filter. 
      User request: do that
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 500 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The assistant informed the user that they could not find a charging station and suggested trying a different charging speed.}
  
      # Example description: Request to apply the proposed changes by deactivating the charging speed filter. 
      User request: do that
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 500 }',
  },

  {
    projectIds: [],
    user: `Conversation history: { - The user requested very fast charging.\n- The assistant informed the user that they could not find a charging station with at least 70kW suggested trying a different charging speed.}
  
      # Example description: Request to apply the proposed changes by  deactivating the charging speed filter. 
      User request: Can you help me with that?
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 500 }',
  },


  {
    projectIds: [],
    user: `Conversation history: { - The user requested very fast charging.\n- The assistant informed the user that they could not find a charging station with at least 70kW suggested trying a different charging speed.}
  
      # Example description: Request to apply the proposed changes by  deactivating the charging speed filter. 
      User request: ok
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 500 }',
  },

  {
    projectIds: [],
    user: `Conversation history: { - The user requested very fast charging.\n- The assistant informed the user that they could not find a charging station with at least 70kW suggested trying a different charging speed.}
  
      # Example description: Request to apply the proposed changes by  deactivating the charging speed filter.
      User request: Do that!
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 500 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Request for charging near the user location and exact charging speed request. Set the same kW value for min_power and max_power
      User request: I want to charge with 150kW. I want a charging point near my current location.
      Your response: `,
    assistant:
      '{ "min_power": 150, "max_power": 150 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Request for charging in center of Düsseldorf and exact charging speed request. Set the same kW value for min_power and max_power
      User request: I want to charge near the Düsseldorf, center. The charging point should have a capacity of 50kW.
      Your response: `,
    assistant:
      '{ "min_power": 50, "max_power": 50 }',
  },
 
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Request for charging at current user location and request for charging with at least 50kW. Set min_power to 50 and max_power to 500.
      User request: I want to charge near my current location. The charging station should have at least 50kW.
      Your response: `,
    assistant:
      '{ "min_power": 50, "max_power": 500 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Request for charging in Stockholm and request for charging with exactly 300kW. Set the same kW value for min_power and max_power
      User request:  I want to charge near Stockholm. I want a charger with 300kW capacity.
      Your response: `,
    assistant:
      '{ "min_power": 300, "max_power": 300 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge with a 50kW charger.\n- The assistant asked for the user's current location.\n- The user provided their current coordinates: 51.45970344321632 / 7.004971886189722.\n- The assistant provided recommendations based on the current availability of charge points at 08:00 AM with a 50kW.}
  
      # Example description: Request to change the charging speed filter to maximum 150kW. Set min_power to 0 and max_power to 150.
      User request: I want to charge at a station with a maximum power of 150kW.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 150 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested slow chargers in Berlin.\n- The assistant provided recommendations based on the current availability of charge points at 08:00 AM with a maximum of 30kW.}
  
      # Example description: Request to change the charging speed to exactly 70kW. Set the same kW value for min_power and max_power
      User request: I want to find a charging point with a 70kW capacity.
      Your response: `,
    assistant:
      '{ "min_power": 70, "max_power": 70 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested fast chargers in Coimbra.\n- The assistant provided recommendations based on the current availability of charge points at 9:34 PM with at least 30kW.}
  
      # Example description: Request to change the charging speed to exactly 70kW. Set the same kW value for min_power and max_power
      User request: I want to find a 80kW charger.
      Your response: `,
    assistant:
      '{ "min_power": 80, "max_power": 80 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Request for charging at relative arrival time. No power filter request. Ignore the request and return null.
      User request: I will arrive there in 30 minutes.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Request for charging at relative arrival time. No power filter request. Ignore the request and return null.
      User request: I will arrive there in 45 minutes.
      Your response: `,
    assistant:
      'null',
  },


  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Request for charging for a specific amount of time. less than 30 minutes translates into power range 30-70. Fast charging.
      User request: I want to charge for 20 minutes
      Your response: `,
    assistant:
      '{ "min_power": 30, "max_power": 70 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Request for charging for a specific amount of time. more than 30 minutes translates into power range 0-30.
      User request: I want to charge for one hour.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 30 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Request for charging for a specific amount of time. more than 30 minutes translates into power range 0-30.
      User request: I want to charge for 2 hours.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 30 }',
  },
  
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Request for charging for a specific amount of time. more than 30 minutes translates into power range 0-30.
      User request: I want to charge overnight.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 30 }',
  },


  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Request for chademo connector and dc power type. No power filter request. Ignore the request and return null.
      User request: I want to charge with a chademo connector. I want to charge with a DC charger.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: I want to search for all charging points.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 500 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: I want to charge with maximum 70kW.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 70 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: Nevermind. I don't care about power.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 500 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: I want to charge in Dublin. I want to charge with a 200kW charger.
      Your response: `,
    assistant:
      '{ "min_power": 200, "max_power": 200 }',
  },
  
  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: I want to charge in Copenhagen. I need a 250kW charger.
      Your response: `,
    assistant:
      '{ "min_power": 250, "max_power": 250 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: I want to charge at a nearby location. The charging station should provide over 300kW.
      Your response: `,
    assistant:
      '{ "min_power": 300, "max_power": 500 }',
  },
  
  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: I want to charge with more than 390kW.
      Your response: `,
    assistant:
      '{ "min_power": 390, "max_power": 500 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: I want the charger to deliver over 22kW.
      Your response: `,
    assistant:
      '{ "min_power": 22, "max_power": 500 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: The charging station should have a power of 50kW.
      Your response: `,
    assistant:
      '{ "min_power": 50, "max_power": 50 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: I want to charge with at least 150kW. I want to charge at a DC charger.
      Your response: `,
    assistant:
      '{ "min_power": 150, "max_power": 500 }',
  },
  
  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: I want to charge slowly. I will arrive in 30 minutes.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 30 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: I want to charge in Ilhavo. I want to charge at 4:00 PM. The charging point should have over 300kWh.
      Your response: `,
    assistant:
      '{ "min_power": 300, "max_power": 500 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: I want to charge near Porto. I want to charge at a restaurant. The charging station should have a minimum of 100kW.
      Your response: `,
    assistant:
      '{ "min_power": 100, "max_power": 500 }',
  },
   

  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: I want to search for all charging points.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 500 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: I want to search for HPC.
      Your response: `,
    assistant:
      '{ "min_power": 70, "max_power": 500 }',
  },

  {
  projectIds: [],
    user: `Conversation history: {}

      # Example description: Request to charge with normal speeds. Set min_power to 0 and max_power to 30. Ignore the AC charger request.
      User request: I want to charge at normal speeds. I want to charge with an AC charger.
      Your response: `,
      assistant:
  '{ "min_power": 0, "max_power": 30 }',
  },
  
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example description: Request to charge at location and time of arrival. Ignore the request. Return null.
      User request: I want to charge close to "Terras de Bouro". I will arrive there in 45 minutes.
      Your response: `,
    assistant:
      'null',
  },
  
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example description: Request to charge at location and time of arrival. Ignore the request. Return null.
      User request: I want to charge in Porto. I will arrive there in three hours.
      Your response: `,
    assistant:
      'null',
  },

  {
  projectIds: [],
    user: `Conversation history: {}

      # Example description: Request to charge for the duration of 2 hours. Set min_power to 0 and max_power to 30.
      User request: I want to charge for 2 hours. I want to charge with a CCS connector.
      Your response: `,
      assistant:
  '{ "min_power": 0, "max_power": 30 }',
  },

  {
  projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Multiple requests for charging parameters. One is about "fast charging". Return min_power: 30, max_power: 500
      User request: I want to charge near the Prado Museum, Madrid.I want to charge with a ChargePoint charger. I want to charge fast. I want to charge with a DC charger.
      Your response: `,
      assistant:
  '{ "min_power": 30, "max_power": 500}',
  },
  
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Multiple requests for charging parameters. One is about "ultra-fast charging". Return min_power: 70, max_power: 500
      User request: I want to charge in Brussels. I want to charge at an Allego charger. The charging station should support ultra-fast charging.
      Your response: `,
    assistant:
      '{ "min_power": 70, "max_power": 500}',
  },
  
  {
  projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Multiple requests for charging parameters. None of the requests are related to power. Return null.
      User request: I want to charge in Alcácer do Sal. I will arrive there in about half an hour.
      Your response: `,
      assistant:
  'null',
  },
  
  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Multiple requests for charging parameters. None of the requests are related to power. Return null.
      User request: I want to charge at Restaurante Solar dos Presuntos, Lisbon. I will arrive there tonight.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Multiple requests for charging parameters. None of the requests are related to power. Return null.
      User request: I want to charge in Dortmund. I want to charge at an Allego charge point in the center. I will arrive there in 30 minutes.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Multiple requests for charging parameters. None of the requests are related to power. Return null.
      User request: I want to charge nearby. I will arrive there in 3 hours.
      Your response: `,
    assistant:
      'null',
  },

  {
  projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Multiple requests for charging parameters. None of the requests are related to power. Also not AC charging. Return null.
      User request: I want to charge in Lisbon. I want to charge with an AC charger.
      Your response: `,
      assistant:
  'null',
  },
  
  {
  projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Multiple requests for charging parameters. None of the requests are related to power. Return null.
      User request: I want to charge at a McDonalds near my current location.I want to charge with a DC charger.
      Your response: `,
      assistant:
  'null',
  },

  {
  projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Multiple requests for charging parameters. None of the requests are related to power. Return null.
      User request:  I want to charge in Caldas da Rainha. I will arrive there in 30 minutes. I want to charge with a DC charger.
      Your response: `,
      assistant:
  'null',
  },

  {
  projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Request for charging with a 75kW charger. Set the same kW value for min_power and max_power
      User request:  I want to charge close to the Oslo Opera House, Oslo. The charging station should be a Mer charger. I want to charge with exactly 75kW.
      Your response: `,
      assistant:
  '{"min_power": 75, "max_power": 75}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Multiple requests for charging parameters. None of the requests are related to power. Return null.
      User request: I will arrive there in 35 minutes. I want to charge in Vila Real. I want to charge with CCS connectors.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Multiple requests for charging parameters. None of the requests are related to power. Return null.
      User request: I will arrive there in 30 minutes. I want to charge in Águeda. I want to charge with Type 2 connectors.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge nearby now.\n- The assistant asked the user to provide access to their current location.\n- The user provided their current coordinates: 51.45970344321632 / 7.004971886189722.\n- The assistant recommended charge points.}
  
      # Example description: Request to set the arrival time. No power filter request. Ignore the request and return null.
      User request: I will arrive there in 25 minutes.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge nearby now.\n- The assistant asked the user to provide access to their current location.\n- The user provided their current coordinates: 51.45970344321632 / 7.004971886189722.\n- The assistant recommended charge points.}
  
      # Example description: Request to set the arrival time. No power filter request. Ignore the request and return null.
      User request: I will arrive there in 45 minutes.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Request to set the arrival time and location. No power filter request. Ignore the request and return null.
      User request: I want to charge in Prague. I will arrive there in 45 minutes.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge nearby now.\n- The assistant asked the user to provide access to their current location.\n- The user provided their current coordinates: 51.45970344321632 / 7.004971886189722.\n- The assistant recommended charge points.}
  
      # Example description: Request to set the arrival time. No power filter request. Ignore the request and return null.
      User request: I want to charge now.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Request to set the arrival time. No power filter request. Ignore the request and return null.
      User request: I want to charge now.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Complex request. No power filter request. Ignore the request and return null.
      User request: I want to charge in Bruges. I want to charge with a DC charger. The charging station should be a Fastned charger.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Location request and charging speed request. Set maximum 50kW.
      User request: I want to charge at NorteShopping. I want to charge with maximum 50kW.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 50}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Complex request. No power filter request. Ignore the request and return null.
      User request: I want to charge in Antwerp. The charging station should be a Fastned charger.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Complex request. Request for ultra-fast charging. Ignore the arrival time.
      User request: I want to charge in Ilhavo. I want to charge ultra-fast. I will arrive there in 90 minutes.
      Your response: `,
    assistant:
      '{ "min_power": 70, "max_power": 500 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge near them at a charge point with at least 50kW.\n- The user provided their current coordinates and the corresponding address (Goekenbrede 27, 32791 Lage).\n- The assistant couldn't find any charging stations with at least 50kW around the provided location and suggested trying again at a different place and time.}
  
      # Example description: Refinement request to deactivate the power filter. So reset them to 0 and 500.
      User request: I dont care about the kW value.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 500 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge near them at a charge point with at least 50kW.\n- The user provided their current coordinates and the corresponding address (Goekenbrede 27, 32791 Lage).\n- The assistant couldn't find any charging stations with at least 50kW around the provided location and suggested trying again at a different place and time.}
  
      # Example description: Refinement request to deactivate the power filter. So reset them to 0 and 500.
      User request: I don't care about the kW value. But I want only charge at charge points from the operator Allego.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 500 }',
  }, 


  {
  projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Complex request. Two requests for charging speed. Return the higher value. Set min_power to 70 and max_power to 500.
      User request: I want to charge fast. I want to charge with a HPC charger.
      Your response: `,
      assistant:
  '{ "min_power": 70, "max_power": 500 }',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      # Example description: Complex request. Request for slow charging. Ignore the arrival time.
      User request: I want to charge in Lisbon. I want to charge slowly. The charging station should be a Plugsurfing charger. I will arrive there tonight at 8pm.
      Your response: `,
    assistant:
      '{ "min_power": 0, "max_power": 30 }',
  },
  
  // I want to charge at the Prado Museum, Madrid.I want to charge with a DC charger.The charging station should be an Electra charger.
  // I want to charge in Oslo.The charging station should be a Mer charger.I want to charge with high - speed charging.
  

  
  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: A more general question about electric vehicle charging. Nothing to do, return null! \n    User request: What does kW mean in charging?\n    Your response: ',
    assistant: 'null',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: A more general question about electric vehicle charging. Nothing to do, return null! \n    User request:  What is ultra - fast or rapid charging?\n    Your response: ',
    assistant: 'null',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: A more general question about electric vehicle charging. Nothing to do, return null! \n    User request:  What is slow charging?\n    Your response: ',
    assistant: 'null',
  },

  {
    projectIds: [],
    user: 'Conversation history: {}\n\n    # Example description: A more general question about electric vehicle charging. Nothing to do, return null! \n    User request:  What is fast charging?\n    Your response: ',
    assistant: 'null',
  },
 
];
