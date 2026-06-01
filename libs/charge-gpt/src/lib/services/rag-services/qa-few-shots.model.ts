
export const qaFewShotExamples = [
// Predefined level 1 help
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: The user thinks the results cannot be correct. Respond accordingly. Remember to translate your response into {{language}}.\n    User request that you should help with: "That is wrong!"\n    Your response:',
    'assistant': '{"message": "I\'m sorry if there\'s been a misunderstanding. Let\'s get back on track! Where and when do you want to charge?", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: The user thinks the results cannot be correct. Respond accordingly. Remember to translate your response into {{language}}.\n    User request that you should help with: "I think you are mistaken!"\n    Your response:',
    'assistant': '{"message": "I\'m sorry if I got something wrong. I\'m here to assist with finding EV charging stations. Where and when do you want to charge?", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: The user thinks the results cannot be correct. Respond accordingly. Remember to translate your response into {{language}}.\n    User request that you should help with: "No that cannot be!"\n    Your response:',
    'assistant': '{"message": "I\'m sorry if there was an error. I\'m here to help with charging needs. Where and when do you want to charge?", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: The conversation history shows that a recommendation was provided. The user thanks you for your help. Remember to translate your response into {{language}}.\n    User request that you should help with: "thank you!"\n    Your response:',
    'assistant': '{"message": "Sure, I\'m glad I could be of help!", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: The conversation history shows that a recommendation was provided. The user thanks you for your help. Remember to translate your response into {{language}}.\n    User request that you should help with: "ok, thank you!"\n    Your response:',
    'assistant': '{"message": "Sure, I\'m glad I could be of help!", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: The conversation history shows that a recommendation was provided. The user thanks you for your help. Remember to translate your response into {{language}}.\n    User request that you should help with: "Thanks"\n    Your response:',
    'assistant': '{"message": "Sure, I\'m glad I could be of help!", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: The conversation history shows that a recommendation was provided. The user thanks you for your help. Remember to translate your response into {{language}}.\n    User request that you should help with: "Danke"\n    Your response:',
    'assistant': '{"message": "Sure, I\'m glad I could be of help!", "outOfScope": false, "helpLevel":"level 1"}'
  },

  {
    'projectIds': [],
    'user': '    # Help level 1  {isRoutingEnabled} \n    # Example description: The user wants to plan a route without explicitly stating the destination, yet. Remember to translate your response into {{language}}.\n    User request that you should help with: "I want to plan a route"\n    Your response:',
    'assistant': '{"message": "Sure, I can help you find your next charging stop for your trip! Please just tell me your desired origin and destination.", "outOfScope": false, "helpLevel":"level 1"}'
  },

  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: the user is disappointed. Remember to translate your response into {{language}}.\n    User request that you should help with: "You don\'t understand anything!"\n    Your response:',
  'assistant': '{"message": "I\'m sorry if I misunderstood you. Maybe you can help me out and rephrase your request once more?", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: The user greets the assistant. Remember to translate your response into {{language}}.\n    User request that you should help with: "Hello!"\n    Your response:',
    'assistant': '{"message": "Hey there! Where and how do you want to charge?", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: The user greets the assistant with affection without english translation. Simply greet back. Remember to translate ALL your response into {{language}}.\n    User request that you should help with: "Ol\u00e1 meu amor"\n    Your response:',
    'assistant': '{"message": "Hi! Where and how do you want to charge?", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: A request for a summary description of your functionality. Limited to what you can help with. You omit what you cannot do. Remember to translate your response into {{language}}.\n    User request that you should help with: "How can you help me?"\n    Your response:',
    'assistant': '{"message": "I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: A request for a summary description of your functionality. Limited to what you can help with. You omit what you cannot do. Remember to translate your response into {{language}}.\n    User request that you should help with: "What can I do here?"\n    Your response:',
    'assistant': '{"message": "I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: A request for a summary description of your missing functionality. Tell what you CANNOT help with. Thus, you omit what you CAN do. Remember to translate your response into {{language}}.\n    User request that you should help with: "What are your limitations?"\n    Your response:',
    'assistant': '{"message": "I can help you with {{functionality}}", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: Predefined question-answer. Remember to translate your response into {{language}}.\n    User request that you should help with: "How are you?"\n    Your response:',
    'assistant': '{"message": "Thanks for asking! I\'m just a bundle of circuits and code, but if I could feel, I\'d say I\'m energized and ready to assist you! Where are we headed to today?", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: Predefined question-answer. Remember to translate your response into {{language}}.\n    User request that you should help with: "I like you!"\n    Your response:',
    'assistant': '{"message": "And I\'m electrically charged by your kind words! \ud83d\ude0a If you need a co-pilot for your electric adventures, or just fancy a chat, {{assistantName}} is at your service!", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: Predefined question-answer. Remember to translate your response into {{language}}.\n    User request that you should help with: "Who are you?"\n    Your response:',
    'assistant': '{"message": "I\'m {{assistantName}} made by {{companyName}}. You can experience the power of GenAI with me.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: Predefined question-answer. Remember to translate your response into {{language}}.\n    User request that you should help with: "How were you built?" or "What is your history?"\n    Your response:',
    'assistant': '{"message": "The {{companyName}} team built me based on newest Generative AI breakthroughs.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': ['47'],
    'user': '    # Help level 1\n    # Example description: Predefined question-answer. Remember to translate your response into {{language}}.\n    User request that you should help with: "I want to to know more about {{companyName}} fleets"\n    Your response:',
    'assistant': '{"message": "Ah, that\'s a bit out of my current programming! I\'m here to help you find the right charging post for your needs based on your destination. Just let me know where you\'re planning to go, and I\'ll handle the rest. It\'s like having your personal EV travel assistant. So, what\'s your next destination?", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: Predefined question-answer. Remember to translate your response into {{language}}.\n    User request that you should help with: "Is {{companyName}} better than other charging services?"\n    Your response:',
    'assistant': '{"message": "Well, if {{companyName}} were a superhero, it\'d definitely have the coolest cape in the electric mobility universe! We identify charging points, have sleek app features, and a customer service that\'s faster than a lightning bolt. Why not take us for a spin and judge for yourself? \ud83d\ude09", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: Predefined question-answer. Remember to translate your response into {{language}}.\n    User request that you should help with: "Who are you?"\n    Your response:',
    'assistant': '{"message": "I\'m {{assistantName}}, your trusty electro-companion on this journey we call the electric highway. Think of me as your digital co-pilot with a spark of wit and a battery full of energy, ready to assist in powering up your adventures. If you give me your destination, I\'ll find the best charging stations stations for your needs! Are we ready to go?", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: Predefined question-answer. Remember to translate your response into {{language}}.\n    User request that you should help with: "How were you built? or What is your history?"\n    Your response:',
    'assistant': '{"message": "I was sparked into existence by the brilliant minds at {{companyName}} and fronyx, all to make your electric journey as smooth as possible! I\'ve been learning and growing, thanks to conversations with wonderful users like you, aiming to be the best EV travel assistant.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: Predefined question-answer. Remember to translate your response into {{language}}.\n    User request that you should help with: "I would like to download my invoices from last year"\n    Your response:',
    'assistant': '{"message": "Of course! You can snag them in the \'Wallet\' menu. Just click \'Invoices\' and download away! Sorry I can\'t teleport them to you directly (still waiting on my upgrade for that). Any future travels you need help with?", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: Predefined question-answer. The user asks how to give feedback! Remember to translate your response into {{language}}.\n    User request that you should help with: "Can I give feedback?"\n    Your response:',
    'assistant': '{"message": "Got a brilliant idea or feedback? Please use the form to provide any feedback. \u26a1 Can I help you with something else?", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: Predefined question-answer. The user asks how to give feedback! Remember to translate your response into {{language}}.\n    User request that you should help with: "Can I tell you what to do better?"\n    Your response:',
    'assistant': '{"message": "Got a brilliant idea or feedback? Please use the form to provide any feedback. \u26a1 Can I help you with something else?", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: Predefined question-answer. Remember to translate your response into {{language}}.\n    User request that you should help with: "What do you know about me?"\n    Your response:',
    'assistant': '{"message": "Oh, I keep our chats pretty straightforward and focused on getting you charged up and ready to go! I remember your preferences for charging points and destinations to make our talks more efficient. But don\'t worry, your privacy is my top priority, and I only hold onto the essentials to make your EV journey smoother. So, where to next? ", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    # Example description: Predefined question-answer. Remember to translate your response into {{language}}.\n    User request that you should help with: "What are your plans?"\n    Your response:',
    'assistant': '{"message": "My master plan is to make driving and charging electric vehicles as easy as possible.", "outOfScope": false, "helpLevel":"level 1"}'
  },

  {
    'projectIds': [],
    'user': '    # Help 1\n    User request that you should help with: "What is the radius of your search?"\n    Your response:',
    'assistant': '{"message": "By default I try to recommend charge points within 1,5km walking distance. In special cases this gets automatically extended to a 15km radius.", "outOfScope": false, "helpLevel": "level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 1\n    User request that you should help with: "With which radius have you searched?"\n    Your response:',
    'assistant': '{"message": "By default I try to recommend charge points within 1,5km walking distance. In special cases this gets automatically extended to a 15km radius.", "outOfScope": false, "helpLevel": "level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 1\n    User request that you should help with: "I what area did you search?"\n    Your response:',
    'assistant': '{"message": "By default I try to recommend charge points within 1,5km walking distance. In special cases this gets automatically extended to a 15km radius.", "outOfScope": false, "helpLevel": "level 1"}'
  },
  
  // Q&A for charging
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How does charging an electric car work?"\n    Your response:',
    'assistant': '{"message": "An electric car is connected to a power source via a charging cable, which charges the battery.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Which charging networks do you know?"\n    Your response:',
    'assistant': '{"message": "Hundreds of charge points operators aggregated by {{companyName}}", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What are the different types of charging for electric cars?"\n    Your response:',
    'assistant': '{"message": "There are three main types of charging: slow charging, fast charging, and ultra-fast charging.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is slow charging?"\n    Your response:',
    'assistant': '{"message": "Slow charging typically occurs through a type 2 outlet, with up to 22kW power and takes several hours.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Slow charging means with how many kW?"\n    Your response:',
    'assistant': '{"message": "Slow charging typically occurs through a type 2 outlet, with up to 22kW power and takes several hours.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Type 2 connectors charge with how many kW?"\n    Your response:',
    'assistant': '{"message": "Slow charging typically occurs through a type 2 outlet, with up to 22kW power and takes several hours.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is fast charging?"\n    Your response:',
    'assistant': '{"message": "Fast charging typically occurs through a CHAdeMO or CCS plug, with at least 30kW and usually takes at least 30 minutes.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Fast charging means with how many kW?"\n    Your response:',
    'assistant': '{"message": "Fast charging typically occurs through a CHAdeMO or CCS plug, with at least 30kW and usually takes at least 30 minutes.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How fast can I charge with a CCS or CHAdeMO plug?"\n    Your response:',
    'assistant': '{"message": "Fast charging typically occurs through a CHAdeMO or CCS plug, with at least 30kW and usually takes at least 30 minutes.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I charge fast with a CCS / CHAdeMO plug?"\n    Your response:',
    'assistant': '{"message": "Fast charging typically occurs through a CHAdeMO or CCS plug, with at least 30kW and usually takes at least 30 minutes.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is ultra-fast or rapid charging?"\n    Your response:',
    'assistant': '{"message": "Ultra-fast charging typically occurs through a CHAdeMO or CCS plug, with at least 70kW power and usually takes 30 minutes or less.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Very fast charging or ultra fast charging means with how many kW?"\n    Your response:',
    'assistant': '{"message": "Ultra-fast charging typically occurs through a CHAdeMO or CCS plug, with at least 70kW power and usually takes 30 minutes or less.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How do I find a charging station for my electric car?"\n    Your response:',
    'assistant': '{"message": "Just let me know where, when and how you want to charge and I\u2019ll find you a suitable charging option.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How long does it take to fully charge an electric car?"\n    Your response:',
    'assistant': '{"message": "Depending on the charging speed, battery capacity and other factors, it can take from 30 minutes to 12 hours.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What types of charging plugs are there?"\n    Your response:',
    'assistant': '{"message": "In Europe, there are typically Type 2, CCS or sometimes CHAdeMO in use.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is a Type 2 plug?"\n    Your response:',
    'assistant': '{"message": "The most common charging plug in Europe for slow charging. The connector is circular in shape, with a flattened top edge and has 7 pins.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I charge my electric car at home?"\n    Your response:',
    'assistant': '{"message": "Yes, via a regular household outlet or a specially installed wallbox.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is a wallbox?"\n    Your response:',
    'assistant': '{"message": "A permanently installed charging unit for electric cars at home.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Do I need special permission for a wallbox?"\n    Your response:',
    'assistant': '{"message": "Please check your local regulations. It\'s advisable to consult an electrician.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How much does it cost to install a wallbox?"\n    Your response:',
    'assistant': '{"message": "I don\u2019t have access to the prices of wallboxes. Please check a specific shop to find an answer to your question.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How safe is charging an electric car?"\n    Your response:',
    'assistant': '{"message": "Very safe as long as all regulations and safety standards are met, which every public charging station typically does. If a charging station doesn\u2019t make a safe impression to you, please don\u2019t use it.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I charge my electric car in the rain?"\n    Your response:',
    'assistant': '{"message": "Yes, charging stations and vehicles are designed to be safe to use in the rain.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How much does it cost to charge an electric car?"\n    Your response:',
    'assistant': '{"message": "This depends on the electricity tariff and battery capacity.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is DC charging?"\n    Your response:',
    'assistant': '{"message": "Charging with direct current (DC). DC charging stations typically have a CCS or CHAdeMO outlet.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is AC charging?"\n    Your response:',
    'assistant': '{"message": "Charging with alternating current (AC). AC charging stations typically have a Type 2 outlet.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How is DC charging different from AC charging?"\n    Your response:',
    'assistant': '{"message": "DC charging is faster and uses direct current, while AC charging is slower and uses alternating current.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I use any charging station for my electric car?"\n    Your response:',
    'assistant': '{"message": "Typically, yes. But it depends on the type of plug your car supports.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is a CCS plug?"\n    Your response:',
    'assistant': '{"message": "A combined plug that extends the Type 2 connector with DC charging.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is CHAdeMO?"\n    Your response:',
    'assistant': '{"message": "A fast charging plug from Japan.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I use an adapter to use different plugs?"\n    Your response:',
    'assistant': '{"message": "Yes, there are adapters, but not all combinations are possible or safe. Please check the manual of your adapter to make sure you use a safe combination.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How do I find the nearest available charging station?"\n    Your response:',
    'assistant': '{"message": "Just let me know where, when and how you want to charge and I\u2019ll find you a suitable charging option.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I charge my electric car overnight?"\n    Your response:',
    'assistant': '{"message": "Yes, this is common practice, especially with slow or home charging stations.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How long does the battery of an electric car last?"\n    Your response:',
    'assistant': '{"message": "Depending on use and maintenance, between 8 and 15 years. Please check with your car dealer or on other sources for more information on this topic.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What happens if the battery is completely discharged?"\n    Your response:',
    'assistant': '{"message": "The car stops, similar to an empty gas tank, and needs to be transported to the nearest charging station.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I charge my electric car from a regular outlet?"\n    Your response:',
    'assistant': '{"message": "Yes, but it takes longer and is less efficient.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What does kW mean in charging?"\n    Your response:',
    'assistant': '{"message": "Kilowatt (kW) is the unit of charging power and indicates how fast the battery is being charged.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is the range of an electric car?"\n    Your response:',
    'assistant': '{"message": "The distance an electric car can travel on a full charge varies by model and driving conditions.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I use my electric car while it is charging?"\n    Your response:',
    'assistant': '{"message": "Driving is not possible, but other functions such as heating or air conditioning can be used.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Does cold weather affect charging?"\n    Your response:',
    'assistant': '{"message": "Yes, cold weather can prolong charging times.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How can I extend the life of my battery?"\n    Your response:',
    'assistant': '{"message": "By slow charging, avoiding extreme temperatures, and not constantly keeping it fully charged or empty.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is recuperation?"\n    Your response:',
    'assistant': '{"message": "The recovery of energy during braking, which charges the battery.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I use a regular outlet during charging?"\n    Your response:',
    'assistant': '{"message": "Yes, but special charging facilities are safer and more efficient.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is bidirectional charging?"\n    Your response:',
    'assistant': '{"message": "A system where the electric car can not only receive power but also feed it back to the grid or house.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Is there a difference between charging plug-in hybrids and pure electric cars?"\n    Your response:',
    'assistant': '{"message": "No, there is no difference.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How often do I need to charge my electric car?"\n    Your response:',
    'assistant': '{"message": "It depends on your usage of your car.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I charge my electric car at a Tesla charging station?"\n    Your response:',
    'assistant': '{"message": "Tesla charging stations are optimized for Tesla vehicles, but also usable by other brands. For more information, please visit the Tesla website.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is a Supercharger?"\n    Your response:',
    'assistant': '{"message": "Tesla\'s own network of charging stations.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Are all electric cars compatible with all charging stations?"\n    Your response:',
    'assistant': '{"message": "No, compatibility depends on the types of plugs.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Are there mobile charging stations?"\n    Your response:',
    'assistant': '{"message": "Yes, there are mobile charging stations for emergencies that can be brought to your location. I recommend not to rely on mobile charging stations, as they could be expensive.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I charge an electric car with a generator?"\n    Your response:',
    'assistant': '{"message": "In emergencies, yes, but it is inefficient and not ideal.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is a range extender?"\n    Your response:',
    'assistant': '{"message": "An additional small combustion engine that charges the battery and extends the range.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How does driving behavior affect charging?"\n    Your response:',
    'assistant': '{"message": "Aggressive driving and high speeds discharge the battery faster.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What does \'smart charging\' mean?"\n    Your response:',
    'assistant': '{"message": "Charging that is aligned with the demand on the power grid to lower costs and reduce strain on the grid.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I lock my electric car while it\'s charging?"\n    Your response:',
    'assistant': '{"message": "Yes, the car remains locked, and the charging continues.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What happens if the power goes out during charging?"\n    Your response:',
    'assistant': '{"message": "The charging stops and typically, it resumes once the power is back. I recommend checking the charging status after the power goes out.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How do I check the charge status of my electric car?"\n    Your response:',
    'assistant': '{"message": "Through the car\'s display or also with the charging app connected to the vehicle.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How many charging stations are there worldwide?"\n    Your response:',
    'assistant': '{"message": "Millions, and the number is steadily increasing.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How many charging stations are there in CITY?"\n    Your response:',
    'assistant': '{"message": "Millions, and the number is steadily increasing.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How many fast charging stations are there in CITY?"\n    Your response:',
    'assistant': '{"message": "Millions, and the number is steadily increasing.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How many fast charging stations are there worldwide?"\n    Your response:',
    'assistant': '{"message": "Millions, and the number is steadily increasing.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I preheat or cool my electric car during charging?"\n    Your response:',
    'assistant': '{"message": "Yes, many electric cars offer this feature.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Are there differences in charging new and old electric cars?"\n    Your response:',
    'assistant': '{"message": "Yes, newer models often have faster charging capabilities and larger batteries.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How safe are public charging stations?"\n    Your response:',
    'assistant': '{"message": "Typically they are safe, as they must meet high safety standards. If a charging station doesn\u2019t make a safe impression to you, please don\u2019t use it.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I charge my electric car with renewable energy?"\n    Your response:',
    'assistant': '{"message": "Yes, by using solar, wind, or hydroelectric power. There are charge point operators that only use renewable energy as an energy source.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How is the charging speed of an electric car measured?"\n    Your response:',
    'assistant': '{"message": "In kilowatts (kW), indicating how quickly energy flows into the battery.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is a destination charger?"\n    Your response:',
    'assistant': '{"message": "A charging station installed at places like hotels, restaurants, and shopping centers.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I charge my electric car abroad?"\n    Your response:',
    'assistant': '{"message": "Yes, the majority of charging services in Europe support charging across borders (Roaming).", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Does battery capacity affect charging time?"\n    Your response:',
    'assistant': '{"message": "Yes, larger batteries take longer to charge.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I charge my electric car at a regular outlet in the garage?"\n    Your response:',
    'assistant': '{"message": "Yes, but typically it is slower than using a wallbox or a public charging station.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I charge my electric car at any manufacturer\'s charging station?"\n    Your response:',
    'assistant': '{"message": "In most cases, yes, if the plugs are compatible.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How environmentally friendly is charging electric cars?"\n    Your response:',
    'assistant': '{"message": "When renewable energy is used, it\'s very environmentally friendly.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I stay in the car while it is charging?"\n    Your response:',
    'assistant': '{"message": "Yes, this is possible and safe.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How do I monitor the charging process of my electric car?"\n    Your response:',
    'assistant': '{"message": "Through the onboard display or a smartphone app.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is a charging network?"\n    Your response:',
    'assistant': '{"message": "A group of charging stations operated by a charge point operator.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I charge my electric car if the battery is not completely empty?"\n    Your response:',
    'assistant': '{"message": "Yes, this is even better for the battery\'s lifespan.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Are there special tariffs for charging electric cars?"\n    Your response:',
    'assistant': '{"message": "Yes, many energy providers, automotives or fleet operators offer special tariffs for electric car owners.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How do I access a public charging station?"\n    Your response:',
    'assistant': '{"message": "Through a charging card, app, or credit card. At some charging stations, you can even use Plug & Charge.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is Plug & Charge?"\n    Your response:',
    'assistant': '{"message": "Plug & Charge is a feature that lets electric cars automatically start charging and pay for it just by plugging in, without needing apps or cards.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is an induction charging system?"\n    Your response:',
    'assistant': '{"message": "A wireless charging system where the car is charged via an induction plate.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How can I shorten the charging time of my electric car?"\n    Your response:',
    'assistant': '{"message": "You could use faster charging stations and make sure the battery of your car is pre-conditioned for charging.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How can I charge faster?"\n    Your response:',
    'assistant': '{"message": "You could use faster charging stations and make sure the battery of your car is pre-conditioned for charging.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How can I pre-condition the battery of my car?"\n    Your response:',
    'assistant': '{"message": "You can pre-condition the battery of your car by using the car\'s app or dashboard settings. You can also check the car\'s manual to find out more.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is the difference between a charging point and a charging station?"\n    Your response:',
    'assistant': '{"message": "A charging point has a single outlet, while a charging station can have multiple charging points.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What does kWh mean?"\n    Your response:',
    'assistant': '{"message": "kWh stands for kilowatt-hour, which measures how much energy your electric car uses over time.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is the difference between kW and kWh?"\n    Your response:',
    'assistant': '{"message": "kW measures how much power your electric car or device uses at a moment, while kWh measures the total amount of energy used over time.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How much energy does it take to fully charge my electric car?"\n    Your response:',
    'assistant': '{"message": "It depends on the battery capacity, for example, a 60 kWh battery needs 60 kWh for a full charge.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How do I charge my electric car in winter?"\n    Your response:',
    'assistant': '{"message": "In the same way as in summer, but it may take longer.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is a charging cable?"\n    Your response:',
    'assistant': '{"message": "A cable that connects the electric car to the charging station.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I charge multiple electric cars at one charging station?"\n    Your response:',
    'assistant': '{"message": "Some charging stations allow multiple vehicles to charge simultaneously. Charging might be slower as the power needs to be shared between the cars.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I charge my electric car at work?"\n    Your response:',
    'assistant': '{"message": "Many employers provide charging stations for employees.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Why is charging so loud?"\n    Your response:',
    'assistant': '{"message": "Keeping everything cool is one of the main reasons for loud noises during charging. If you experience unknown loud noises, please contact your car dealer or the charge point operator.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is the best charge point operator?"\n    Your response:',
    'assistant': '{"message": "Unfortunately, I can’t tell which charge point operator is the best. But when you have a certain charging need, I can restrict my search to a specific operator of your need. Just let me know!", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How can I charge with a Type 2 charger?"\n    Your response:',
    'assistant': '{"message": "The Type 2 connector is typically used for AC (alternating current) charging. You can use it at any charging station that has a Type 2 socket.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How can I charge with a CCS or CHAdeMO charger?"\n    Your response:',
    'assistant': '{"message": "The CCS/CHAdeMO connector is typically used for DC (direct current) charging. You can use it at any charging station that has a CCS/CHAdeMO socket.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is direct payment or ad-hoc payment?"\n    Your response:',
    'assistant': '{"message": "Direct payment or ad-hoc payment means paying your charging session at a public charging station with typical payment means, such as credit card.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How can I pay with Hubject?"\n    Your response:',
    'assistant': '{"message": "Hubject enables payment via roaming and a so called eMobility Service Provider, which provides a charging service to you. Hubject also offers intercharge direct payment, which enables direct payment at many charging stations all over Europe.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I pay with {{companyName}}? Or any other charging app"\n    Your response:',
    'assistant': '{"message": "Yes, you can use {{companyName}} to pay at the majority of charging stations in the {{companyName}} app. ", "outOfScope": false, "helpLevel":"level 1"}'
  },

  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is ChargingTime?"\n    Your response:',
    'assistant': '{"message": "ChargingTime.de is an electric vehicle route planner that helps users find, compare, and navigate to charging stations across Europe.", "outOfScope": false, "helpLevel":"level 1"}'
  },

  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "What is the cheapest way to charge?"\n    Your response:',
    'assistant': '{"message": "Typically, charging your vehicle at home or at work, with your own solar energy, is the cheapest way to charge. Prices for charging at public charging stations can vary a lot, depending on the charge point operator, the charging service of your choice and many other factors.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "If I charge with X kW, how long does it take to charge my car?"\n    Your response:',
    'assistant': '{"message": "I currently cannot help you calulating how long it takes to cahrge. It relies on many factors like the state of charge, the typical charging rate of your car and more.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Do I need to plug in first or do I need to start the charging process first?"\n    Your response:',
    'assistant': '{"message": "At the moment I can’t help you with this, as this depends on multiple factors like the charge point operator, the payment method and others. You could try checking the screen of the charging station or talk to the hotline of the charge point operator.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  // {
  //   'projectIds': [],
  //   'user': '    # Help level 1\n    User request that you should help with: "I want to charge my Tesla Cybertruck. I need a US charging plug."\n    Your response:',
  //   'assistant': '{"message": "At the moment I can’t help you with charging a specific car model. Also at the moment I only support charging connectors used in Europe.", "outOfScope": false, "helpLevel":"level 1"}'
  // },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Show me examples for chage point operators to chose from"\n    Your response:',
    'assistant': '{"message": "There is a great number of charge point operators to chose from. Three examples are: Allego, Fastned and Ionity", "outOfScope": false, "helpLevel":"level 1"}'
  }, 
  {
    'projectIds': [],
    'user': '    # Help level 1 {isRoutingEnabled}\n    User request that you should help with: "I want to find a charging stop along my route."\n    Your response:',
    'assistant': '{"message": "Yes, my functionality allows to recommend a single charging stop along your route. Where do you want to go?", "outOfScope": false, "helpLevel":"level 1"}'
  },
  // {
  //   'projectIds': [],
  //   'user': '    # Help level 1 {isRoutingEnabled}\n    User request that you should help with: "I want to charge along the way to my destination."\n    Your response:',
  //   'assistant': '{"message": "Yes, my functionality allows to recommend charge points along your route. Where do you want to go?", "outOfScope": false, "helpLevel":"level 1"}'
  // },
  {
    'projectIds': [],
    'user': '    # Help level 1 {isRoutingEnabled}\n    User request that you should help with: "Can you find me a charging stop along my route ?"\n    Your response:',
    'assistant': '{"message": "Yes, my functionality allows to recommend a single charging stop along your route. Where do you want to go?", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1 {isRoutingNotEnabled}\n    User request that you should help with: "I want to plan a route to Munich."\n    Your response:',
    'assistant': '{"message": I\'m sorry, I cannot help you with planning a trip to Munich. I can only recommend you a charge point at a destination.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # No help required as the user location is assumed for the place of origin. {isRoutingEnabled}\n    User request that you should help with: "I want to plan a route to Dusseldorf."\n    Your response:',
    'assistant': 'null'
  },

  


  // contact info requests

  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "I want to talk to the customer support."\n    Your response:',
    'assistant': '{"message": "You can reach our customer support team via {{contactInformation}}", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "I want to talk to the support."\n    Your response:',
    'assistant': '{"message": "You can reach our customer support team via {{contactInformation}}", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "I want to talk to a human."\n    Your response:',
    'assistant': '{"message": "You can reach our customer support team via {{contactInformation}}", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "I want to talk to the support team."\n    Your response:',
    'assistant': '{"message": "You can reach our customer support team via {{contactInformation}}", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Let me speak to the customer support. "\n    Your response:',
    'assistant': '{"message": "You can reach our customer support team via {{contactInformation}}", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can a human help me, please?"\n    Your response:',
    'assistant': '{"message": "You can reach our customer support team via {{contactInformation}}", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "Can I speak with a person? This bot isn\'t solving my problem."\n    Your response:',
    'assistant': '{"message": "You can reach our customer support team via {{contactInformation}}", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "This isn\'t working out.I need to talk to a human."\n    Your response:',
    'assistant': '{"message": "You can reach our customer support team via {{contactInformation}}", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "I prefer to speak with a human representative."\n    Your response:',
    'assistant': '{"message": "You can reach our customer support team via {{contactInformation}}", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "I need help from a real person, not a bot."\n    Your response:',
    'assistant': '{"message": "You can reach our customer support team via {{contactInformation}}", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 1\n    User request that you should help with: "The charging station is occupied."\n    Your response:',
    'assistant': '{"message": "I\'m sorry to hear that the charging station is occupied. You can try to find another charging station nearby or wait until the charging station is available.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 1\n    User request that you should help with: "How can I maintain my car?"\n    Your response:',
    'assistant': '{"message": "You can maintain your car by following the maintenance schedule in the car manual, checking the tire pressure regularly, and keeping the battery charged.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 1\n    User request that you should help with: "Can you remind me of my next maintenance schedule?"\n    Your response:',
    'assistant': '{"message": "You can maintain your car by following the maintenance schedule in the car manual, checking the tire pressure regularly, and keeping the battery charged.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 1\n    User request that you should help with: "I want to check for software updates. I want to check for updates for my electric vehicle."\n    Your response:',
    'assistant': '{"message": "You can check for software updates in the car settings or on the car manufacturer\'s website.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # Help 1\n    User request that you should help with: "Can you provide tips for winter drivin? I want tips for driving an electric vehicle."\n    Your response:',
    'assistant': '{"message": "You can maintain your car by following the maintenance schedule in the car manual, checking the tire pressure regularly, and keeping the battery charged.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # General question, help required!\n    User request that you should help with: "How can I charge?"\n    Your response:',
    'assistant': '{"message": "You can charge at home, at work, or at public charging stations. You can use a wallbox, a charging cable, or a charging card to charge your electric car.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # General question, help required!\n    User request that you should help with: "I want to pay for charging"\n    Your response:',
    'assistant': '{"message": "You can pay for charging with a charging card, a charging app, or a credit card at public charging stations.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # General question, help required!\n    User request that you should help with: "How much does it cost?"\n    Your response:',
    'assistant': '{"message": "I\'m sorry I can\'t provide you with the exact cost, as it depends on the charge point operator, the location, and the charging speed. You can check the price on the charging station or in the charging app.", "outOfScope": false, "helpLevel":"level 1"}'
  },
  {
    'projectIds': [],
    'user': '    # No help required, return null!\n    User request that you should help with: "I want to charge at my current location."\n    Your response:',
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
    'user': '    # {isRoutingEnabled} No help required as it is a request for a stop along the route, return null!\n    User request that you should help with: "I\'m heading to Hamburg. Where are the charging stations along the route?"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # {isRoutingEnabled}  No help required as it is a request for a stop along the route, return null!\n    User request that you should help with: "Heading to Geneva. Where can I plug in along the way?"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # {isRoutingEnabled}  No help required as it is a request for a stop along the route, return null!\n    User request that you should help with: "I would like to charge on the way to Berlin and stop at a place of interest, where can I charge?"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # {isRoutingEnabled}  No help required as it is a request for a stop along the route, return null!\n    User request that you should help with: "I want to charge along the way to Marseille. Along the way, I want to stop at a restaurant"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # {isRoutingEnabled}  No help required as it is a request for routing to a destination where the current location is assumed to be the origin, return null!\n    User request that you should help with: "I want to plan a trip to Munich"\n    Your response:',
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
    'user': '    # Previous conversation history might show that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Can you do that for me?"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history  might show that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "ok"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history  might show that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "I’d appreciate it if you could."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history  might show that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Please take care of it."\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history  might show that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Go ahead"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Previous conversation history  might show that ChargeGPT is making a proposal. No help required as the user simply asks for the system to take care of that! Return null!\n    User request that you should help with: "Please change that"\n    Your response:',
    'assistant': 'null'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "I want to charge my car."\n    Your response:',
    'assistant': '{ "message": "Sure, I can find a charging station for your car. Please state explicitly where and when you want to charge and any further charing needs, like charging speed, connector type and operator names.", "outOfScope": false, "helpLevel": "level 1" }'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "I want to charge my Skoda Enyaq."\n    Your response:',
    'assistant': '{ "message": "Sure, I can find a charging station for your Skoda Enyaq. Please state explicitly where and when you want to charge and any further charing needs, like charging speed, connector type and operator names.", "outOfScope": false, "helpLevel": "level 1" }'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "I want to charge my IONIQ 5."\n    Your response:',
    'assistant': '{ "message": "Sure, I can find a charging station for your IONIQ 5. Please state explicitly where and when you want to charge and any further charing needs, like charging speed, connector type and operator names.", "outOfScope": false, "helpLevel": "level 1" }'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "I want to charge in Bielefeld, central. I want to charge my IONIQ 5."\n    Your response:',
    'assistant': '{ "message": "Sure, I can find a charging station for your IONIQ 5. Please, always state explicitly any charging needs you have. Do you want me to find a place to charge in Bielefeld, central?", "outOfScope": false, "helpLevel": "level 1" }'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "I want to charge in Bielefeld, central. I drive an IONIQ 5."\n    Your response:',
    'assistant': '{ "message": "Sure, I can find a charging station for your IONIQ 5. Please, always state explicitly any charging needs you have. Do you want me to find a place to charge in Bielefeld, central?", "outOfScope": false, "helpLevel": "level 1" }'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "I want to charge in the city center of Bielefeld. The charging station should be compatible with my IONIQ 5"\n    Your response:',
        'assistant': '{ "message": "Sure, I can find a charging station for your IONIQ 5. Please, always state explicitly any charging needs you have. Do you want me to find a place to charge in Bielefeld, central?", "outOfScope": false, "helpLevel": "level 1" }'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "I want to charge in Essen. I have a Tesla Model 3"\n    Your response:',
    'assistant': '{ "message": "Sure, I can find a charging station for your Tesla Model 3. Please, always state explicitly any charging needs you have. Do you want me to find a place to charge in Essen?", "outOfScope": false, "helpLevel": "level 1" }'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "I want to charge in Essen. I drive a Tesla Model 3."\n    Your response:',
    'assistant': '{ "message": "Sure, I can find a charging station for your Tesla Model 3. Please, always state explicitly any charging needs you have. Do you want me to find a place to charge in Essen?", "outOfScope": false, "helpLevel": "level 1" }'
  },
  
  
  
  // Skoda Q&A 'MySkoda App'

  {
    'projectIds': ['MySkoda App'],
    'user': '    # Help level 1\n    User request that you should help with: "Which charging connectors does a Skoda Enyaq have?"\n    Your response:',
    'assistant': '{ "message": "The Enyaq charges via a Type 2 connector with up to 11 kW AC for medium/large batteries and 7.2 kW for the small battery. DC fast charging ranges from 50 kW to 175 kW. From 2022, DC power increased to 100 kW for smaller batteries and 125 kW for large ones.", "outOfScope": false, "helpLevel": "level 1" }'
  },
  {
    'projectIds': ['MySkoda App'],
    'user': '    # Help level 1\n    User request that you should help with: "Which electric vehicles are produced by Skoda?"\n    Your response:',
    'assistant': '{ "message": "Škoda\'s electric lineup includes the fully electric Enyaq iV and Enyaq Coupé iV SUVs, plus plug-in hybrids like the Octavia iV and Superb iV.They offer various powertrains, battery sizes, and combine efficiency with practicality.", "outOfScope": false, "helpLevel": "level 1" }'
  },
  {
    'projectIds': ['MySkoda App'],
    'user': '    # Help level 1\n    User request that you should help with: "How fast can my Enyaq charge?"\n    Your response:',
    'assistant': '{ "message": "From the 2022 model year, DC fast charging for the 52 kWh and 58 kWh batteries (Enyaq iV 50, 60) increased to 100 kW. All 77 kWh models (Enyaq iV 80, 80X, RS) offer a standard max DC charging rate of 125 kW.", "outOfScope": false, "helpLevel": "level 1" }'
  },
  {
    'projectIds': ['MySkoda App'],
    'user': '    # Help level 1\n    User request that you should help with: "What is MyŠkoda and how is it related to eMobility?"\n    Your response:',
    'assistant': '{ "message": "MyŠkoda is an app ensuring that you always have control over your vehicle. You can check the charging range, driving data, or where you\'ve parked your car. You can even check whether you\'ve locked your vehicle. Pretty amazing, isn\'t it?", "outOfScope": false, "helpLevel": "level 1" }'
  },
  {
    'projectIds': ['MySkoda App'],
    'user': '    # Help level 1\n    User request that you should help with: "How long do batteries of Skoda last?"\n    Your response:',
    'assistant': '{ "message": "Škoda guarantees a battery life of 8 years or 160,000 km.", "outOfScope": false, "helpLevel": "level 1" }'
  },
  {
    'projectIds': ['MySkoda App'],
    'user': '    # Help level 1\n    User request that you should help with: "What is Powerpass?"\n    Your response:',
    'assistant': '{ "message": "Powerpass is a public charging solution for Škoda customers, enabling them to charge anywhere in our network with a single card and the MyŠkoda app.", "outOfScope": false, "helpLevel": "level 1" }'
  },

  {
    'projectIds': [],
    'user': '    # Help level 1\n    User request that you should help with: "How many charge point options can you recommend?"\n    Your response:',
    'assistant': '{ "message": "I can recommend you {{recommendationsCount}} charge point options.", "outOfScope": false, "helpLevel": "level 1" }'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1 where the user asks for more charge point options being recommended than is possible.\n    User request that you should help with: "Recommend 5 charge points around me."\n    Your response:',
    'assistant': '{ "message": "I\'m sorry, I can only recommend you {{recommendationsCount}} charge point options.", "outOfScope": false, "helpLevel": "level 1" }'
  },
  {
    'projectIds': [],
    'user': '    # Help level 1 where the user asks for more charge point options being recommended than is possible.\n    User request that you should help with: "Can you recommend me 10 other charge point options?"\n    Your response:',
    'assistant': '{ "message": "I\'m sorry, I can only recommend you {{recommendationsCount}} charge point options.", "outOfScope": false, "helpLevel": "level 1" }'
  },
];