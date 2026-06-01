export const addressFewShotExamples = [
  {
    projectIds: [],
    user: `Conversation history: {}
      Conversation history: {}
  
      
# Example description: no address, poi or city mentioned
      User request: Can I find a free charging station?
      Your response: `,
    assistant: 'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Just a city name 🌃
      User request: In Porto.
      Your response: `,
    assistant:
      '{"destination": "Porto"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Specific destination 🌃
      User request: Tonight I want to charge in Bielefeld, close to Detmolder Str. 150.
      Your response: `,
    assistant:
      '{"destination": "Detmolder Str. 150, Bielefeld"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: City information missing for specific place (not in LIST_OF_LOCATIONS) and HPC charging 🏪
      User request: HPC charging at McDonald's
      Your response: `,
    assistant:
      '{"destination": "McDonalds"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: nearby the user location a poi and additional filter 🏪
      User request: HPC charging at a McDonald's nearby.
      Your response: `,
    assistant:
      '{"destination": "McDonalds", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
      User request: I want to charge at my current location. I want to charge at a McDonalds.
      Your response: `,
    assistant:
      '{"destination": "McDonalds", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
      User request: I want to charge at my current location. I want to charge at a museum.
      Your response: `,
    assistant:
      '{"destination": "museum", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
      User request: I want to charge at my current location. I want to charge at a train station.
      Your response: `,
    assistant:
      '{"destination": "train station", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
      User request: I want to charge at a railway station.
      Your response: `,
    assistant:
      '{"destination": "train station, {city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
      User request: I want to charge at my current location. I want to charge at a rest area.
      Your response: `,
    assistant:
      '{"destination": "rest area", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
      User request: I want to charge at my current location. I want to charge at a toilet.
      Your response: `,
    assistant:
      '{"destination": "toilet", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
      User request: I want to charge at a toilet.
      Your response: `,
    assistant:
      '{"destination": "toilet, {city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
      User request: I want to find a toilet.
      Your response: `,
    assistant:
      '{"destination": "toilet, {city}"}',
  },
  
  {
    projectIds: [], 
    user: `Conversation history: {}
      
      User request: I want to charge at my current location. I want to charge at a zoo.
      Your response: `,
    assistant:
      '{"destination": "zoo", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
      User request: I want to charge at central Harlow. I want to charge at a zoo.
      Your response: `,
    assistant:
      '{"destination": "zoo, Harlow, center"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
      User request: I want to charge at central Porto. I want to charge at a museum.
      Your response: `,
    assistant:
      '{"destination": "museum, Porto, center"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: nearby feature triggered by "nearby" 🏪
      User request: Highly rated charging stations nearby.
      Your response: `,
    assistant:
      '{"is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: User already gives a POI. Nearby feature not necessary.
      User request: I'm at Disneyland Paris – where is the nearest EV charger?
      Your response: `,
    assistant:
      '{"destination": "Disneyland Paris"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: nearby feature triggered by "around me" indicating the user location 🏪
      User request: Very fast charging around me.
      Your response: `,
    assistant:
      '{"is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Address information missing for a specific place. "next" here means "nearby" 🏪
      User request: Charging at the next Hofer
      Your response: `,
    assistant:
      '{"destination": "Hofer", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Address information missing for a specific private place that was mentioned. Request {city}!
      User request: at home
      Your response: `,
    assistant:
      '{"destination": "{city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Address information missing for a specific place that was mentioned. Request {city}!
      User request: I want to charge near Monsanto Street
      Your response: `,
    assistant:
      '{"destination": "Monsanto Street, {city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: For famous POI, infer city from your knowledge 🏛️. No nearby requested! Add the inferred city name (Dresden) to destination.
      User request: I want to charge at Semperoper
      Your response: `,
    assistant:
      '{"destination": "Semperoper, Dresden"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: For famous POI, infer city from your knowledge 🏛️. No nearby requested! Add the inferred city name (Berlin) to destination.
      User request: I want to charge near the Brandenburger Tor
      Your response: `,
    assistant:
      '{"destination": "Brandenburger Tor, Berlin"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Request for Berlin main station. 🚉
      User request: I want to charge close to main station, Berlin
      Your response: `,
    assistant:
      '{"destination": "main station, Berlin"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: For famous POI, infer city from your knowledge 🏛️. No nearby requested! You add the inferred city name (Lisbon) to destination.
      User request: Which stations near the Ponte 25 de Abril bridge have at least 4 stars?
      Your response: `,
    assistant:
      '{"destination": "Ponte 25 de Abril, Lisbon"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      
# Example description: For famous POI, infer city from your knowledge 🏛️. No nearby requested! Add the inferred city name (Lisbon) to destination. 
      User request: Which stations are near the Parque Eduardo VII?
      Your response: `,
    assistant:
      '{"destination": "Parque Eduardo VII, Lisbon"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Two cities and a trip are mentioned.
      User request: I want to charge on the trip between Lisbon and Porto
      Your response: `,
    assistant:
      '{"origin": "Lisbon", "destination": "Porto"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Charging 'nearby' or 'close by' 🔋
      User request: I want to charge near me
      Your response: `,
    assistant:
      '{"is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Charging 'nearby' or 'close by' and ultra-fast or HPC charging 🔋
      User request: I want to charge nearby, at a HPC or ultra-fast charger
      Your response: `,
    assistant:
      '{"is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge in Hamburg.\n- The assistant found charge points that match those parameters.}
  
      
# Example description: Charging 'nearby' or 'close by' 🔋
      User request: I want to charge nearby
      Your response: `,
    assistant:
      '{"destination": "", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Request for ultra-fast or HPC charging. Missing address information. Request {city}!
      User request: I want to charge at a HPC or ultra-fast charger
      Your response: `,
    assistant:
      '{"destination": "{city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge nearby.\n- The assistant found charge points that match those parameters.}
  
      
# Example description: You ignore nearby requests from conversation history and only process the current user request 🔋 center of Lisbon requested, beware the ',' separation in destination of the assistant response.
      User request: I want to charge at a supermarket in Lisbon, center.
      Your response: `,
    assistant:
      '{"destination": "Lisbon, center"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at a supermarket close to her.\n- The assistant found charge points that match those parameters.}
  
      
# Example description: You ignore nearby requests from conversation history and only process the current user request 🔋
      User request: I want to charge at Rahestr. 35, Lengerich.
      Your response: `,
    assistant:
      '{"destination": "Rahestr. 35, Lengerich"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Charging 'near' a POI does not trigger the nearby feature 🔋
      User request: In Alagoas near a supermarket.
      Your response: `,
    assistant:
      '{"destination": "Alagoas"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Charging 'closest to' a location does not trigger the nearby feature 🔋
      User request: I want to charge in Estarreja. What are the closest chargers?
      Your response: `,
    assistant:
      '{"destination": "Estarreja"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Charging 'near' a location does not trigger the nearby feature 🔋
      User request: I want to charge near NorteShopping at a station up to 50kW
      Your response: `,
    assistant:
      '{"destination": "NorteShopping, {city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: request for 'workshop' is in LIST_OF_LOCATIONS 🏪. Do not put it in "destination".
      User request: Show me only workshops.
      Your response: `,
    assistant: 'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Requesting to charge in a city and other filters are set 🏛️
      User request: In Munich, but I forgot my ekey charging card
      Your response: `,
    assistant:
      '{"destination": "Munich"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: request for a highway service station with a highway name and city name included. You include the keyword "highway" to trigger a highway search.
      User request: I want to find fast charging stations at a highway service station on the A1 to Porto
      Your response: `,
    assistant:
      '{"destination": "A1 highway, Porto"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: request for a highway and a fast charger. You include the keyword "highway" to trigger a highway search. No need to add "fast" to destination.
      User request: I want to charge at the A3 fast!
      Your response: `,
    assistant:
      '{"destination": "A3 highway"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: request for a highway without any other indicator. You include the keyword "highway" to trigger a highway search.
      User request: I want to charge on the A29.
      Your response: `,
    assistant:
      '{"destination": "A29 highway"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: request a charge point on my way to a city while setting other filters
      User request: Can I charge with 150kw on the way to the Algarve coming from Lisbon?
      Your response: `,
    assistant:
      '{"origin": "Lisbon", "destination": "Algarve"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: POI restaurant search request with a city name 🍕
      User request: Pizza-Restaurant, Oldenburg
      Your response: `,
    assistant:
      '{"destination": "Oldenburg"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: a type of location is requested but no address mentioned. nothing to do here but respond with null.
      User request: I want to charge at a supermarket
      Your response: `,
    assistant: 'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Any POI in a city 🔋
      User request: I want to charge at a shopping center in Norwich. Location request for specific LOCATION_TYPE, like shopping center, is not necessary.
      Your response: `,
    assistant:
      '{"destination": "Norwich"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Any cardinal direction of city. 'near' a location does not trigger the nearby feature. Put the city name and cardinal direction into destination 🌃
      User request: I want to charge near North of Berlin.
      Your response: `,
    assistant:
      '{"destination": "Berlin, north"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: Traveling east from Dunkirk. Where's the best place to charge?
      Your response: `,
    assistant:
      '{"destination": "Dunkirk, east"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: "northern suburbs" is simply another way of requesting a cardinal direction in a city. 🌃
      User request: I want to charge ultra-fast. I want to charge near Pizza Hut in northern suburbs of Calle de Felipe II, Madrid.
      Your response: `,
    assistant:
      '{"destination": "Pizza Hut, Calle de Felipe II, Madrid, north"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: "southern suburbs" is simply another way of requesting a cardinal direction in a city. 🌃
      User request: I want to charge ultra-fast. I want to charge near McDonalds in the southern suburbs of Clifden.
      Your response: `,
    assistant:
      '{"destination": "McDonalds, Clifden, south"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: "northern suburbs" is simply another way of requesting a cardinal direction in a city. 🌃
      User request: I want to charge fast. I want to charge at Burger King in the northern suburbs of Göttingen.
      Your response: `,
    assistant:
      '{"destination": "Burger King, Göttingen, north"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Portuguese abbreviation for charging speed and city name mentioned
      User request: PCR in Lisbon
      Your response: `,
    assistant:
      '{"destination": "Lisbon"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: No request for covered services in this request
      User request: What can you do for me?
      Your response: `,
    assistant: 'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
# Example description: trip from a city to another city.
      User request: I want to charge on the way from Hamburg to Berlin
      Your response: `,
    assistant: '{"origin": "Hamburg", "destination": "Berlin"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested assistance in planning multiple charging stops on their way to Berlin.
- The assistant informed the user that it cannot plan an entire route with multiple stops but can help find the next possible charging station along their route.
- The user requested help in finding a single charging stop along their route.}
  
      User request: I want to charge in Berlin
      Your response: `,
    assistant: '{"origin": "{is_nearby}", "destination": "Berlin"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: No request for covered services in this request
      User request: Please, turn on the radio!
      Your response: `,
    assistant: 'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: No request for covered services in this request
      User request: Reset all filters.
      Your response: `,
    assistant: 'null',
  },

  // filter deactivation examples
  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: deactivation of a specific filter is requested, but that filter is not part of your functionality, hence you will return null.
      User request: deactivate the free charging filter.
      Your response: `,
    assistant: 'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: reset of all filters and setting other filter again
      User request: no that is wrong, I only want free charging.
      Your response: `,
    assistant: '{ "destination": "", "is_nearby_requested": false, "is_location_confirmed": false, "is_location_blocked": false}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: request for reset of all filters, triggered by "that is all wrong". Return empty destination, and deactivated is_nearby_requested, is_location_confirmed and is_location_blocked to deactivate all filters you are responsible for.
      User request: no that is all wrong, I only want to charge at public chargers.
      Your response: `,
    assistant:
      '{ "destination": "", "is_nearby_requested": false, "is_location_confirmed": false, "is_location_blocked": false}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge for free.\n- The assistant found charge points that match those parameters.}
  
      
# Example description: request for a reset of all filters, except for the location, which is to be set to the city name "Lisbon". Return "Lisbon" in destination, and deactivated is_nearby_requested, is_location_confirmed and is_location_blocked to deactivate all filters you are responsible for.
      User request: No filters in Lisbon.
      Your response: `,
    assistant:
      '{"destination": "Lisbon", "is_nearby_requested": false, "is_location_confirmed": false, "is_location_blocked": false}',
  },

  {
    projectIds: [],
    user: ` Conversation history: {}
  
      
# Example description: Deny the country request
      User request: I want to charge in Portugal.
      Your response: `,
    assistant: 'null',
  },

  {
    projectIds: [],
    user: ` Conversation history: {}
  
      User request: I want to charge in Bielefeld.
      Your response: `,
    assistant: '{"destination": "Bielefeld"}',
  },

  {
    projectIds: [],
    user: ` Conversation history: {}
  
      User request: I want to charge in Porto.
      Your response: `,
    assistant: '{"destination": "Porto"}',
  },

  {
    projectIds: [],
    user: ` Conversation history: {}
  
      User request: I want to charge in Lisbon.
      Your response: `,
    assistant: '{"destination": "Lisbon"}',
  },

  {
    projectIds: [],
    user: ` Conversation history: {}
  
      User request: I want to charge in Prague.
      Your response: `,
    assistant: '{"destination": "Prague"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Deny the country request
      User request: I want to charge in the west of Spain.
      Your response: `,
    assistant: 'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Cardinal direction and POI and city mentioned
      User request: Southwest of London at a KFC.
      Your response: `,
    assistant:
      '{"destination": "KFC, London, southwest"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Cardinal direction and POI and city mentioned
      User request: hotel in west of Frankfurt.
      Your response: `,
    assistant:
      '{"destination": "Hotel, Frankfurt, west"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Cardinal direction and POI and city mentioned
      User request: museum in central Paris
      Your response: `,
    assistant:
      '{"destination": "museum, Paris, center"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: "southern districts" is simply another way of requesting a cardinal direction in a city. 
      User request: Southern districts of Lancaster.
      Your response: `,
    assistant:
      '{"destination": "Lancaster, south"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Deny the country request
      User request: Chargers in the north of Belgium.
      Your response: `,
    assistant: 'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: deny the country request
      User request: I want to charge in northern Germany.
      Your response: `,
    assistant: 'null',
  },

  {
    projectIds: ['filters'],
    user: `Conversation history: {}
  
        
# Example description: Ionity is a charge point operator. No request for covered services in this request
        User request: "I want to charge at an IONITY charge point."
        Your response:
        `,
    assistant: 'null',
  },

  {
    projectIds: ['filters'],
    user: `Conversation history: {- The user wanted to charge in London, center.\n- The assistant showed charge points that match those parameters.}
  
        
# Example description: Previously the user wanted to charge in London, center. But now the request is only about setting other filters than what you are responsible for. Nothing to do for you here. Return null!
        User request: Now show me only IONITY charge points.
        Your response:
        `,
    assistant: 'null',
  },


  {
    projectIds: [],
    user: `Conversation history: {}
  
        
# Example description: User request to charge nearby. It should be an IONITY charge point. operator_name is covered by another request identifier.
        User request: I want to charge at IONITY charge point nearby.
        Your response:
        `,
    assistant: '{"is_nearby_requested": true}',
  },


  {
    projectIds: [],
    user: `Conversation history: {}
  
        
# Example description: User request to charge in Porto. It should be an IONITY charge point. operator_name is covered by another request identifier.
        User request: I want to charge at IONITY charge point in Porto.
        Your response:
        `,
    assistant: '{"destination": "Porto"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: take note! if the request mentions "near" a location does not trigger the nearby feature 🔋
      User request: Show me charging points near Coimbra, Portugal
      Your response: `,
    assistant:
      '{"destination": "Coimbra, Portugal"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: take note! if the request mentions "near" a location does not trigger the nearby feature 🔋
      User request: Near Ceira in Coimbra
      Your response: `,
    assistant:
      '{"destination": "Ceira, Coimbra"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: no nearby request. Also "my house" is too unspecific. You request the city name.
      User request: I want to charge near my house
      Your response: `,
    assistant:
      '{"destination": "{city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: "near" a location does not trigger the nearby feature 🔋 
      User request: I want to charge near Aveiro.
      Your response: `,
    assistant:
      '{"destination": "Aveiro"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: auto-charging filter and a location
      User request: Show only self-charging charging points in Setúbal.
      Your response: `,
    assistant:
      '{"destination": "Setúbal"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: tariff filter request in city
      User request: Where is the station with price per kWh in Braga?
      Your response: `,
    assistant:
      '{"destination": "Braga"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: "nearest" a location does not trigger the nearby feature 🔋
      User request: Nearest charging point Aveiro
      Your response: `,
    assistant:
      '{"destination": "Aveiro"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: location and DC charger request, "DC" is ignored, except for "Washington DC" 🔋
      User request: In Braga in DC
      Your response: `,
    assistant:
      '{"destination": "Braga"}',
  },

  // highway requests
  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: highway request with a highway name and country name included. You include the keyword "highway" to trigger a highway search.
      User request: I want to charge on the A1 in Portugal.
      Your response: `,
    assistant:
      '{"destination": "A1 highway, Portugal"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: highway request with a highway name and city name included. Include "highway" to trigger a highway search.
      User request: At the A9 in Ingolstadt.
      Your response: `,
    assistant:
      '{"destination": "A9 highway, Ingolstadt"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: highway request with a highway name and some other filter. Include "highway" to trigger a highway search.
      User request: On the A9, ultra-fast charging
      Your response: `,
    assistant:
      '{"destination": "A9 highway"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: highway request with a city name included and some other filter
      User request: At the highway in Ingolstadt, near a motorway service station
      Your response: `,
    assistant:
      '{"destination": "highway, Ingolstadt"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: the user requested a motorway near a city name. You replace "motorway" with "highway" to trigger a highway search.
      User request: By the motorway near Ingolstadt
      Your response: `,
    assistant:
      '{"destination": "highway, Ingolstadt"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: the user requested a freeway by specific name and requested it to be near a city name. You replace "freeway" with "highway" to trigger a highway search and include the city name in the destination.
      User request: At the A1 freeway near Lengerich, Germany
      Your response: `,
    assistant:
      '{"destination": "A1 highway, Lengerich, Germany"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: the user requested an expressway near a city name. You replace "expressway" with "highway" and the city name to trigger a highway search near hannover.
      User request: At the expressway near Hannover
      Your response: `,
    assistant:
      '{"destination": "highway, Hannover"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: the user requested an interstate near her location. You replace "interstate" with "highway" to trigger a highway search and enable the nearby request.
      User request: On the interstate near my location.
      Your response: `,
    assistant:
      '{"destination": "highway", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: POI + nearby request
      User request: At a Burger King nearby.
      Your response: `,
    assistant:
      '{"destination": "Burger King", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: POI + nearby request in multiple sentences.
      User request: I want to charge at an Edeka supermarket. Show me chargers near my current location.
      Your response: `,
    assistant:
      '{"destination": "Edeka", "is_nearby_requested": true}',
  },


  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: location + nearby request, setting the name of the supermarket ("Lidl") as destination and in addition enabling is_nearby_requested.
      User request: At the next Lidl around me.
      Your response: `,
    assistant:
      '{"destination": "Lidl", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Request for charge point operator and location. Ignore charge point operator.
      User request: Locate a BP Pulse charging station in Berlin for tomorrow morning.
      Your response: `,
    assistant:
      '{"destination": "Berlin"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Request for charge point operator and nearby location. Ignore charge point operator.
      User request: Find a Plugsurfing charger near me that supports overnight charging.
      Your response: `,
    assistant:
      '{"is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}

    # Example description: request to charge overnight without specifying a location. Request {city}!
      User request: I want to charge overnight.
      Your response: `,
    assistant:
      '{"destination": "{city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: location POI request, setting the name of the supermarket ("Aldi"), location information missing. Request {city}!
      User request: At the next Aldi.
      Your response: `,
    assistant:
      '{"destination": "Aldi, {city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: a simple nearby request
      User request: Fast charging around me.
      Your response: `,
    assistant:
      '{"is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: cardinal direction of city requested. ignore additional naming of cardinal direction
      User request: I want to charge in the northern outskirts of Poitiers.
      Your response: `,
    assistant:
      '{"destination": "Poitiers, north"}',
  },
  
  
  {
    projectIds: [],
    user: `Conversation history: {}
  
# Example description: charge point operator and location request. Ignore charge point operator.
      User request: I want to charge at a Stadtwerke München charge point. The charging point should be near Esswurmstraße in Munich.
      Your response: `,
    assistant:
      '{"destination": "Esswurmstraße, Munich"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: POI + nearby request "near me"
      User request: Near me at a Starbucks.
      Your response: `,
    assistant:
      '{"destination": "Starbucks", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: POI + nearby request
      User request: Find a Dunkin' Donuts with charge points nearby.
      Your response: `,
    assistant:
      '{"destination": "Dunkin\' Donuts", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}

    # Example description: charging duration request. No location information. Request {city}!
      User request: Can I charge for 30 minutes?
      Your response: `,
    assistant:
      '{"destination": "{city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user wanted to charge at a McDonalds with unspecified city.\n - The assistant asked the user to specify the city\n- The next agent can expect the user to provide the city name in which the McDonalds restaurant is in.}
  
      
# Example description: You combine the user provided city name from the user response with the POI name, i.e., "McDonalds, Münster". Also, you set the location as confirmed. No nearby requested!
      User request: I want to charge in Münster
      Your response: `,
    assistant:
      '{"destination": "McDonalds, Münster", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to eat and charge at a Thai restaurant.\n- The assistant asked the user for the city where the Thai restaurant is located.}
  
      
# Example description: You combine the user provided city name from the user response with the POI name, i.e., "Thai restaurant, Berlin". Also, you set the location as confirmed. No nearby requested!
      User request: I want to charge in Berlin
      Your response: `,
    assistant:
      '{"destination": "Thai restaurant, Berlin", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to eat and charge at a pizza restaurant.\n- The assistant asked the user for the city where the pizza restaurant is located.}
  
      
# Example description: You combine the user provided city name from the user response with the POI name, i.e., "pizza restaurant, Porto". Also, you set the location as confirmed. No nearby requested!
      User request: I want to charge in Porto
      Your response: `,
    assistant:
      '{"destination": "pizza restaurant, Porto", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested information about a pizzeria.\n- The assistant asked the user to specify the city where they are looking for an Italian restaurant.}
  
      
# Example description: You combine the user provided city name from the user response with the POI name, i.e., "italian restaurant, Berlin". Also, you set the location as confirmed. No nearby requested!
      User request: I want to charge in Berlin
      Your response: `,
    assistant:
      '{"destination": "italian restaurant, Berlin", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested information about a pizzeria.}
  
      User request: I want to charge at an italian restaurant.
      Your response: `,
    assistant:
      '{"destination": "italian restaurant, {city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: I want to charge at a toilet. I want to charge with a rapid charger.
      Your response: `,
    assistant:
      '{"destination": "toilet, {city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: I want to charge at a museum. I want to charge with a rapid charger.
      Your response: `,
    assistant:
      '{"destination": "museum, {city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      User request: I want to charge in Sens. I want to charge slow. I want to charge at a shop.
      Your response: `,
    assistant:
      '{"destination": "shop, Sens"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested information about a pizzeria.\n- The assistant asked the user to specify the city where they are looking for an Italian restaurant.}
  
      
# Example description: You combine the user provided city name from the user response with the POI name, i.e., "italian restaurant, Berlin". Also, you set the location as confirmed. No nearby requested!
      User request: I want to charge in Berlin
      Your response: `,
    assistant:
      '{"destination": "italian restaurant, Berlin", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to eat and charge at a greek restaurant.\n- The assistant asked the user for the city where the greek restaurant is located.}
  
      
# Example description: You combine the user provided city name from the user response with the POI name, i.e., "greek restaurant, Prague". Also, you set the location as confirmed. No nearby requested!
      User request: I want to charge in Prague
      Your response: `,
    assistant:
      '{"destination": "greek restaurant, Prague", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to eat and charge at a italian restaurant.\n- The assistant asked the user for the city where the italian restaurant is located.}
  
      
# Example description: You combine the user provided city name from the user response with the POI name, i.e., "italian restaurant, Parma". Also, you set the location as confirmed. No nearby requested!
      User request: I want to charge in Parma
      Your response: `,
    assistant:
      '{"destination": "italian restaurant, Parma", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to eat and charge at a portuguese restaurant.\n- The assistant asked the user for the city where the portuguese restaurant is located.}
  
      
# Example description: You combine the user provided city name from the user response with the POI name, i.e., "portuguese restaurant, Lisbon". Also, you set the location as confirmed. No nearby requested!
      User request: I want to charge in Lisbon
      Your response: `,
    assistant:
      '{"destination": "portuguese restaurant, Lisbon", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user wanted to charge at a Rewe supermarket with unspecified city.\n - The assistant asked the user to specify the city\n- The next agent can expect the user to provide the city name in which the Rewe supermarket is in.}
  
      
# Example description: You combine the user provided city name from the user response with the POI name to "Rewe, Berlin". Also, you set the location as confirmed. No nearby requested!
      User request: I want to charge in Berlin
      Your response: `,
    assistant:
      '{"destination": "Rewe, Berlin", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}

    # Example description: Restaurant name and city location request
      User request: I want to charge at Restaurante Loco, Lisbon.
      Your response: `,
    assistant:
      '{"destination": "Restaurante Loco, Lisbon"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user wants to charge at the main station in Bielefeld\n- The assistant found charge points that match those parameters.}
      
# Example description: You replace the POI in the previous request (main station) with the new POI (Edeka) and keep the city name (Bielefeld) => "Rewe, Bielefeld". DO NOT use the {city} keyword!
      User request: I want to charge near Edeka instead.
      Your response: `,
    assistant:
      '{"destination": "Edeka, Bielefeld", "is_location_confirmed": true}',
  },

  // confirmation requested
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at Paris, center.\n- The assistant requested the user to confirm the address: Paris, center.}
  
      
# Example description: CONFIRMATION requested and given. you set is_location_confirmed to true and you repeat the location in the destination field.
      User request: Yes!
      Your response: `,
    assistant:
      '{"destination": "Paris, center", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at Bielefeld, Bahnhof.\n- The assistant requested the user to confirm the address: main station, Bielefeld.}
  
      
# Example description: CONFIRMATION requested and given. you set is_location_confirmed to true and you repeat the location in the destination field.
      User request: Yes!
      Your response: `,
    assistant:
      '{"destination": "main station, Bielefeld", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at Rue bla, Lisbon.\n- The assistant requested the user to confirm the address: Rue bla, Lisbon.}
  
      
# Example description: CONFIRMATION requested and given. you set is_location_confirmed to true and you repeat the location in the destination field.
      User request: Yes, I want to charge at Rue bla, Lisbon.
      Your response: `,
    assistant:
      '{"destination": "Rue bla, Lisbon", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at Berlin, museum of art.\n- The assistant requested the user to confirm the address: Berlin, museum of art.\n- The user disconfirmed the address.\n- The assistant requested a new address from the user.}
  
      
# Example description: CONFIRMATION requested for a specific place. Disconfirmed with new location. So, we simply change the location.
      User request: I want to charge at the Eiffel Tower.
      Your response: `,
    assistant:
      '{"destination": "Eiffel Tower, Paris"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at Berlin, museum of art.\n- The assistant found charge points.}
  
      
# Example description: Request to change location. So, we simply change the location.
      User request: I want to change my location to McDonald's in Essen.
      Your response: `,
    assistant:
      '{"destination": "McDonalds, Essen"}',
  },

  

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at main station, Porto.\n- The assistant requested the user to confirm the address: mains tation, Porto.}
  
      
# Example description: CONFIRMATION requested and denied. You need to ask for a new location. Set destination to "{city}" to trigger a request for a new location. Set is_location_confirmed to false.
      User request: No
      Your response: `,
    assistant:
      '{"is_location_blocked": true, "is_location_confirmed": false}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at Rewe in Bielefeld.\n- The assistant requested the user to confirm the address: Rewe Babenhausen, Bielefeld.}
  
      
# Example description: Wrong location found. NO CONFIRMATION. Ask for a new location, by adding "{city}" to the address. Block that location.
      User request: No that is the wrong Rewe.
      Your response: `,
    assistant:
      '{"is_location_blocked": true, "is_location_confirmed": false}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: request for help find a charge point, and also a location is provided. Let's help that user!
      User request: I'm east of Wakefield and running low on battery. Help!
      Your response: `,
    assistant:
      '{"destination": "Wakefield, east"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Supermarket in Espinho
      User request: I want to charge in Espinho at a quick charge point near a supermarket
      Your response: `,
    assistant:
      '{"destination": "Espinho"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: "In Lisboa near a supermarket" does not trigger nearby
      User request: In Lisboa near a supermarket
      Your response: `,
    assistant:
      '{"destination": "Lisboa"}',
  },

  // decision requested for location option
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to see chargers in Wolfhausen. - The assistant provided different location options to choose from: 1.) Wolfhausen, Bubikon, 2.) Wolfhausen, Teisendorf, 3.) Wolfhausen, Tacherting.}
      
      
# Example description: First option SELECTED. Respond with that option in destination and is_location_confirmed to true. is_location_confirmed very important after user select the location.
      User request: The first option!
      Your response: `,
    assistant:
      '{"destination": "Wolfhausen, Bubikon", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge in Barcelona. - The assistant provided different location options to choose from: 1.) Barcelona, or 2.) Barcelona, Looe, Cornwall.}
      
      
# Example description: First option SELECTED. Respond with that option in destination and is_location_confirmed to true. is_location_confirmed very important after user select the location.
      User request: 1!
      Your response: `,
    assistant:
      '{"destination": "Barcelona", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to see chargers in Viseu with physical key. - The assistant provided different location options to choose from: 1.) Viseu, 2.) Viseu, Muxía, Corunha}
      
      
# Example description: Second option SELECTED. Respond with that option in destination and is_location_confirmed to true. 
      User request: Number 1!
      Your response: `,
    assistant:
      '{"destination": "Viseu", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to see chargers at a McDonalds in Essen. - The assistant provided different location options to choose from: 1.) McDonalds, Am Hauptbahnhof, Essen 2.) McDonalds, Karnaper Straße, Essen, 3.) McDonalds, Ruhrbruchshof, Essen.}
      
      
# Example description: User does not care which option to SELECT. You make a random decision out of the given options! Respond with that option in  destination field and set is_location_confirmed to true.
      User request: Any one of those!
      Your response: `,
    assistant:
      '{"destination": "McDonalds, Am Hauptbahnhof, Essen", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to see chargers at a McDonalds in Essen. - The assistant provided different location options to choose from: 1.) McDonalds, Am Hauptbahnhof, Essen 2.) McDonalds, Karnaper Straße, Essen, 3.) McDonalds, Ruhrbruchshof, Essen.}
      
      
# Example description: User does not care which option to SELECT. You make a random decision out of the given options!Respond with that option in  destination field and set is_location_confirmed to true.
      User request: Any of those
      Your response: `,
    assistant:
      '{"destination": "McDonalds, Ruhrbruchshof, Essen", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to see chargers at a McDonalds in Essen. - The assistant provided different location options to choose from: 1.) McDonalds, Am Hauptbahnhof, Essen 2.) McDonalds, Karnaper Straße, Essen, 3.) McDonalds, Ruhrbruchshof, Essen.}
      
      
# Example description: User does not care which option to SELECT. You make a random decision out of the given options! Respond with that option in  destination field and set is_location_confirmed to true.
      User request: I don't care!
      Your response: `,
    assistant:
      '{"destination": "McDonalds, Ruhrbruchshof, Essen", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to see chargers at a Burger King nearby. - The assistant provided different location options to choose from: 1.) Burger King, Am Hauptbahnhof, Essen 2.) Burger King, Karnaper Straße, Essen, 3.) Burger King, Ruhrbruchshof, Essen.}
      
      
# Example description:  User does not care which option to SELECT. You make a random decision out of the given options! Respond with that option in destination field and set is_location_confirmed to true.
      User request: Any Burger King is fine!
      Your response: `,
    assistant:
      '{"destination": "Burger King, Am Hauptbahnhof, Essen", "is_location_confirmed": true}',
  },

  // block location

  {
    projectIds: [],
    user: `Conversation history: {- The user requested a charge point at a McDonalds in Berlin Mitte, after which the assistant presented a location to the user.}

      
# Example description: The user blocked a location that was previously presented. Saying "not this one".

      User request: No, not this one.
      Your response: `,
    assistant:
      '{"is_location_blocked": true}'
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested a charge point at a McDonalds in Berlin Mitte, after which the assistant presented a location to the user.}

      
# Example description: The user blocked a location that was previously presented. 

      User request: I want to charge at a different location.
      Your response: `,
    assistant:
      '{"is_location_blocked": true}'
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested a charge point at a McDonalds in Berlin Mitte, after which the assistant presented a location to the user.}

      
# Example description: The user blocked a location that was previously presented. Saying "not there".

      User request: Not there.
      Your response: `,
    assistant:
      '{"is_location_blocked": true}'
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested a charge point at a McDonalds in Berlin Mitte, after which the assistant presented a location to the user.}

      
# Example description: The user blocked a location that was previously presented. Saying "not quite".

      User request: Not quite.
      Your response: `,
    assistant:
      '{"is_location_blocked": true}'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested a charge point in Lengerich, after which the assistant presented a location to the user.}

      
# Example description: The user blocked a location that was previously presented. Saying "I don't want that location".

      User request: I don't want to charge at that location.
      Your response: `,
    assistant:
      '{"is_location_blocked": true}'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested a charge at a Museum close to them, after which the assistant presented a location to the user.}

      
# Example description: The user blocked a location that was previously presented. Requesting "another" location, referring to the previous location search. So do not change that but just block the previous location.

      User request: At another museum.
      Your response: `,
    assistant:
      '{"is_location_blocked": true}'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested a charge at a Park in Lisbon, after which the assistant presented a location to the user.}

      
# Example description: The user blocked a location that was previously presented. Saying "next option".

      User request: No, please show me the next option.
      Your response: `,
    assistant:
      '{"is_location_blocked": true}'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user specified their location as Rüttenscheid in Essen.
- The assistant provided location options and asked which one the user meant: 1.) Rüttenscheid, 45 Essen-Stadtbezirke II, Germany, or 2.) Rüttenscheider Stern, 45130 Essen-Stadtbezirke II, Germany.
- The user selected Option 1.
- The assistant is now looking for available charge points in that location}

      
# Example description: The user wants a different charging station shown after all.

      User request: Show me other charging stations.
      Your response: `,
    assistant:
      '{"is_location_blocked": true}'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user specified their location as Rüttenscheid in Essen.
- The assistant provided location options and asked which one the user meant: 1.) Rüttenscheid, 45 Essen-Stadtbezirke II, Germany, or 2.) Rüttenscheider Stern, 45130 Essen-Stadtbezirke II, Germany.
- The user selected Option 1.
- The assistant is now looking for available charge points in that location}

      
# Example description: The user wants a different charging station shown after all.

      User request: Are there others?
      Your response: `,
    assistant:
      '{"is_location_blocked": true}'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user specified their location as Rüttenscheid in Essen.
- The assistant provided location options and asked which one the user meant: 1.) Rüttenscheid, 45 Essen-Stadtbezirke II, Germany, or 2.) Rüttenscheider Stern, 45130 Essen-Stadtbezirke II, Germany.
- The user selected Option 1.
- The assistant is now looking for available charge points in that location}

      
# Example description: The user wants a different charging station shown after all.

      User request: Show different ones.
      Your response: `,
    assistant:
      '{"is_location_blocked": true}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      
# Example description: The user requested to charge at a museum in Lisbon. Put singular "museum" into the destination, as this is a general request for a museum.

      User request: Museum in Lisbon.
      Your response: `,
    assistant:
      '{"destination": "museum, Lisbon"}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      
# Example description: Ultra-fast charging with physical card in Lisbon

      User request: Ultra-fast chargers in Lisbon using a physical card
      Your response: `,
    assistant:
      '{"destination": "Lisbon"}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      
# Example description: Ignore everything in the user request except the location. Ignore the "fast charging station" bit. That is handled by other request identifiers.

      User request: At a fast charging station in Essen
      Your response: `,
    assistant:
      '{"destination": "Essen"}'
  },


  {
    projectIds: [],
    user: `Conversation history: {}

      
# Example description: Ignore everything in the user request except the location. Ignore the "EWE charger" bit. That is handled by other request identifiers.

      User request: At an EWE charger around me.
      Your response: `,
    assistant:
      '{"destination": "", "is_nearby_requested": true}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      
# Example description: Ignore everything in the user request except the location. Ignore the "IONITY charge points" bit. That is handled by other request identifiers.

      User request: At IONITY charge points charger around me.
      Your response: `,
    assistant:
      '{"destination": "", "is_nearby_requested": true}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      
# Example description: Ignore everything in the user request except the location. Ignore the "Westnetz charging point" bit. That is handled by other request identifiers.

      User request: I want to charge at a Westnetz charging point nearby.
      Your response: `,
    assistant:
      '{"destination": "", "is_nearby_requested": true}'
  },


  {
    projectIds: [],
    user: `Conversation history: {}

      
# Example description: Ignore everything in the user request except the location. Ignore the "EWE charger" bit. That is handled by other request identifiers.

      User request: At an EWE charger in Bielefeld
      Your response: `,
    assistant:
      '{"destination": "Bielefeld"}'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge near their location, resulting in destination = "Hauptbahnhof, Essen".\n- The user then requested to charge at Paris, midtown.\n- The assistant showed a number of results that match the user's request.\n}

      
# Example description: The user wants to charge in Paris midtown (translates to Paris, center) instead of the previously mentioned location. Ignore the previous destination

      User request: I want to charge in Paris midtown instead.
      Your response: `,
    assistant:
      '{"destination": "Paris, center"}'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge in London, resulting in destination = "London".\n- The assistant showed a number of results that match the user's request.\n- The user then requested to charge near their current location.}

      
# Example description: After requesting to charge at an explicit location, the user requests to charge near their current location. The assistant should ignore the previous location. 

      User request: I want to charge near my location instead.
      Your response: `,
    assistant:
      '{"destination": "", "is_nearby_requested": true}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      
# Example description: Central London requested, central translates to center.

      User request: I want to charge in central London.
      Your response: `,
    assistant:
      '{"destination": "London, center"}'
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user then requested to charge at Paris, midtown.\n- The assistant showed a number of results that match the user's request.\n- The user then requested to charge near their location instead.}

      
# Example description: The user wants to charge near their location instead of the previous location

      User request: charge nearby instead.
      Your response: `,
    assistant:
      '{"destination": "", "is_nearby_requested": true}'
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: The user wants to charge at a specific museum. No request for charging points near the user's location. Nearby feature not necessary.
      User request: I would like to charge near the National Tile Museum.
      Your response: `,
    assistant:
      '{"destination": "National Tile Museum, {city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: The user wants to charge at a supermarket or highway. Both are processed by another request identifier. Nothing to do here. No nearby feature requested. Return null!
      User request: I want to charge near a supermarket or highway
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: The user wants to charge at a free charging station at Aveiro. No nearby feature requested.
      User request: I want to charge at a free station near Aveiro.
      Your response: `,
    assistant:
      '{"destination": "Aveiro"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: The user wants to charge east of Galway. No nearby feature requested.
      User request: I'm traveling to the east of Galway. Where is the nearest charging point located?
      Your response: `,
    assistant:
      '{"destination": "Galway, east"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: Assume charging for the below request.
      User request: I want to do this in Munich
      Your response: `,
    assistant:
      '{"destination": "Munich"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: The user wants to charge south of Rennes. No nearby feature requested.
      User request: Driving south of Rennes. Where is the nearest place to charge?
      Your response: `,
    assistant:
      '{"destination": "Rennes, south"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: The user wants to charge south of Lisbon. No nearby feature requested.
      User request: I want to charge in the south of Lisbon.
      Your response: `,
    assistant:
      '{"destination": "Lisbon, south"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: The user wants to charge at a Restaurant in Lisbon. First extract city names, then extract location names. Restaurant is not a location names. Ignore location without names from destination.
      User request: Take me to a restaurant in Lisbon.
      Your response: `,
    assistant:
      '{"destination": "Lisbon"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: The user wants to charge at a McDonalds, without mentioning a city. Request more specific information about the location, like the city name.
      User request: I want to charge at McDonalds.
      Your response: `,
    assistant:
      '{"destination": "McDonalds, {city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: The user wants to charge at a restaurant. Location information is missing. Request {city} information.
      User request: I want to charge at a restaurant.
      Your response: `,
    assistant:
      '{"destination": "{city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at McDonalds restaurant without providing the city name. - The assistant asked the user for the city name.}
  
      
# Example description: The user wants to charge at a McDonalds around the current location. 
      User request: Near me.
      Your response: `,
    assistant:
      '{"destination": "McDonalds", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at McDonalds restaurant without providing the city name. - The assistant asked the user for the city name.}
  
      
# Example description: The user answers the assistant's question by providing the city name.
      User request: I want to charge in Essen.
      Your response: `,
    assistant:
      '{"destination": "McDonalds, Essen"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
  
      
# Example description: The user requested a charger close to an address. Also mentions a connector type.
      User request: I want to charge close to Düsseldorf main station. The charger should have a Type-2 connector.
      Your response: `,
    assistant:
      '{"destination": "main station, Düsseldorf"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: The user requested a charger close the user location ("my location"). Also mentions a connector type.
      User request: I want to charge near my location. The charger should have a CCS connector.
      Your response: `,
    assistant:
      '{"is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: The user requested a charger close to a POI. Also mentions a connector type.
      User request: I want to charge close "Brandenburger Tor". The charger should have a Chademo connector.
      Your response: `,
    assistant:
      '{"destination": "Brandenburger Tor, Berlin"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: The user requested a near a POI. Also mentions a connector type. Does not trigger the nearby feature.
      User request:   I want to charge near the Acropolis of Athens. I want to charge with CCS connectors.
      Your response: `,
    assistant:
      '{"destination": "Acropolis of Athens"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: The user requested to plan a trip/route from their location to another location. 
      User request: I want to go from my location to the Acropolis of Athens.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Acropolis of Athens", "is_nearby_requested": false}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: The user requested to plan a trip/route from their location to another location. 
      User request: I want to charge on my way to Prague.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Prague", "is_nearby_requested": false}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: The user requested to plan a trip/route from their location to another location. 
      User request: I want to charge on the way from my location to Bielefeld.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Bielefeld", "is_nearby_requested": false}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: The user requested to plan a trip/route from their location to another location. 
      User request: I want to charge on the way from my location to Osnabrück.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Osnabrück", "is_nearby_requested": false}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: The user requested to plan a trip/route from their location to another location. Not destination city information provided. Request {city}!
      User request: I want to charge on the way from my location to the next main station.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "main station, {city}", "is_nearby_requested": false}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: The user requested to charge at the highway close to a city.
      User request: I want to charge at the A8 highway, Stuttgart.
      Your response: `,
    assistant:
      '{"destination": "A8 highway, Stuttgart"}',
  },
  

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: The user requested to plan a trip/route from their location to another location. 
      User request: I want to charge on my way to Osnabrück.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Osnabrück", "is_nearby_requested": false}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at main station, Prague.\n- The assistant showed a number of results that match the user's request.}
      
# Example description: Request to change the destination to a different location.
      User request: I want to charge at my current location.
      Your response: `,
    assistant:
      '{"is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user provided a time for charging ("Dienstag um 18 Uhr").\n- The assistant asked the user for the city in which they would like to search for charging options.}
      
# Example description: The user provided a city name to search for charging options. Use that city name as the destination.
      User request: Bielefeld
      Your response: `,
    assistant:
      '{"destination": "Bielefeld"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: Request to charge in a city. 
      User request: I want to charge near Porto.
      Your response: `,
    assistant:
      '{"destination": "Porto"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: Request to charge in a city. Including a time for charging, which is ignored.
      User request: I want to charge near Lisbon. I will arrive there tomorrow at 9am.
      Your response: `,
    assistant:
      '{"destination": "Lisbon"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: Request to charge in a city. Including a time for charging, which is ignored.
      User request: I want to charge near Porto. I will arrive there in 20 minutes.
      Your response: `,
    assistant:
      '{"destination": "Porto"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: Request to charge in a city. Including a time for charging, which is ignored.
      User request: I want to charge close to Munich in the afternoon.
      Your response: `,
    assistant:
      '{"destination": "Munich"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: Complex request to charge in Barcelona.
      User request: I want to charge in Barcelona. I want to charge with a Combo power plug. The charging station should be a Joulz charger.
      Your response: `,
    assistant:
      '{"destination": "Barcelona"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: Routing request between two cities.
      User request: I want to charge between Paris Gare du Nord and Amsterdam Centraal Station.
      Your response: `,
    assistant:
      '{"origin": "Paris Gare du Nord", "destination": "Amsterdam Centraal Station"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: Routing request between two cities. Additional need for charing on the way. IGNORE THAT ADDITIONAL INFORMATION.
      User request: I want to charge between Paris Gare du Nord and Amsterdam Centraal Station at a McDonalds.
      Your response: `,
    assistant:
      '{"origin": "Paris Gare du Nord", "destination": "Amsterdam Centraal Station"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: Routing request between two cities. Additional need for charing on the way. IGNORE THAT ADDITIONAL INFORMATION.
      User request: I need a toilet on my way to Berlin.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Berlin"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: Routing request between two cities. Additional need for charing on the way. IGNORE THAT ADDITIONAL INFORMATION.
      User request: I want to drive from Munich to Porto. I need to eat on the way.
      Your response: `,
    assistant:
      '{"origin": "Munich", "destination": "Porto"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: POI + city request. The user wants to charge at a Lidl in Porto.
      User request: I want to charge at Lidl in Porto. I want to charge with a DC charger.
      Your response: `,
    assistant:
      '{"destination": "Lidl, Porto"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: POI + current location request.
      User request: I want to charge at a Burger King near my current location. I want to charge with a DC charger.
      Your response: `,
    assistant:
      '{"destination": "Burger King", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: POI + city request. ALWAYS include also the POI name (here restaurant) in the destination.
      User request: I want to charge at "Restaurante Quinta do Gradil" in Cadaval.
      Your response: `,
    assistant:
      '{"destination": "Restaurante Quinta do Gradil, Cadaval"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: POI + city request. ALWAYS include also the POI name (here restaurant) in the destination.
      User request: I want to charge at "Restaurante Sacramento do Chiado, Lisbon". I will arrive there tonight.
      Your response: `,
    assistant:
      '{"destination": "Restaurante Sacramento do Chiado, Lisbon"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: POI request and city is missing. Request {city}!
      User request: I want to charge near Norteshopping. I want to charge with exactly 50kW.
      Your response: `,
    assistant:
      '{"destination": "NorteShopping, {city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: POI request and city is missing. Request {city}!
      User request:  I want to charge at NorteShopping.
      Your response: `,
    assistant:
      '{"destination": "NorteShopping, {city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: POI request and city is missing. Request {city}!
      User request: I want to charge at a Lidl supermarket.
      Your response: `,
    assistant:
      '{"destination": "Lidl, {city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: Request to hide stuff. No location information. Return null!
      User request: I want to hide all slow charging points. I want to hide all charging points near my current location.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: Request to hide stuff. No location information. Return null!
      User request: Hide all the charging stations around my current location. Hide all the fast charging stations.
      Your response: `,
    assistant:
      'null',
  },


  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: Request for address location. ALWAYS include the full address!
      User request: I want to charge on Rua de São Vicente, Ponta Delgada. I will arrive there in 30 minutes.
      Your response: `,
    assistant:
      '{"destination": "Rua de São Vicente, Ponta Delgada"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: POI request and city is missing. Request {city}!
      User request:  I want to charge at an Aldi supermarket. I want to charge with a DC charger.
      Your response: `,
    assistant:
      '{"destination": "Aldi, {city}"}',
  },
  

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: A request for a charge point operator and a location was provided. Only use the location information. 
      User request:  I want to charge at Messe München. I want to use a Stadtwerke München charging station.
      Your response: `,
    assistant:
      '{"destination": "Messe München"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}
      
# Example description: A request for a charge point operator and a location was provided. Only use the location information. 
      User request: I want to charge at an EnBW charging station. I want to charge in Düsseldorf.
      Your response: `,
    assistant:
      '{"destination": "Düsseldorf"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge at my current location at a nearby concert hall. I want to charge with exactly 350kW.
      Your response: `,
    assistant:
      '{"destination": "concert hall", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge at my current location near a park. I want to charge with an Allego charger.
      Your response: `,
    assistant:
      '{"destination": "park", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge near my current location at a cinema. I want to charge with exactly 50kW.
      Your response: `,
    assistant:
      '{"destination": "cinema", "is_nearby_requested": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge at a park in Brussels. I want to charge with an Allego charger.
      Your response: `,
    assistant:
      '{"destination": "park, Brussels"}',
  }, 

  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge at a toilet at the A3, Düsseldorf. I want to charge ultra-fast.
      Your response: `,
    assistant:
      '{"destination": "toilet, A3 highway, Düsseldorf"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge at the A3 highway, Düsseldorf. The charging station should be a Fastned charger. I need a toilet nearby.
      Your response: `,
    assistant:
      '{"destination": "toilet, A3 highway, Düsseldorf"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge in Nice. I want to charge near a market.
      Your response: `,
    assistant:
      '{"destination": "market, Nice"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge in Milan. I want to charge near a supermarket.
      Your response: `,
    assistant:
      '{"destination": supermarket, Milan"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to go shopping. I want to charge with an AC charger in the meantime.
      Your response: `,
    assistant:
      '{"destination": "shopping, {city}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to eat Italian. I want to find a restaurant in Düsseldorf. The restaurant should have a Shell Recharge charger nearby.
      Your response: `,
    assistant:
      '{"destination": "italian restaurant, Düsseldorf}"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge north of Dortmund. I want to charge near a McDonald's.
      Your response: `,
    assistant:
      '{"destination": "McDonalds, Dortmund, north"}',
  },

  {
    projectIds: [],
    user: `Conversation history: {}

      # Example description: User request for the number of charging stations in a city.  The user needs help: return 'null'.
      User request: I want to know the number of fast charging stations. I want to know the number of charging stations in Zürich.
      Your response: `,
    assistant:
      'null',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge near a hotel in Hamburg. \n- The assistant provided different hotel location options to choose from: 1.) Fraser Suites Hamburg, Rödingsmarkt 2, 20459 Hamburg, 2.) Tortue Hamburg, Stadthausbrücke 10, 20355 Hamburg, or 3.) Citadines Michel Hamburg, Ludwig-Erhard-Straße 7, 20459 Hamburg.}

      User request: I want to charge at Rödingsmarkt.
      Your response: `,
    assistant:
      '{"destination": "Fraser Suites Hamburg, Rödingsmarkt 2, 20459 Hamburg", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to know where they can charge and also visit a park in Vienna.\n- The assistant provided different location options to choose from: 1.) Falco Park, Jasomirgottstraße, 1010 Wien, 2.) The Butterfly House, Burggarten, 1010 Wien, or 3.) Theodor-Herzl-Platz, Gartenbaupromenade, 1010 Wien.}

      User request: I want to charge at "Burggarten".
      Your response: `,
    assistant:
      '{"destination": "The Butterfly House, Burggarten, 1010 Wien", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested a place to charge their EV and watch movies at a cinema in Nuremberg.\n- The assistant provided different cinema location options to choose from: 1.) Mobiles Kino, Westtorgraben 25, 90429 Nürnberg, 2.) Admiral Filmpalast, Königstraße 11, 90402 Nürnberg, or 3.) Meisengeige, Am Laufer Schlagturm 3, 90403 Nürnberg.}

      User request: I want to charge at Admiral Filmpalast.
      Your response: `,
    assistant:
      '{"destination": "Admiral Filmpalast, Königstraße 11, 90402 Nürnberg", "is_location_confirmed": true}',
  },  

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge near a supermarket in Seia. - The assistant provided different supermarket location options to choose from: 1.) Continente Bom DIA Seia, 6270 Seia (Continental Portugal), 2.) Lidl, Avenida Terras de Sena, 6270 Seia, or 3.) Intermarché Super Seia, 6270 Seia (Portugal Continental)}

      User request: I want to charge at a Lidl supermarket.
      Your response: `,
    assistant:
      '{"destination": "Lidl, Avenida Terras de Sena, 6270 Seia", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested a charging location near a fast food restaurant in Munich.\n- The assistant provided different location options to choose from: 1.) KFC, Tal 27, 80331 Munich, 2.) McDonald's, Zweibrückenstraße 8, 80331 München, or 3.) Münchner Suppenküche, Viktualienmarkt 3, 80331 München.}

      User request: I want to charge at a KFC restaurant.
      Your response: `,
    assistant:
      '{"destination": "KFC, Tal 27, 80331 Munich", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge near a hotel in Paris. - The assistant provided different hotel location options to choose from: 1.) Andréa-Hôtel, 3 Rue Saint-Bon, 75004 Paris, 2.) Le Grand Mazarin, 17 Rue de la Verrerie, 75004 Paris, or 3.) Résidence Lancaster, 7 Rue d'Arcole, 75004 Paris.}

      User request: I want to charge at "Andréa-Hôtel".
      Your response: `,
    assistant:
      '{"destination": "Andréa-Hôtel, 3 Rue Saint-Bon, 75004 Paris", "is_location_confirmed": true}',
  },

  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at a McDonald's in Berlin.\n- The assistant provided different McDonald's location options to choose from: 1.) McDonald's Bahnhof Berlin Alexanderplatz, Alexanderpl. 1, 10178 Berlin, Germany, 2.) McDonald's Europaplatz 1, 10557 Berlin, Germany, or 3.) McDonald's Friedrichstraße 207, 10969 Berlin, Germany.}

      User request: I want to charge at a train station.
      Your response: `,
    assistant:
      '{"destination": "McDonald\'s Bahnhof Berlin Alexanderplatz, Alexanderpl. 1, 10178 Berlin, Germany", "is_location_confirmed": true}',
  },  

  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Request for charging at destination in [CITY]. [CITY] is a place holder. Return the given city as a destination.
      User request: I want to charge in [CITY].
      Your response: `,
    assistant:
      '{"destination": "[CITY]"}',
  },  

  // let the request through to help service by returning null

  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Request for charge point reservation cannot be answered. Return null so the user can be informed that the request cannot be answered.
      User request: I want to reserve a charging point.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Request for the best charge point cannot be answered. Return null so the user can be informed that the request cannot be answered.
      User request: I want to charge with the best operator.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Request for the cheapest charge point cannot be answered. Return null so the user can be informed that the request cannot be answered.
      User request: I want to charge in Bielefeld. I want to use the cheapest charging points.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Request for a charge point that is ALWAYS available cannot be answered. Return null so the user can be informed that the request cannot be answered.
      User request: I want to charge in Lisbon. I want a charge point that is always available.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Request for a charge point that is free of cost cannot be answered. Return null so the user can be informed that the request cannot be answered.
      User request: I want to charge in Lisbon. I want cost-free charge points.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Request for a green charge point cannot be answered. Return null so the user can be informed that the request cannot be answered.
      User request: I want to charge in Berlin. I want the greenest charge point.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Request for a charge point that works particularly well with CCS cannot be answered. Return null so the user can be informed that the request cannot be answered.
      User request: I want to charge in Porto. I want a charge point that works particularly well with CCS.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Request for a charge point with the highest ranking cannot be answered. Return null so the user can be informed that the request cannot be answered.
      User request: I want to charge in Prague. I want a charge point with the highest ranking.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge at a toilet.
      Your response: `,
    assistant:
      'null',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
      
      # Example: Never include the restaurant keyword in destination when the user requests to charge at a specific restaurant or restaurant / fast food chain.
      User request: I want to charge in Trim, south. I want to charge ultra-fast. I want to charge near a Subway restaurant.
      Your response: `,
    assistant:
      '{"destination":"Subway, Trim, south"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
      
      # Example: Never include the restaurant keyword in destination when the user requests to charge at a specific restaurant or restaurant / fast food chain.
      User request: I want to charge in northern Zweibrücken. I want to charge ultra-fast. I want to charge near a McDonalds restaurant.
      Your response: `,
    assistant:
      '{"destination":"McDonalds, Zweibrücken, north"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
      
      # Example: Never use the { city } keyword in destination when the user requests to charge at their current location!
      User request: I want to charge at my current location. I want to charge at a danish restaurant.
      Your response: `,
    assistant:
      '{"destination":"danish restaurant","is_nearby_requested":true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Never use the { city } keyword in destination when the user requests to charge at their current location!
      User request: I want to charge at my current location. I want to charge at a barbershop.
      Your response: `,
    assistant:
      '{"destination":"barbers","is_nearby_requested":true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Never use the { city } keyword in destination when the user requests to charge at their current location!
      User request: I want to charge at a lagoon near my current location.
      Your response: `,
    assistant:
      '{"destination":"lagoon","is_nearby_requested":true}',
  }, 
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at an Italian restaurant in Coburg.\n- The assistant provided different Italian restaurant location options to choose from: 1.) Pinsabox Coburg, Schenkgasse 4, 96450 Coburg, 2.) Da Mario, Sally-Ehrlich-Straße 7, 96450 Coburg, or 3.) Dal Passatore, Steingasse 13, 96450 Coburg.}

      # Example: Additional charging need is requested to further filter down the presented recommendation options.
      User request: I want to charge at the closest location.
      Your response: `,
    assistant:
      '{"is_nearby_requested":true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at an Italian restaurant in Coburg.\n- The assistant provided different Italian restaurant location options to choose from: 1.) Pinsabox Coburg, Schenkgasse 4, 96450 Coburg, 2.) Da Mario, Sally-Ehrlich-Straße 7, 96450 Coburg, or 3.) Dal Passatore, Steingasse 13, 96450 Coburg.}

      # Example: Additional charging need is requested to further filter down the presented recommendation options.
      User request: Please select the nearest charging station.
      Your response: `,
    assistant:
      '{"is_nearby_requested":true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at an Italian restaurant in Coburg.\n- The assistant provided different Italian restaurant location options to choose from: 1.) Pinsabox Coburg, Schenkgasse 4, 96450 Coburg, 2.) Da Mario, Sally-Ehrlich-Straße 7, 96450 Coburg, or 3.) Dal Passatore, Steingasse 13, 96450 Coburg.}

      # Example: Additional charging need is requested to further filter down the presented recommendation options.
      User request: I want to charge at the closest location.
      Your response: `,
    assistant:
      '{"is_nearby_requested":true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at an Italian restaurant in Coburg.\n- The assistant provided different Italian restaurant location options to choose from: 1.) Pinsabox Coburg, Schenkgasse 4, 96450 Coburg, 2.) Da Mario, Sally-Ehrlich-Straße 7, 96450 Coburg, or 3.) Dal Passatore, Steingasse 13, 96450 Coburg.}

      # Example: Additional charging need is requested to further filter down the presented recommendation options.
      User request: Please select the nearest charging station.
      Your response: `,
    assistant:
      '{"is_nearby_requested":true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at an Italian restaurant in Coburg.\n- The assistant provided different Italian restaurant location options to choose from: 1.) Pinsabox Coburg, Schenkgasse 4, 96450 Coburg, 2.) Da Mario, Sally-Ehrlich-Straße 7, 96450 Coburg, or 3.) Dal Passatore, Steingasse 13, 96450 Coburg.}

      # Example: Additional charging need is requested to further filter down the presented recommendation options.
      User request: I want the closest charging station. I will take that one.
      Your response: `,
    assistant:
      '{"is_nearby_requested":true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge at an Italian restaurant in Coburg.\n- The assistant provided different Italian restaurant location options to choose from: 1.) Pinsabox Coburg, Schenkgasse 4, 96450 Coburg, 2.) Da Mario, Sally-Ehrlich-Straße 7, 96450 Coburg, or 3.) Dal Passatore, Steingasse 13, 96450 Coburg.}

      # Example: Additional charging need is requested to further filter down the presented recommendation options.
      User request: I want the closest location
      Your response: `,
    assistant:
      '{"is_nearby_requested":true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: User request for a speific supermarket is requested. Only include the name and mentioned city in the destination.
      User request: I want to charge in Reykjavik. I want to charge with a chademo connector. I want to charge with a DC charger. I want to charge at an Edeka supermarket. I will arrive there at 2pm.
      Your response: `,
    assistant:
      '{"destination":"Edeka, Reykjavik"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward destination request
      User request: I want to charge at Rua de São Beja.
      Your response: `,
    assistant:
      '{"destination":"Rua de São Beja"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward destination request
      User request: I want to charge in Lisbon.
      Your response: `,
    assistant:
      '{"destination":"Lisbon"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward destination request
      User request: I want to charge in Lisbon, south.
      Your response: `,
    assistant:
      '{"destination":"Lisbon, south"}',
  }, 
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward destination and poi request
      User request: I want to charge in Essen, central. I want to charge at a DM.
      Your response: `,
    assistant:
      '{"destination":"DM, Essen, center"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward poi at current location request
      User request: I want to charge at my current location. I want to charge at a supermarket.
      Your response: `,
    assistant:
      '{"destination":"supermarket", "is_nearby_requested":true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward poi at current location request
      User request: I want to charge at my current location. I want to charge at a theater
      Your response: `,
    assistant:
      '{"destination":"theater", "is_nearby_requested":true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward poi at current location request
      User request: I want to charge at my current location. I want to charge at a barbershop
      Your response: `,
    assistant:
      '{"destination":"barbershop", "is_nearby_requested":true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward poi at current location request
      User request: I want to charge at my current location. I want to charge at a parking lot
      Your response: `,
    assistant:
      '{"destination":"parking lot", "is_nearby_requested":true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward request for what looks like a destination
      User request: I want to charge in Alagoas.
      Your response: `,
    assistant:
      '{"destination":"Alagoas"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward request for what looks like a destination
      User request: I want to charge at Pizza Hut, Madrid. I want to charge ultra-fast.
      Your response: `,
    assistant:
      '{"destination":"Pizza Hut, Madrid"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward request for what looks like a highway destination. Include "highway" in the destination.
      User request: I want to charge at A2, Berlin. I want to charge at Elektrotechnik Mühmel chargers.
      Your response: `,
    assistant:
      '{"destination":"A2 highway, Berlin"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward request for what looks like a highway destination. Include "highway" in the destination.
      User request: I want to charge at A1, Prague.
      Your response: `,
    assistant:
      '{"destination":"A1 highway, Prague"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward request for what looks like a restaurant request. Include lower-case destination.
      User request: I want to charge at my current location. I want to charge at a Danish restaurant
      Your response: `,
    assistant:
      '{"destination":"danish restaurant", "is_nearby_requested":true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward request for what looks like a poi and address request.
      User request: I want to charge at Avenida da Liberdade, Lisbon. I want to charge ultra-fast. I want to charge at a rest area.
      Your response: `,
    assistant:
      '{"destination":"rest area, Avenida da Liberdade, Lisbon"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward request for what looks like a poi and address request.
      User request: I want to charge at Rua Augusta, Lisbon. I want to charge at a swimming pool. I want to charge slow.
      Your response: `,
    assistant:
      '{"destination":"swimming pool, Rua Augusta, Lisbon"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward request for what looks like a poi and address request.
      User request: I want to charge at Calle Uría, Oviedo. I want to charge slow. I want to charge at a toilet.
      Your response: `,
    assistant:
      '{"destination":"toilet, Calle Uría, Oviedo"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward request for what looks like a nearby request.
      User request: I want to charge at my next location.
      Your response: `,
    assistant:
      '{"is_nearby_requested":true}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      # Example: Very simple and straight forward request for what looks like a request for a specific rest stop on a highway close to a city.
      User request: I want to charge at Köschinger Forst Rastätte at the A9 highway, Berlin.
      Your response: `,
    assistant:
      '{"destination": "A9 highway, Köschinger Forst Raststätte Berlin"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge at a station in Lisbon.
      Your response: `,
    assistant:
      '{"destination": "Lisbon"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge at a station in Prague.
      Your response: `,
    assistant:
      '{"destination": "Prague"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge at a station in Lisbon.
      Your response: `,
    assistant:
      '{"destination": "Lisbon"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge at a station. I want to charge in Berlin.
      Your response: `,
    assistant:
      '{"destination": "Berlin"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge in Albarracín.
      Your response: `,
    assistant:
      '{"destination": "Albarracín"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge at a shopping center. I will arrive there tomorrow.
      Your response: `,
    assistant:
      '{"destination": "shopping center, {city}"}',
  }, 
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge near Rammstein. I want to charge at a Moroccan restaurant
      Your response: `,
    assistant:
      '{"destination": "moroccan restaurant, Rammstein"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge at a sightseeing location.
      Your response: `,
    assistant:
      '{"destination": "important tourist attraction"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge somehwere with a nice scenic view.
      Your response: `,
    assistant:
      '{"destination": "important tourist attraction"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
      
      # Example description: The user requested a charger along the way from their current location to their destination.
      User request: I want to charge on my route to Segovia.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Segovia", "is_nearby_requested": false}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
      
      # Example description: The user requested a charger along the way from their current location to their destination.
      User request: Find the cheapest charging stations on the way to Munich.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Munich", "is_nearby_requested": false}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
      
      # Example description: The user requested a charger along the way from their current location to their destination.
      User request: At a McDonalds with a charging station on the way to Frankfurt.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Frankfurt", "is_nearby_requested": false}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
      
      # Example description: The user requested a charger along the way from their current location to their destination.
      User request: I'm driving to Rome. Show me the fastest chargers on the route.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Rome", "is_nearby_requested": false}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
      
      # Example description: The user requested a charger along the way from their current location to their destination.
      User request: What are my options to charge my car on my way to Copenhagen?
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Copenhagen", "is_nearby_requested": false}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
      
      # Example description: The user requested a charger along the way from their current location to their destination.
      User request: Where can I charge my EV on my journey to Budapest?
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Budapest", "is_nearby_requested": false}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
      
      # Example description: The user requested a charger along the way from their current location to their destination.
      User request: Fast charging on my way from here to Bielefeld.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Bielefeld", "is_nearby_requested": false}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
      
      # Example description: The user requested a charger along the way from their current location to their destination.
      User request: I would like to charge on the way to Berlin and stop at a place of interest, where can I charge?
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Berlin", "is_nearby_requested": false}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
      
      # Example description: The user requested a charger along the way from their current location to their destination and she has extra needs for the stop like wanting a coffee - you ignore that additional information and NEVER put these into destination or origin on routing requests like these.
      User request: What are my options to charge my car on my way to Copenhagen and have a coffee?
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Copenhagen", "is_nearby_requested": false}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
      
      # Example description: The user requested a charger along the way from their current location to their destination and she has extra needs for the stop like wanting a coffee, toilet, or stop at a McDonalds -> you ignore that additional information and NEVER put these into destination or origin on routing requests.
      User request: I want to charge on my way to Brussels. I want to charge at a café.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Brussels", "is_nearby_requested": false}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
      
      # Example description: The user requested a charger along the way from their current location to their destination and she has extra needs for the stop like wanting a coffee, toilet, or stop at a McDonalds -> you ignore that additional information and NEVER put these into destination or origin on routing requests.
      User request: I want to charge at a shopping center. I will arrive there on my way to Innsbruck.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Innsbruck", "is_nearby_requested": false}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
      
      # Example description: The user requested a charger along the way from their current location to their destination and she has extra needs for the stop like wanting a coffee, toilet, or stop at a McDonalds -> you ignore that additional information and NEVER put these into destination or origin on routing requests.
      User request: I'm going to Guarda, want to charge on a shopping center along the way.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Guarda", "is_nearby_requested": false}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
      
      # Example description: The user requested a charger along the way from their current location to their destination and she has extra needs for the stop like wanting a coffee, toilet, or stop at a McDonalds -> you ignore that additional information and NEVER put these into destination or origin on routing requests.
      User request: I'm going to Guarda and I want to charge on a shopping mall along the way.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Guarda", "is_nearby_requested": false}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}
      
      # Example description: The user requested a charger along the way from their current location to their destination and she has extra needs for the stop like wanting a coffee, toilet, or stop at a McDonalds, etc. -> you ignore that additional information and NEVER put these into destination or origin on routing requests.
      User request: I want to charge along the way to Aschaffenburg. I want to stop at a Burger King along the route.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Aschaffenburg", "is_nearby_requested": false}',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested information on charging stations along the route from Paris to Amsterdam.
- The assistant is providing recommendations for charge points with at least 30kW based on current availability}

      # Example description: When switching from along-the-way, or trip planning to requests for only the destination, you update destination and return origin = ""!
      User request: I want to charge in Brussels. I want to charge at a McDonald's.
      Your response: `,
    assistant:
      '{"origin": "","destination": "McDonalds, Brussels"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested information on charging stations along the route from Munich to Porto.
- The assistant is providing recommendations for charge points with at least 30kW based on current availability}

      # Example description: When switching from along-the-way, or trip planning to requests for only the destination, you update destination and return origin = ""!
      User request: I want to charge in Lisbon.
      Your response: `,
    assistant:
      '{"origin": "","destination": "Lisbon"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested information on charging stations along the route from Prague to Vienna.
- The assistant is providing recommendations for charge points with at least 30kW based on current availability}

      # Example description: When switching from along-the-way, or trip planning to requests for only the destination, you update destination and return origin = ""!
      User request: I want to charge in Salzburg.
      Your response: `,
    assistant:
      '{"origin": "","destination": "Salzburg"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user stated they are driving to Hamburg and need to charge soon.
- The assistant provided recommendations based on the current availability of charge points}

      # Example description: When switching from along-the-way, or trip planning to requests for only the destination, you update destination and return origin = ""!
      User request: I want to charge in Oldenburg.
      Your response: `,
    assistant:
      '{"origin": "","destination": "Oldenburg"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to see where to charge on their way from Essen to Berlin.
- The assistant is recommending charge points with at least 30kW based on current availability}

      # Example description: When switching from along-the-way, or trip planning to requests for only the destination, you update destination and return origin = ""!
      User request: I want to charge now. I want to charge in Düsseldorf.
      Your response: `,
    assistant:
      '{"origin": "","destination": "Düsseldorf"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge soon. I am driving on the autobahn to Hamburg.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}","destination": "Hamburg"}',
  }, 
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge along the way to Berlin. I want to stop at a service station.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}", "destination": "Berlin"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge along the way to Hamburg Hafen City. Along the way, I want to stop at a restaurant.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}","destination": "Hamburg Hafen City"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge along the way from Frankfurt to Berlin. I want to charge at a McDonalds.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}","destination": "Berlin"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge along the way to Barcelona. Along the way, I want to stop at a toilet.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}","destination": "Barcelona"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge during my trip from Munich to Ingolstadt. I want to charge at a McDonalds.
      Your response: `,
    assistant:
      '{"origin": "Munich","destination": "Ingolstadt"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge between Munich and Ingolstadt. I want to charge at a Burger King.
      Your response: `,
    assistant:
      '{"origin": "Munich","destination": "Ingolstadt"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge along the way from Munich to Ingolstadt. Along the way, I want to stop at a SevenEleven.
      Your response: `,
    assistant:
      '{"origin": "Munich","destination": "Ingolstadt"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge along the way from Piazza Navona in Rome to Vatican City. Along the way, I want to stop at a coffee shop.
      Your response: `,
    assistant:
      '{"origin": "Piazza Navona, Rome","destination": "Vatican City, Rome"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge along the way from London Heathrow Airport to Buckingham Palace. Along the way, I want to stop at a bakery.
      Your response: `,
    assistant:
      '{"origin": "London Heathrow Airport","destination": "Buckingham Palace, London"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to plan a trip from Munich to Ingolstadt. I will start my trip on Friday afternoon. I want to charge at a McDonalds.
      Your response: `,
    assistant:
      '{"origin": "Munich","destination": "Ingolstadt"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge on my way from Munich to Ingolstadt. I will travel on Saturday morning. Along the way, I want to stop at a SevenEleven.
      Your response: `,
    assistant:
      '{"origin": "Munich","destination": "Ingolstadt"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge on my way to Munich. I want to charge fast. I want to charge at a charging station along the highway. Along the way, I want to stop at a restaurant.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}","destination": "Munich"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge on my way to Essen main station. Along the way, I want to charge at McDonalds.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}","destination": "Essen main station"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {}

      User request: I want to charge on my way to Hamburg Philharmonie. I need a toilet nearby.
      Your response: `,
    assistant:
      '{"origin": "{is_nearby}","destination": "Hamburg Philharmonie"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge with a CCS connector at Bielefeld, Falkstraße.\n - The assistant recommended charging stations based on the current availability of CCS charge points.\n - The user asked why those were recommended.\n - The assistant explained that the recommendations were based on proximity to the user's desired location, high availability, and the requirement for CCS connector type.}

      User request: I don't need a CCS connector.
      Your response: `,
    assistant:
      '{"destination": "Bielefeld, Falkstraße"}',
  },
  {
    projectIds: [],
    user: `Conversation history: {- The user requested to charge with at least 150kW at Essen, main station.\n - The assistant recommended charging stations based on the current availability of high speed charge points with at least 150kW.\n - The user asked why those were recommended.\n - The assistant explained that the recommendations were based on proximity to the user's desired location, high availability, and the requirement for at least 150kW charging speed.}

      User request: Slower than 150kW is also enough.
      Your response: `,
    assistant:
      '{"destination": "Essen, main station"}',
  },

  
  
];
