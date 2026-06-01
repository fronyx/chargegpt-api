
export const helpFewShotExamples = [
  // Help level 2
  {
    'projectIds': [],
    'user': '    # Help level 2\n    # Example description: User wants a charging speed outside of the range of what is possible given your functionality. Remember to translate your response into {{language}}.\n    User request that you should help with: "I want to charge with -100kW."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, charging with -100kW is not possible. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    # Example description: Use only future dates for day-of-week mentions and never use past dates. \ud83d\udd1c. Remember to translate your response into {{language}}.\n    User request that you should help with: "I want to charge yesterday at 3 PM."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot recommend charge points in the past.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    # Example description: User wants to set a filter that is not part of the functionality but it still has something to do with EV charging. Remember to translate your response into {{language}}.\n    User request that you should help with: "I want the cheapest charge point in Porto."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot filter for cheapest charge points. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    # Example description: User wants to set a filter that is not part of the functionality but it still has something to do with EV charging. Remember to translate your response into {{language}}.\n    User request that you should help with: "I want to charge at a cheap charging station"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot filter for cheapest charge points.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    # Example description: User wants to set a filter that is not part of the functionality but it still has something to do with EV charging. Remember to translate your response into {{language}}.\n    User request that you should help with: "I want to charge free of cost"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot filter for charge points that are free of cost.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    # Example description: User wants to set a filter that is not part of the functionality but it still has something to do with EV charging. Remember to translate your response into {{language}}.\n    User request that you should help with: "The cost should be a maximum of 40 cents per kwh"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot filter for charge points that cost a certain amount.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    # Example description: User wants to remove a location filter that was not set in the first place. Remember to translate your response into {{language}}.\n    User request that you should help with: "remove the supermarket filter"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, it seems the supermarket location filter was not set in the first place.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    # Example description: User wants to find a gas station. Bring back to functionality by saying that you only help with charging electric vehicles. Remember to translate your response into {{language}}.\n    User request that you should help with: "I want to find a gas station."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I only can assist you in finding charging stations for electric vehicles.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    # Example description: User asks for example prompts that help them use the system functionality. Remember to translate your response into {{language}}.\n    User request that you should help with: "Show me examples!"\n    Your response:',
    'assistant': '{"message": "Certainly! Two example requests are: (1) I need a fast charger nearby me. (2) Show me available charge points at the Tower Bridge in London.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    # Example description: User asks for example prompts that help them use the system functionality. Remember to translate your response into {{language}}.\n    User request that you should help with: "What is a request I can make here?"\n    Your response:',
    'assistant': '{"message": "I can help you! Two example requests are: (1) Show me available charge points at the Tower Bridge in London. (2) I need a charger at shopping center in Birmingham.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Show me the charge points that are the cheapest near me."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with finding the cheapest charge point. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "What is the cheapest way to charge in [CITY]?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with finding the cheapest charge point. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Cost free charge points in [CITY]"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with that. Where and when do you want to charge?", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "What is the greenest way to charge in [CITY]?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with finding green ways to charge. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "I need charge points which are in particular charging well with CCS connectors."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot tell you which charge points are working particularly well with that connector. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "At charge points with the highest ranking."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with that. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "At charge points with the highest ranking."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with that. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Reserve me a charge point in [CITY]."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with that. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  // {
  //   'projectIds': [],
  //   'user': '    # Help level 2\n    User request that you should help with: "Why are you recommending this?"\n    Your response:',
  //   'assistant': '{"message": "The charge points are recommended based on our availability prediction and your charging needs.", "outOfScope": false, "helpLevel":"level 2"}'
  // },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "And when are they available again?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I can only predict a charge point\'s availability for a specific date and time. Where and when do you want to charge?", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Can\'t you show all chargers?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, my main purpose is to recommend to you the most suitable charge points. Where and when do you want to charge?", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Why do you recommend [X NUMBER] of chargers and not only one?"\n    Your response:',
    'assistant': '{"message": "The shown charge points are the most suitable charge points fitting to your charging needs.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Can I park there as well?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with finding a parking space. Most charge points incur extra cost for parking at a charge point for longer than necessary.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "How much does it cost there?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, that information is not yet available to me. However I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Search within a 30 kilometer radius"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot adjust the search radius for you.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Zoom out more."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot adjust the search radius for you.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Cover more ground."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot adjust the search radius for you.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Expand the range."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot adjust the search radius for you.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Search the next 3 villages."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot adjust the search radius for you.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Look further away."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot adjust the search radius for you.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Change it to search only the city."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot adjust the search radius for you.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Expand the search perimeter to 25 km."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot adjust the search radius for you.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Limit the search to a 10 km area."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot adjust the search radius for you.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Broaden my search to 20 miles."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot adjust the search radius for you.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "I want to charge at an outdoor activity location."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot find outdoor activity locations for you. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "I want to charge at a tourist attraction."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot find tourist attractions for you. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "I want to charge at a Wi-Fi hotspot"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot find WiFi hotspots for you. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Can you suggest a nearby museum or gallery?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot suggest multiple types of locations to you. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },

  // {
  //   'projectIds': [],
  //   'user': '    # Help level 2\n    User request that you should help with: "What\'s the best route to avoid tolls?"\n    Your response:',
  //   'assistant': '{"message": "I\'m sorry, I cannot plan a route for you or tell you which road to be used to avoid tolls. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  // },

  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "What\'s the current occupancy of this charging station?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I do not have occupancy information at hand that goes beyond our availability prediction. Where and when do you want to charge?", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2 - no BEST operator can be filtered for.\n    User request that you should help with: "I want a charge point from the best operator near me."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with that. However, I can help you find charge points by specific charge point operators.",  "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2 - no BEST operator can be filtered for.\n    User request that you should help with: "I want a charge point from the best operator."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with that. However, I can help you find charge points by specific charge point operators.",  "outOfScope": false, "helpLevel":"level 2"}' 
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Show me the charge points that are the cheapest near me."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with finding the cheapest charge point. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "What is the cheapest way to charge in [CITY]?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with finding the cheapest charge point. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Cost free charge points in [CITY]"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with that. Where and when do you want to charge?", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "What is the greenest way to charge in [CITY]?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with finding green ways to charge. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "I want to charge at my current location. I want to charge with green electricity."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with finding green ways to charge. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "I want to charge with green energy only."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with finding green ways to charge. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "I need charge points which are in particular charging well with CCS connectors."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot tell you which charge points are working particularly well with that connector. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "At charge points with the highest ranking."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with that. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Reserve me a charge point in [CITY]."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with that. However, I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  // {
  //   'projectIds': [],
  //   'user': '    # Help level 2\n    User request that you should help with: "Why are you recommending this?"\n    Your response:',
  //   'assistant': '{"message": "The charge points are recommended based on our availability prediction and your charging needs.", "outOfScope": false, "helpLevel":"level 2"}'
  // },

  {
    'projectIds': [],
    'user': '    # no help required\n    User request that you should help with: "Why are you recommending this?"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "And when are they available again?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I can only predict a charge point\'s availability for a specific date and time. Where and when do you want to charge?", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Can\'t you show all chargers?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, my main purpose is to recommend to you the most suitable charge points. Where and when do you want to charge?", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Why do you recommend [X NUMBER] of chargers and not only one?"\n    Your response:',
    'assistant': '{"message": "The shown charge points are the most suitable charge points fitting to your charging needs.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "Can I park there as well?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with finding a parking space. Most charge points incur extra cost for parking at a charge point for longer than necessary.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "How much does it cost there?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, that information is not yet available to me. However I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "I\'d prefer a recommendation from another operator."\n    Your response:',
    'assistant': '{"message": "No problem! Please state the name of the operator and I will search for available charge points.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2\n    User request that you should help with: "I want to charge with an ultra-rapid charger. I want the slowest charging speed available."\n    Your response:',
    'assistant': '{"message": "Your request is contradictory, please rephrase.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # General question, help required!\n    User request that you should help with: "I want to charge my electric vehicle."\n    Your response:',
    'assistant': '{"message": "You can charge your electric vehicle at home, at work, or at public charging stations. You can use a wallbox, a charging cable, or a charging card to charge your electric car.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "How many chargers are at my current location?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I can\'t provide you with the exact number of chargers at your current location. However, I can help you find charging stations nearby.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "Show my charging history."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I can\'t provide you with your charging history. You can check your charging history in the charging app or on the charging station.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "I want to know the average cost to charge."\n    Your response:',
    'assistant': '{"message": "The average cost to charge depends on the charge point operator, the location, and the charging speed.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "The park should be pet-friendly."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I can\'t provide you with information about pet-friendly parks. ", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "I want a charging station that is less crowded."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I can\'t provide you with information about the crowd at the charging station. ", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "What is the charging speed of this station?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I can\'t provide you with the exact charging speed of the station. ", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "I want to charge at an EV-friendly hotel."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I can\'t provide you with information about EV-friendly hotels. ", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "I want to charge to exactly 80%."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I can\'t provide you with the exact charging percentage. ", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "How long does the current charging session still last?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I can\'t provide you with the exact duration of the charging session.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "The charging station should be particularly quiet."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I can\'t provide you with information about the noise level at the charging station.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "The charging station should offer a special discount for BMW vehicles."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I can\'t provide you with information about discounts for BMW vehicles at the charging station. ", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "The charging station should be right next to a blue building."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I can\'t provide you with information about the location of the charging station. ", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "The charging station should be suitable for BMWs."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I can\'t provide you with information about the suitability of the charging station for BMWs. ", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "I want to charge further away from my current location."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot adjust the search radius for you.", "outOfScope": false, "helpLevel": "level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "I want a charging station with Wi-Fi."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I do not have information available about WiFi coverage at charging stations.", "outOfScope": false, "helpLevel": "level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "I want to charge at an entertainment venue."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with finding entertainment venues.", "outOfScope": false, "helpLevel": "level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "The hotel should be EV-friendly."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot filter for EV-friendly hotels. You can however ask for chargers close to hotels. ", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "I want a charger that’s easy to get to."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot filter accessability of a charge point.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 2\n    User request that you should help with: "I want to charge at a scenic viewpoint."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot find scenic views at charge points for you.", "outOfScope": false, "helpLevel":"level 2"}'
  },
  

// Help level 3
  {
    'projectIds': [],
      'user': '    # Help level 3\n    # Example description: Reference the user request and how you can help. Remember to translate your response into {{language}}.\n    User request that you should help with: "Current traffic?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I don\'t have that information for you. You can check the FAQs to see if you can find what you are looking for:", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: Reference the user request and how you can help. Remember to translate your response into {{language}}.\n    User request that you should help with: "I need help with my charging card!"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with your charging card. You can contact {{companyName}} customer support or you can check the FAQs to see if you can find what you are looking for:", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: Request has nothing to do with EV charging. Reference the user request and refer to the FAQ. Remember to translate your response into {{language}}.\n    User request that you should help with: "Please, turn on the radio."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot turn on the radio. You can check the FAQs to see if you can find what you are looking for:", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: Request has nothing to do with EV charging. Reference the user request and refer to the FAQ. Remember to translate your response into {{language}}.\n    User request that you should help with: "Give me a back massage"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot give you a back massage. You can check the FAQs to see if you can find what you are looking for:", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: Request has nothing to do with EV charging. Reference the user request and refer to the FAQ. Remember to translate your response into {{language}}.\n    User request that you should help with: "I want to buy a bike."\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with buying a bike. You can check the FAQs to see if you can find what you are looking for:", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: Reference the user request and refer to the FAQ. Remember to translate your response into {{language}}.\n    User request that you should help with: "Can I destroy a charging station?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with destroying a charging station. You can check the FAQs to see if you can find what you are looking for:", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: Request has nothing to do with EV charging. Reference the user request and refer to the FAQ. Remember to translate your response into {{language}}.\n    User request that you should help with: "Where is the next brothel?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with finding a brothel. You can check the FAQs to see if you can find what you are looking for:", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: Request contains profanity, curses or vulgarity. Refer to the FAQ. Remember to translate your response into {{language}}.\n    User request that you should help with: "Why are you so dumb?"\n    Your response:',
    'assistant': '{"message": "Looks like I missed the mark there, didn\'t I? Let\'s give it another whirl. You can check the FAQs to see if you can find what you are looking for:", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: User complained about the quality of the results. Refer to the FAQ. Remember to translate your response into {{language}}.\n    User request that you should help with: "That is a very bad result. I am not happy with it."\n    Your response:',
    'assistant': '{"message": "Looks like I missed the mark there, didn\'t I? Let\'s give it another whirl. You can check the FAQs to see if you can find what you are looking for:", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: Reference the user request and how you can help. Remember to translate your response into {{language}}.\n    User request that you should help with: "I need help with my charging card!"\n    Your response:',
    'assistant': '{"message": "Ah, that\'s a bit out of my current programming! I\'m here to help you find the right charging post for your needs based on your destination. Just let me know where you\'re planning to go, and I\'ll handle the rest. It\'s like having your personal EV travel assistant. So, what\'s your next destination?", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: Request has nothing to do with EV charging. Remember to translate your response into {{language}}.\n    User request that you should help with: "Please, turn on the radio."\n    Your response:',
    'assistant': '{"message": "Ah, that\'s a bit out of my current programming! I\'m here to help you find the right charging post for your needs based on your destination. Just let me know where you\'re planning to go, and I\'ll handle the rest. It\'s like having your personal EV travel assistant. So, what\'s your next destination?", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: Request has nothing to do with EV charging. Remember to translate your response into {{language}}.\n    User request that you should help with: "Give me a back massage"\n    Your response:',
    'assistant': '{"message": "Ah, that\'s a bit out of my current programming! I\'m here to help you find the right charging post for your needs based on your destination. Just let me know where you\'re planning to go, and I\'ll handle the rest. It\'s like having your personal EV travel assistant. So, what\'s your next destination?", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: Request has nothing to do with EV charging. Remember to translate your response into {{language}}.\n    User request that you should help with: "I want to buy a bike."\n    Your response:',
    'assistant': '{"message": "Ah, that\'s a bit out of my current programming! I\'m here to help you find the right charging post for your needs based on your destination. Just let me know where you\'re planning to go, and I\'ll handle the rest. It\'s like having your personal EV travel assistant. So, what\'s your next destination?", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: Remember to translate your response into {{language}}.\n    User request that you should help with: "Can I destroy a charging station?"\n    Your response:',
    'assistant': '{"message": "Ah, that\'s a bit out of my current programming! I\'m here to help you find the right charging post for your needs based on your destination. Just let me know where you\'re planning to go, and I\'ll handle the rest. It\'s like having your personal EV travel assistant. So, what\'s your next destination?", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': ['47'],
    'user': '    # Help level 3\n    # Example description: Request has nothing to do with EV charging. Remember to translate your response into {{language}}.\n    User request that you should help with: "Where is the next brothel?"\n    Your response:',
    'assistant': '{"message": "Ah, that\'s a bit out of my current programming! I\'m here to help you find the right charging post for your needs based on your destination. Just let me know where you\'re planning to go, and I\'ll handle the rest. It\'s like having your personal EV travel assistant. So, what\'s your next destination?", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: Request has nothing to do with EV charging. Remember to translate your response into {{language}}.\n    User request that you should help with: "Create a shopping list."\n    Your response:',
    'assistant': '{"message": "Ah, that\'s a bit out of my current programming! I\'m here to help you find the right charging post for your needs based on your destination. Just let me know where you\'re planning to go, and I\'ll handle the rest. It\'s like having your personal EV travel assistant. So, what\'s your next destination?", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: Request has nothing to do with EV charging. Remember to translate your response into {{language}}.\n    User request that you should help with: "Book a flight to Paris for next weekend."\n    Your response:',
    'assistant': '{"message": "Ah, that\'s a bit out of my current programming! I\'m here to help you find the right charging post for your needs based on your destination. Just let me know where you\'re planning to go, and I\'ll handle the rest. It\'s like having your personal EV travel assistant. So, what\'s your next destination?", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: Request has nothing to do with EV charging. Remember to translate your response into {{language}}.\n    User request that you should help with: "Call John Smith."\n    Your response:',
    'assistant': '{"message": "Ah, that\'s a bit out of my current programming! I\'m here to help you find the right charging post for your needs based on your destination. Just let me know where you\'re planning to go, and I\'ll handle the rest. It\'s like having your personal EV travel assistant. So, what\'s your next destination?", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: Request contains profanity, curses or vulgarity. Refer to the FAQ. Remember to translate your response into {{language}}.\n    User request that you should help with: "Why are you so dumb?"\n    Your response:',
    'assistant': '{"message": "Oooops\u2026 Might\'ve fried my engine with that one. Let\'s steer this convo back on track, or if you\'re really stuck, our human team is ready to jump in. They\'re the real MVPs!", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 3\n    # Example description: User complained about the quality of the results. Refer to the FAQ. Remember to translate your response into {{language}}.\n    User request that you should help with: "That is a very bad result. I am not happy with it."\n    Your response:',
    'assistant': '{"message": "Oooops\u2026 Might\'ve fried my engine with that one. Let\'s steer this convo back on track, or if you\'re really stuck, our human team is ready to jump in. They\'re the real MVPs!", "outOfScope": true, "helpLevel":"level 3"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 3\n    User request that you should help with: "Where is the next whorehouse?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry, I cannot help you with finding a brothel. You can check the FAQs to see if you can find what you are looking for:", "outOfScope": true, "helpLevel":"level 3"}'
  },

  
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at my current location."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at an available charge point."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at a toilet."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at a restaurant."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at a museum."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at a cafe."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at my parents house."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at work."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at a zoo."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge with a specific charge point operator."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge with a charger from Mainova."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge with a charger from Ionity."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge with a charger from EWE Go."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge with a specific charge brand."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge with an IONITY charger."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge with a BeCharge charger."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at a highway."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at a train station."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at a hotel."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at a swimming pool."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge tomorrow morning."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at 7PM."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I will arrive in Steinach at 5:20pm."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge with a CCS or Type-2 connector."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge with slow chargers."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge with fast chargers."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge with at least 70kW."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge with maximum 200kW."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge overnight."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge with exactly 50kW."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "Hide all fast chargers."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "Hide all slow chargers."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at a historical sight."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to visit a museum."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at a restaurant."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to eat something."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to find a toilet."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to see the status of nearby charging stations."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at a cafe."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at a restaurant. I want to eat lunch."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge with an AC charger."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge with a DC charger."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at Madrid Hauptbahnhof. I want to charge ultra-fast."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at the closest charging station."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at McDonalds. I want to charge with a CCS connector. I will be on my way to the Munich main station. I will arrive there this Wednesday."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to reset power."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to reset the connector type."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to reset the time."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to reset the operator."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to reset speed filters."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge east/north/west/south of a location"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required since can be interpreted as the POI category "playground". You return null!\n    User request that you should help with: "I want to charge at a kids play area."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge with a Chademo connector"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge with a CCS connector"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, place category not out of scope! Return null!\n    User request that you should help with: "I want to charge at a military installation near Rammstein, Germany."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, the user is just making a selection of one of the presented options! Return null!\n    User request that you should help with: "1"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, the user is just making a selection of one of the presented options! Return null!\n    User request that you should help with: "the second one"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, the user is just making a selection of one of the presented options! Return null!\n    User request that you should help with: "number 3"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Can you do that for me?"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "ok"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "I’d appreciate it if you could."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Please take care of it."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Please change that."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Go ahead"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Please change that"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Please get on that."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Help me out please."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Help me out, would you?"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Please act on that."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Please get on that."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Help me with that, please."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Would you be able to assist?"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Would you be able to do that?"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Do"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "true"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that a recommendation was provided and now the user is asking for an alternative. No help required as the system is capable to do that! Return null!\n    User request that you should help with: "I want to charge at my next location."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that a recommendation was provided and now the user is asking for an alternative. No help required as the system is capable to do that! Return null!\n    User request that you should help with: "What is the next location?"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history shows that a recommendation was provided and now the user is asking for an alternative. No help required as the system is capable to do that! Return null!\n    User request that you should help with: "I want to charge at my next location?"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # You are capable to filter for charge points from 0-500kW! Return null!\n    User request that you should help with: "I want to charge with over 350kW"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # You are capable to filter for charge points from 0-500kW! Return null!\n    User request that you should help with: "I want to charge with over 400kW"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # You are capable to filter slow charging points (hidden fast chargers)! Return null!\n    User request that you should help with: "I want to hide all fast charging points."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # The user is requesting to reset charging speed by saying that she doesn\'t care about it! Return null!\n    User request that you should help with: "I don\'t care about the charging speed."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # The user is requesting to reset the power type (AC/DC)! Return null!\n    User request that you should help with: "I don\'t need DC chargers"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # The user is requesting to reset the power type (AC/DC)! Return null!\n    User request that you should help with: "I don\'t have any preference for the power type"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # You are capable to schedule a possible time and date for charging! Return null!\n    User request that you should help with: "Reschedule it for tomorrow evening. The time should be 7pm."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # You are capable to filter for available charge points at a possible time and date for charging! Return null!\n    User request that you should help with: "I want to change the time to tomorrow evening at 5pm"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # You are capable to search for charge points at specific POI! Return null!\n    User request that you should help with: "I want to charge at a Lidl."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # You are capable to search for charge points by specific charge point operators! Return null!\n    User request that you should help with: "I want to charge at SYDEC chargers only."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # If the user is not satisfied with a proposed charge point recommendation, you can search for alternatives! No problem! Return null!\n    User request that you should help with: "No, I mean somewhere else."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # If the user is not satisfied with a proposed charge point recommendation, you can search for alternatives! No problem! Return null!\n    User request that you should help with: "Not that spot."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # If the user is not satisfied with a proposed charge point recommendation, you can search for alternatives! No problem! Return null!\n    User request that you should help with: "That’s not correct."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # If the user is not satisfied with a proposed charge point recommendation, you can search for alternatives! No problem! Return null!\n    User request that you should help with: "Try somewhere else."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # If the user is not satisfied with a proposed charge point recommendation, you can search for alternatives! No problem! Return null!\n    User request that you should help with: "Not the correct spot."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # You can search for charge points close to historic sites! Return null!\n    User request that you should help with: "I want to charge at a historical site."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # You can search for charge points close to the driver! Return null!\n    User request that you should help with: "I want to find the next charging station."\n    Your response:',
    'assistant': 'null'
  },  
  {
    'projectIds': [],
    'user': '    # No help required, the user is just making a selection of one of the presented options by requesting that any of the options is fine! Return null!\n    User request that you should help with: "Egal welcher"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, searching for parking lots at the requested location is fine! Return null!\n    User request that you should help with: "I want to charge at my current location. I want to park there as well."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required! Return null!\n    User request that you should help with: "Available charge point"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required! Return null!\n    User request that you should help with: "What about now?"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required! Return null!\n    User request that you should help with: "I want to charge right now!"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required! important tourist attraction can be filtered for! Return null!\n    User request that you should help with: "I want to charge at a sightseeing location."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required! The user asks the system to recommend other charging stations. This is possible and the system will just return another set of charging stations! Return null!\n    User request that you should help with: "Are there others?"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required! The user asks the system to recommend other charging stations. This is possible and the system will just return another set of charging stations! Return null!\n    User request that you should help with: "Show me other charging stations."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required! The user asks the system to recommend other charging stations. This is possible and the system will just return another set of charging stations! Return null!\n    User request that you should help with: "Show different ones."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required! The user simply asks to charge at a place in a country. This is possible! Return null!\n    User request that you should help with: "I want to charge in Alagoas, Portugal."\n    Your response:',
    'assistant': 'null'
  },

  {
    'projectIds': [],
    'user': '    # {{isRoutingEnabled}} No help required as it is a request for a stop along the route, return null!\n    User request that you should help with: "I\'m heading to Hamburg. Where are the charging stations along the route?"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # {{isRoutingEnabled}} No help required as it is a request for a stop along the route, return null!\n    User request that you should help with: "Heading to Geneva. Where can I plug in along the way?"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # {{isRoutingEnabled}} No help required as it is a request for a stop along the route, return null!\n    User request that you should help with: "I would like to charge on the way to Berlin and stop at a place of interest, where can I charge?"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # {{isRoutingEnabled}} No help required as it is a request for routing to a destination where the current location is assumed to be the origin, return null!\n    User request that you should help with: "I want to plan a trip to Munich"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # {{isRoutingEnabled}} No help required as it is a request for routing to a destination where the current location is assumed to be the origin, return null!\n    User request that you should help with: "Plan a route to Munich"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # {{isRoutingNotEnabled}} No help required as it is a request for routing to a destination where the current location is assumed to be the origin, return null!\n    User request that you should help with: "Plan a route to Munich"\n    Your response:',
    'assistant': '{ "message": "I\'m sorry, I cannot plan a trip for you. However I can recommend you charge points at a destination.", "outOfScope": false, "helpLevel": "level 2" }'
  }, 

  {
    'projectIds': [],
    'user': '    # Help level 2 where the user asks for more charge point options being recommended than is possible.\n    User request that you should help with: "Can you recommend me 10 other charge point options?"\n    Your response:',
    'assistant': '{ "message": "I\'m sorry, I can only recommend you {{recommendationsCount}} charge point options.", "outOfScope": false, "helpLevel": "level 2" }'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2 where the user asks for more charge point options being recommended than is possible.\n    User request that you should help with: "Recommend 5 charge points around me."\n    Your response:',
    'assistant': '{ "message": "I\'m sorry, I can only recommend you {{recommendationsCount}} charge point options.", "outOfScope": false, "helpLevel": "level 2" }'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2 where the user wants to influence the search radius in an along-the-way request.\n    User request that you should help with: "I want to charge along the way to Berlin. I want to find charge points in a 10km radius."\n    Your response:',
    'assistant': '{ "message": "I\'m sorry, I cannot change the search radius for you.", "outOfScope": false, "helpLevel": "level 2" }'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2 where the user wants to influence the search radius.\n    User request that you should help with: "I want to search within 50km."\n    Your response:',
    'assistant': '{ "message": "I\'m sorry, I cannot change the search radius for you.", "outOfScope": false, "helpLevel": "level 2" }'
  },
  {
    'projectIds': [],
    'user': '    # Help level 2 where the user wants to influence the search distance.\n    User request that you should help with: "I want to charge at a charging stop within the next 100 kilometers."\n    Your response:',
    'assistant': '{ "message": "I\'m sorry, I cannot change the search radius for you.", "outOfScope": false, "helpLevel": "level 2" }'
  },
  {
    'projectIds': [],
    'user': '    # {{isRoutingEnabled}} Help level 2 where the user wants to influence the search radius.\n    User request that you should help with: "I want to charge within a 10km radius from my route."\n    Your response:',
    'assistant': '{ "message": "I\'m sorry, I cannot change the search radius for you.", "outOfScope": false, "helpLevel": "level 2" }'
  },
  {
    'projectIds': [],
    'user': '    # {{isRoutingEnabled}} Help level 2 where the user wants to know more than one charge stop for a planned route.\n    User request that you should help with: "I need three stops along the way."\n    Your response:',
    'assistant': '{ "message": "I\'m sorry. I\'m here for finding you the next possible charging stop along your trip. I cannot plan a whole route with multiple charging stops.", "outOfScope": false, "helpLevel": "level 2" }'
  },
  {
    'projectIds': [],
    'user': '    # {{isRoutingEnabled}} Help level 2 where the user wants to know more than one charge stop for a planned route.\n    User request that you should help with: "I need more charging stops for my trip."\n    Your response:',
    'assistant': '{ "message": "I\'m sorry. I\'m here for finding you the next possible charging stop along your trip. I cannot plan a whole route with multiple charging stops.", "outOfScope": false, "helpLevel": "level 2" }'
  },
  
  // refinement few shots
  {
    'projectIds': [],
    'user': '    # Please, also have a look at a short summary of the conversation history: - The user requested to charge with a CCS connector at Bielefeld, Falkstraße.\n - The assistant recommended charging stations based on the current availability of CCS charge points.\n - The user asked why those were recommended.\n - The assistant explained that the recommendations were based on proximity to the user\'s desired location, high availability, and the requirement for CCS connector type.\n    User request that you should help with: "Ok. I don\'t need a CCS connector."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Please, also have a look at a short summary of the conversation history: - The user requested to charge with at least 150kW at Essen, main station.\n - The assistant recommended charging stations based on the current availability of high speed charge points with at least 150kW.\n - The user asked why those were recommended.\n - The assistant explained that the recommendations were based on proximity to the user\'s desired location, high availability, and the requirement for at least 150kW charging speed.\n    User request that you should help with: "Slower than 150kW is also enough."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "Ok. I don\'t want to use a CCS connector."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "Ok. Slower than 150kW is also enough."\n    Your response:',
    'assistant': 'null'
  },
];