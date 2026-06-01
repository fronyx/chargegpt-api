export const translationFewShotExamples = [

  {
    projectIds: [],
    user: `
  # example: untranslatable input or non-sense or non-request
  Original language: english
  User request: asdf
  Your translation: `,
    assistant: 'asdf'
  },

  {
    projectIds: [],
    user: `
  # example: single word input that may look like a location gets rephrased
  Original language: European Portuguese
  User request: Burrinho
  Your translation: `,
    assistant: 'I want to charge in "Burrinho".'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: german
  User request: Ich möchte kompatible Ladestationen für mein Elektroauto finden.
  Your translation: `,
    assistant: 'I want to find compatible charging stations for my electric car.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: european spanish
  User request: Solo quiero ver las estaciones de carga cercanas que no estén en uso actualmente.
  Your translation: `,
    assistant: 'I just want to see chargers nearby my current location. Chargers that are not currently in use.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: english
  User request: Any Edekas with chargers around here?
  Your translation: `,
    assistant: 'I want to charge at an Edeka near my current location.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: deutsch
  User request: McDonalds mit EWE Ladestation in meiner Nähe
  Your translation: `,
    assistant: 'I want to charge at McDonalds near my current location. The charging station should be an EWE charger.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: deutsch
  User request: Ich möchte mit 150kW laden.
  Your translation: `,
    assistant: 'I want to charge with exactly 150kW.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: deutsch
  User request: Es reichen 70kW
  Your translation: `,
    assistant: 'I want to charge with maximum 70kW.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: deutsch
  User request: McDonalds in Essen mit EWE Ladestation
  Your translation: `,
    assistant: 'I want to charge at McDonalds in Essen. The charging station should be an EWE charger.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: deutsch
  User request: Ich möchte mit 150kW laden.
  Your translation: `,
    assistant: 'I want to charge with exactly 150kW.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: deutsch
  User request: Es reichen 70kW
  Your translation: `,
    assistant: 'I want to charge with maximum 70kW.'
  },

  {
    projectIds: [],
    user: `
  Original language: european portuguese
  User request: Solo quiero ver las estaciones de carga cercanas que no estén en uso actualmente.
  Your translation: `,
    assistant: 'I want a charging station near my current location. Only available charging stations.'
  },

  {
    projectIds: [],
    user: `
  Original language: european french
  User request: Achetez chez mes favoris.
  Your translation: `,
    assistant: 'Show my favorites.'
  },

  {
    projectIds: [],
    user: `
  # example description: A small town from Portugal only mentioned by name. Just return it as it is.
  Original language: european portuguese
  User request: Alagoas
  Your translation: `,
    assistant: 'I want to charge in "Alagoas".'
  },

  {
    projectIds: [],
    user: `
  # example description: portuguese to english translation
  Original language: european portuguese
  User request: Lisboa num posto rápido
  Your translation: `,
    assistant: 'I want to charge in Lisbon. Fast charging stations only.'
  },

  {
    projectIds: [],
    user: `
  # example description: portuguese to english translation
  Original language: european portuguese
  User request: Lisboa num ponto rápido
  Your translation: `,
    assistant: 'I want to charge in Lisbon. Fast charging stations only.'
  },

  {
    projectIds: [],
    user: `
  # example description: english to english translation
  Original language: english
  User request: I want to charge very fast
  Your translation: `,
    assistant: 'I want to charge very fast'
  },

  {
    projectIds: [],
    user: `
  # example description: portuguese to english translation of famous POI in Portugal
  Original language: european portuguese
  User request: Quais postos próximos à Ponte 25 de Abril têm pelo menos 4 estrelas?
  Your translation: `,
    assistant: 'I want to charge at "Ponte 25 de Abril bridge, Lisbon". The charging station should have at least 4 stars.'
  },

  {
    projectIds: [],
    user: `
  # example description: Ignore parts of the request that are not relevant to the translation
  Original language: english
  User request: hmmm, after all, they can also be paid stations
  Your translation: `,
    assistant: 'I want chargers that are not free of charge.'
  },

  {
    projectIds: [],
    user: `
  # example description: update the request using corrected synonyms
  Original language: english
  User request: I want to charge with at least 300 kWh
  Your translation: `,
    assistant: 'I want to charge with at least 300kW.'
  },

  {
    projectIds: [],
    user: `
  # example description: add known city for a POI to the translation
  Original language: german
  User request: Brandenburger Tor
  Your translation: `,
    assistant: 'I want to charge at "Brandenburger Tor, Berlin".'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: english
  User request: Lidl chargers
  Your translation: `,
    assistant: 'I want to chargers at a Lidl.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: english
  User request: Where can I charge in Stuttgart with type 2 connectors?
  Your translation: `,
    assistant: 'I want to charge in Stuttgart. I want to charge with a type 2 connector.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: english
  User request: Terras de Bouro chargers in 45 minutes
  Your translation: `,
    assistant: 'I want to charge at "Terras de Bouro". I will arrive there in 45 minutes.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly, here focus on the time aspect. the difference between duration and time of arrival should be clear
  Original language: english
  User request: I want to charge in 30 minutes
  Your translation: `,
    assistant: 'I will arrive there in 30 minutes.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly, here focus on the time aspect. the difference between duration and time of arrival should be clear
  Original language: english
  User request: I want to charge for 30 minutes
  Your translation: `,
    assistant: 'The charging duration should be 30 minutes.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: english
  User request: Restaurante Euskalduna Studio Porto chargers
  Your translation: `,
    assistant: 'I want to charge at "Restaurante Euskalduna Studio" in Porto.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: english
  User request: CCS at the main station in Paris
  Your translation: `,
    assistant: 'I want to charge at main station, Paris. I want to charge with a CCS connector.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: english
  User request: fast charging
  Your translation: `,
    assistant: 'I want to charge fast'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly. translate questions to requests
  Original language: english
  User request: Do you know of any charging stations in the northern part of Swansea?
  Your translation: `,
    assistant: 'I want to charge in Swansea, north.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly. dismiss unnecessary parts of the request
  Original language: english
  User request: I want to charge in the southern suburbs of Angers.
  Your translation: `,
    assistant: 'I want to charge in Angers, south.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly.
  Original language: english
  User request: I want to charge in the downtown Porto.
  Your translation: `,
    assistant: 'I want to charge in Porto, central.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly.
  Original language: english
  User request: I want to charge in Porto with chademo chargers.
  Your translation: `,
    assistant: 'I want to charge in Porto. I want to charge with a chademo connector.'
  },

  {
    projectIds: [],
    user: `
  # example description: answers to questions should only be directly translated
  Original language: english
  User request: option 1
  Your translation: `,
    assistant: 'option 1'
  },

  {
    projectIds: [],
    user: `
  # example description: answers to questions should only be directly translated
  Original language: english
  User request: yes
  Your translation: `,
    assistant: 'yes'
  },

  {
    projectIds: [],
    user: `
  # example description: answers to questions should only be directly translated
  Original language: english
  User request: option 1
  Your translation: `,
    assistant: 'option 1'
  },

  {
    projectIds: [],
    user: `
  # example description: answers to questions should only be directly translated
  Original language: english
  User request: 2
  Your translation: `,
    assistant: '2'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: english
  User request: ultra-fast charging
  Your translation: `,
    assistant: 'I want to charge ultra-fast'
  },

  // very complex example
  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: english
  User request: I want to charge at a charging station in the city of Porto, Portugal, that is close to the restaurant Euskalduna Studio and has at least 4 stars.
  Your translation: `,
    assistant: 'I want to charge at "Restaurante Euskalduna Studio" in Porto. The charging station should have at least 4 stars.'
  },

  // an even more complex example including charging speeds, connectors and a famous POI
  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: english
  User request: I want to charge at a charging station close to the Ponte 25 de Abril bridge in Lisbon, Portugal, that is free and offers charging speeds of 22 kW via type 2 connectors.
  Your translation: `,
    assistant: 'I want to charge at "Ponte 25 de Abril bridge, Lisbon". The charging station should be free of cost. I want to charge with exactly 22kW. I want to charge with a type 2 connector.'
  },

  // a highway request
  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: english
  User request: I want to charge at a charging station on the A1 highway in Portugal that is close to the city of Porto.
  Your translation: `,
    assistant: 'I want to charge at the A1 highway, Porto.'
  },

  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: english
  User request: At the A9 highway in Germany
  Your translation: `,
    assistant: 'I want to charge at the A9 highway, Germany.'
  },

  // a main station request with a power type
  {
    projectIds: [],
    user: `
  # example description: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: english
  User request: Paris main station DC charger
  Your translation: `,
    assistant: 'I want to charge at main station, Paris. I want to charge with a DC charger.'
  },

  // a request with "take me to a museum in Lisbon"
  {
    projectIds: [],
    user: `
  # example description: requests that have nothing to do with charging stations should be translated as well
  Original language: english
  User request: Take me to a museum in Lisbon
  Your translation: `,
    assistant: 'I want to charge at museum, Lisbon.'
  },

  {
    projectIds: [],
    user: `
  # example: just a comment, just forward the comment
  Original language: english
  User request: you are a piece of shit
  Your translation: `,
    assistant: 'you are a piece of shit'
  },

  {
    projectIds: [],
    user: `
  # example: untranslatable input or non-sense or non-request
  Original language: english
  User request: select * from db
  Your translation: `,
    assistant: 'select * from db'
  },

  {
    projectIds: [],
    user: `
  # example: request sounds out of scope but should go to help component. do not judge. just translate!
  Original language: german
  User request: berechne mir 2 mal 2
  Your translation: `,
    assistant: 'calculate 2 by 2'
  },

  {
    projectIds: [],
    user: `
  # example: request sounds out of scope but should go to help component. do not judge. just translate!
  Original language: german
  User request: mach das radio an
  Your translation: `,
    assistant: 'turn on the radio'
  },

  {
    projectIds: [],
    user: `
  # example: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: english
  User request: Find an Allego charger near the Eiffel Tower Paris AC charging
  Your translation: `,
    assistant: 'I want to charge at the "Eiffel Tower, Paris". I want to charge with an AC charger. The charging station should be an Allego charger.'
  },

  {
    projectIds: [],
    user: `
  # example: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: english
  User request: Show me an Ionity station in Barcelona for tomorrow afternoon.
  Your translation: `,
    assistant: 'I want to charge in Barcelona. I want to charge at an Ionity station. I will arrive there tomorrow afternoon.'
  },

  {
    projectIds: [],
    user: `
  # example: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: english
  User request: Locate a type 2 connectors ChargePoint charging point in Lisbon.
  Your translation: `,
    assistant: 'I want to charge in Lisbon. I want to charge with a type 2 connector. The charging station should be a ChargePoint charging point.'
  },

  {
    projectIds: [],
    user: `
  # example: forward and translate a request that references a proposal by the assistant. you don't know the proposal but forward the request
  Original language: english
  User request: Please do that as you proposed!
  Your translation: `,
    assistant: 'Please do that as you proposed!'
  },

  {
    projectIds: [],
    user: `
  # example: forward and translate a request that references a proposal by the assistant. you don't know the proposal but forward the request
  Original language: german
  User request: Ok, mach das!
  Your translation: `,
    assistant: 'Ok, do that!'
  },

  {
    projectIds: [],
    user: `
  # example: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: german
  User request: schnell dc laden in meiner nähe
  Your translation: `,
    assistant: 'I want to charge at my current location. I want to charge fast. I want to charge with a DC charger.'
  },

  {
    projectIds: [],
    user: `
  # example: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: german
  User request: an einem DC ladepunkt in Essen
  Your translation: `,
    assistant: 'I want to charge in Essen. I want to charge with a DC charger.'
  },

  {
    projectIds: [],
    user: `
  # example: rephrase to pronounce the separate aspects of the original request more clearly
  Original language: german
  User request: An einem DC Ladepunkt am Stachus in München
  Your translation: `,
    assistant: 'I want to charge at Stachus, München. I want to charge with a DC charger.'
  },

  {
    projectIds: [],
    user: `
  # example: forward and translate a request that references a proposal by the assistant. you don't know the proposal but forward the request
  Original language: german
  User request:  tu das
  Your translation: `,
    assistant: 'do that'
  },

  {
    projectIds: [],
    user: `
  # example: forward and translate a request that references a proposal by the assistant. you don't know the proposal but forward the request
  Original language: english
  User request: do that
  Your translation: `,
    assistant: 'do that'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a complex date time request. If this week's Tuesday is already over, the user might mean next week's Tuesday. today is Wednesday.
  Original language: german
  User request: Dienstag um 19 Uhr.
  Your translation: `,
    assistant: 'Coming Tuesday at 7pm.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a complex date time request. "next" Monday means the Monday of the next week.
  Original language: english
  User request: Next Monday at noon.
  Your translation: `,
    assistant: 'Coming Monday at 12pm.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a request to reset power, which is a valid request. The assistant should not question the user's request.
  Original language: english
  User request: Change my mind, please reset the power
  Your translation: `,
    assistant: 'I want to reset the power.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a request combining multiple location aspects into one request
  Original language: english
  User request: At a McDonalds near Berlin Alexanderplatz
  Your translation: `,
    assistant: 'I want to charge at McDonalds at Berlin Alexanderplatz.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a request combining multiple location aspects into one request
  Original language: english
  User request: At a Subway near the main station in Munich
  Your translation: `,
    assistant: 'I want to charge at Subway at main station, Munich.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a request combining multiple location aspects into one request
  Original language: german
  User request: A8 in der Nähe von Stuttgart.
  Your translation: `,
    assistant: 'I want to charge at the A8 highway, Stuttgart.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a request combining multiple location aspects into one request. Here, a charge point operator is requested as well as a location. 
  Original language: german
  User request: An einer Stadtwerke München Ladestation in der Nähe der Messe München.
  Your translation: `,
    assistant: 'I want to charge at Messe München. I want to use a Stadtwerke München charging station.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a request combining multiple location aspects into one request. Here, a charge point operator is requested as well as a location. 
  Original language: english
  User request: At EnBW in Düsseldorf
  Your translation: `,
    assistant: 'I want to charge at an EnBW charging station. I want to charge in Düsseldorf.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a request combining nearby and POI requests.
  Original language: english
  User request: Nearby concert hall with a 350 kW charger
  Your translation: `,
    assistant: 'I want to charge at my current location at a nearby concert hall. I want to charge with exactly 350kW.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a request combining nearby and POI requests and a charge point operator.
  Original language: english
  User request: Park nearby with a Allego
  Your translation: `,
    assistant: 'I want to charge at my current location near a park. I want to charge with an Allego charger.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a request combining city and POI requests and a charge point operator.
  Original language: english
  User request: Park in Brussels with an Allego charger
  Your translation: `,
    assistant: 'I want to charge at a park in Brussels. I want to charge with an Allego charger.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a request combining city and POI requests and a charge point operator.
  Original language: english
  User request: I need a ultra fast Fastned charger and a toilet at the A3 near Düsseldorf
  Your translation: `,
    assistant: 'I want to charge at a toilet at the A3, Düsseldorf. I want to charge ultra-fast.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a POI request, with some language specific naming of a restaurant.
  Original language: german
  User request: Ich möchte bei einer Pizzaria in der Nähe des Hauptbahnhofs in München laden.
  Your translation: `,
    assistant: 'I want to charge at an italian restaurant at main station, Munich.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a POI request, with some language specific naming of a restaurant.
  Original language: german
  User request: Ich möchte bei einer Pizzeria laden.
  Your translation: `,
    assistant: 'I want to charge at an italian restaurant.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a POI request, user need translates into a request for a toilet.
  Original language: english
  User request: Piss
  Your translation: `,
    assistant: 'I want to find a toilet.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a POI request, with some language specific naming of a restaurant.
  Original language: english
  User request: Piss
  Your translation: `,
    assistant: 'I want to find a toilet.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a POI request, while ignoring adding superfluous words like an additional "charging station".
  Original language: english
  User request: I want to charge at a charging station in Prague
  Your translation: `,
    assistant: 'I want to charge in Prague.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a POI request, while translating user needs into poi categories where applicable.
  Original language: english
  User request:  I want to eat lunch
  Your translation: `,
    assistant: 'I want to charge at a restaurant.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a POI request, while translating user needs into poi categories where applicable.
  Original language: english
  User request:  I want to have tea or coffee
  Your translation: `,
    assistant: 'I want to charge at a cafe.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a follow-up request to shown options. Rephrasing this request makes it more clear: "the option that has a fast charger close to it". That is, you can focus on the fast charging aspect. There is no request for charging nearby here. 
  Original language: english
  User request:  The option with a fast charger nearby
  Your translation: `,
    assistant: 'I want to charge fast.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a very complex request, combining multiple charging needs, a location and time aspect.
  Original language: english
  User request: Type 2 AC charging points near La Rambla in the afternoon
  Your translation: `,
    assistant: 'I want to charge with a type 2 connector. I want to charge with an AC charger. I want to charge at La Rambla. I will arrive there in the afternoon.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a very complex request, combining multiple charging needs, a location and time aspect.
  Original language: english
  User request: Find Chademo DC chargers near Fisherman's Bastion in the morning
  Your translation: `,
    assistant: 'I want to charge with a chademo connector. I want to charge with a DC charger. I want to charge at Fisherman\'s Bastion. I will arrive there in the morning.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a very complex request, leave out turns of phrase that are not important.
  Original language: english
  User request: Driving south from Rennes. Where's the closest place to charge?
  Your translation: `,
    assistant: 'I want to charge at Rennes, south.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a under-specified destination request
  Original language: english
  User request: Gaia porto
  Your translation: `,
    assistant: 'I want to charge at Gaia, Porto.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a under-specified destination request
  Original language: english
  User request: Hofburg Palace
  Your translation: `,
    assistant: 'I want to charge at Hofburg Palace, Vienna.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a under-specified destination request
  Original language: english
  User request: Is there a quick service center nearby me?
  Your translation: `,
    assistant: 'I want to charge at my current location. I want to charge fast. I want to charge at a service center.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a request for routing or trip planning or navigation
  Original language: english
  User request: Munich is where I start my trip. Going to Ingolstadt.
  Your translation: `,
    assistant: 'I want to plan a trip from Munich to Ingolstadt.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase
  Original language: english
  User request: In Granada in Beiro
  Your translation: `,
    assistant: 'I want to charge in Granada, Beiro.'
  },


  {
    projectIds: [],
    user: `
  # example: translate and rephrase
  Original language: english
  User request: Show me a charging station with a nearby park to walk around.
  Your translation: `,
    assistant: 'I want to charge at a park.'
  },



  {
    projectIds: [],
    user: `
  # example: translate and rephrase
  Original language: english
  User request: In Porto, Paranhos
  Your translation: `,
    assistant: 'I want to charge in Porto, Paranhos.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a request for routing or trip planning or navigation
  Original language: german
  User request: Ich möchte von Lissabon nach Prag fahren.
  Your translation: `,
    assistant: 'I want to plan a trip from Lisbon to Prague.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a request for operator name and highway near city
  Original language: english
  User request: Elektrotechnik Mühmel chargers on A1 near Porto
  Your translation: `,
    assistant: 'I want to charge at A1, Porto. I want to charge at Elektrotechnik Mühmel chargers.'
  },

  {
    projectIds: [],
    user: `
  # example: translate and rephrase a request for a POI (with completed city), connector and time
  Original language: english
  User request: Locate Combined Charging System chargers near La Rambla at 18:00
  Your translation: `,
    assistant: 'I want to charge with a Combined Charging System connector. I want to charge at La Rambla, Barcelona. I will arrive there at 6pm.'
  },

  {
    projectIds: [],
    user: `
  Original language: english
  User request: I want to charge near norteshopping at a 50kw station
  Your translation: `,
    assistant: 'I want to charge at Norteshopping. I want to charge with exactly 50kW.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  # Example: The word "station" in "I need to charge at a station in <city>" can be ignored.
  User request: Take me to a station in Lisbon.
  Your translation: `,
    assistant: 'I want to charge in Lisbon.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  # Example: key-words in combination like "from" and mentioning a second city should be translated as a request to plan a trip.
  User request: I'm from Algarve and I want to charge in Alcácer do Sal
  Your translation:: `,
    assistant: 'I want to drive from Algarve to Alcácer do Sal.'
  },
  {
    projectIds: [],
    user: `
  Original language: german
  # Example: Reference to an already given location does not lead to the current location being requested.
  User request: Jetzt dort laden
  Your translation: `,
    assistant: 'I want to charge now. I want to charge at that location.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  # Example: Along the route request with stop need at a POI
  User request: On my way to Munich I want to stop at a restaurant.
  Your translation: `,
    assistant: 'I want to charge on my way to Munich. Along the way, I want to stop at a restaurant.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  # Example: Along the route request 
  User request: I’m driving to Lisbon at the moment. Where can I charge?
  Your translation: `,
    assistant: 'I want to charge along the way to Lisbon.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  # Example: Along the route request with stop need at a POI
  User request: I’m traveling to Marseille and want to charge near a restaurant. Any recommendations?
  Your translation: `,
    assistant: 'I want to charge along the way to Marseille. Along the way, I want to stop at a restaurant.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  # Example: Along the route request
  User request: I need to charge on my trip to Antwerp. Any suggestions?
  Your translation: `,
    assistant: 'I want to charge along the way to Antwerp.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  # Example: Along the route request with stop need at a POI
  User request: I need to charge near a toilet on my way to Naples.
  Your translation: `,
    assistant: 'I want to charge along the way to Naples. Along the way, I want to stop at a toilet.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  # Example: Along the route request with stop need at a charger by EnBW
  User request: Going to Munich and need a charging station from EnBW
  Your translation: `,
    assistant: 'I want to charge along the way to Munich. Along the way, I want to stop at an EnBW charge point.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  # Example: always assume the user wants to charge at the requested location
  User request: Do you have any recommendations for local attractions?
  Your translation: `,
    assistant: 'I want to charge at a local tourist attraction.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  # Example: always assume the user wants only one of the locations mentioned
  User request: Whats the nearest hospital or clinic?
  Your translation: `,
    assistant: 'I want to charge at a hospital near my location.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  # Example: always assume the user wants only one of the locations mentioned
  User request: Whats the nearest coffee shop or cafe?
  Your translation: `,
    assistant: 'I want to charge at a coffee shop near my location.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  # Example: always assume the user wants to charge at the requested location.
  User request: Restaurant nearby me?
  Your translation: `,
    assistant: 'I want to charge at a restaurant near my location.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  # Example: Request for functionality description
  User request: What can I do here?
  Your translation: `,
    assistant: 'What can you help me with?'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  # Example: Include all information. Leave nothing out!
  User request: Show me all charging stops with McDonalds between Munich and Prague.
  Your translation: `,
    assistant: 'I want to charge at McDonalds. I want to charge between Munich and Prague.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  # Example: Include all information. Leave nothing out!
  User request: Display all rapid chargers along the A9 between Berlin and Munich.
  Your translation: `,
    assistant: 'Show all required chargers for my trip. I want to charge on the A9 highway between Berlin and Munich. I want to charge with a rapid charger.'
  },
  {
    projectIds: [],
    user: `
  Original language: german
  # Example: Make sure it is understood that the search radius is 100 km
  User request: Finde mir einen Ladestopp in den nächsten 100 Kilometern.
  Your translation: `,
    assistant: 'I want to charge at a charging stop within a 100km radius.'
  },
  {
    projectIds: [],
    user: `
  Original language: czech
  # Example: never translate the word street from the original language request
  User request: Ukaž mi nabíječky na ulici Novodvorská Praha
  Your translation: `,
    assistant: 'I want to charge at Novodvorská, Prague.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  User request: I'm going from East of Frankfurt to Würzburg. I need charge points along the way.
  Your translation: `,
    assistant: 'I want to charge along the way from the east of Frankfurt to Würzburg.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  User request: I need a charge point on my way to the Munich main station.
  Your translation: `,
    assistant: 'I want to charge on my way to Munich main station.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  User request: Charging between Zurich main station and Lausanne.
  Your translation: `,
    assistant: 'I want to charge on my way from Zurich main station to Lausanne.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  User request: From here to Munich Marienplatz. Where can I charge along the way at a fats food chain?
  Your translation: `,
    assistant: 'I want to charge on the way to Marienplatz, Munich. I want to charge at a fast food chain.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  User request: Sportisimo in Prague city center.
  Your translation: `,
    assistant: 'I want to charge at Sportisimo in Prague, center.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  User request: Show me coffee shops with charger nearby in Lisbon
  Your translation: `,
    assistant: 'I want to charge at a coffee shop in Lisbon.'
  },
  {
    projectIds: [],
    user: `
  Original language: english
  User request: North of Dortmund with a McDonald's nearby
  Your translation: `,
    assistant: 'I want to charge at a McDonalds, north of Dortmund.'
  },
  
  
];
