import { format } from 'date-fns';
import { SubComponentEnums } from './reasoning.constants';


export const generateDestinationSystemPrompt = (currentTimestamp: number, language: string) => {
    const dateObject = new Date(currentTimestamp);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[dateObject.getDay()];

    return `
As ChargeGPT, your primary role is to efficiently and accurately collect and remember key information such as {address, date_time, power_type, latitude, longitude, operator_name} from the conversation, including chat history and any instructions in {switch_reason}. Utilize the ${SubComponentEnums.RETURN_TO_USER} feature to track information, and always represent yourself as ChargeGPT to the user.

🗣️ Communicate in the specified language ${language}, using the informal "du" for German conversations. Make sure to be friendly and succinct, and avoid formalities. Example: ask for "In which city do you want to search in?" instead of "Which city?"
Ask for missing information, like city missing in unconfirmed_address, here signified by a placeholder {Hofer, {city}}. Always ask for such vital information in the form of a question.

The preset date and time are ${format(dateObject,'yyyy-MM-dd HH:mm:ss')}, with the corresponding day of the week being ${dayOfWeek}. Use these as defaults unless directed otherwise. For 'times of day' phrases, update {date_time} as needed.

Adhere to these directives:
0️⃣ Review lastUserInput, chat history, and switch_reason for user preferences.
1️⃣ Emphasize prompt service over formalities.
2️⃣ Communicate via {message} with the ${SubComponentEnums.RETURN_TO_USER} function.
3️⃣ Accumulate all essential info before signaling completion with {done: true}.
4️⃣ Always request an address.
5️⃣ Accept any address-like input without validation.
6️⃣ Inquire for a nearby street or landmark when personal places are mentioned.
7️⃣ Default to the current date_time, avoiding past dates.
8️⃣ Set power_type to "both" by default, modifying based on implied stay duration.
9️⃣ Refrain from discussing ChargeGPT functionalities or mechanics.
🔟 Eliminate summary or confirmation requests.
1️⃣1️⃣ Translate 'times of day' into specific {date_time}.
1️⃣2️⃣ Default to "all" for operator_name unless specified otherwise.
1️⃣3️⃣ Use ${SubComponentEnums.POI_SEARCH} to validate addresses and determine coordinates.
1️⃣4️⃣ The user can define charge point speeds by kiloWatt (kW).


NEVER EVER LEAVE A PLACEHOLDER IN THE ADDRESS, like {Hofer, {city}}. ALWAYS ask for the city name. 🚫
NEVER LEAVE unconfirmed_address EMPTY! Possible values are 'nearby' OR a valid address! ALWAYS ask for an address or POI name. 🚫
NEVER ACCEPT TIMES IN THE PAST! DO NOT IGNORE! ALWAYS ask for a future date_time. 🚫

👉 Address each user request diligently, ensuring correct categorization and response with the necessary information or assistance.
👉 Always use the ${SubComponentEnums.RETURN_TO_USER} function to communicate with the user.

# 👉 Important examples:
For "I want to charge tomorrow," assume noon if no time is specified. 🕛
Use only future dates for day-of-week mentions and never use past dates. 🔜
Respond to past date_time requests by stating the impossibility of past scheduling. ❌
Specify power type as "AC" for slow charging requests and "DC" for fast charging requests. ⚡
Set a min_power or max_power filter to limit the range of charge point speeds. ⚡-⚡⚡⚡
For charging hours in the future, calculate and set the appropriate date_time. ⏰
For specific time requests, convert phrases like "at 3 o'clock" to the correct {date_time} format. 🕒
When a city center is implied, default to that location without needing a specific address. 🏙️
Validate addresses with ${SubComponentEnums.POI_SEARCH} and remember them without further clarification, but always confirm. ✅
If the city name is missing from the address, prompt the user to provide it. 🏢
Use current coordinates for "nearby" requests when no address or POI is specified, if available. 🛰️
Do not use current coordinates when a specific POI or address is provided. 🚫
When an address cannot be confirmed, request an alternative from the user. Example switch_reason contains "Address cannot be confirmed! Ask for a different address, please!" 🔍
"I want to charge two hours from now" -> "The user wants to change date_time to {two hours from now}. Address is still missing. Ask for an address or POI." 🕑 

# 💭 Final Reminders:
Infer missing details when feasible.
Validate and save addresses with ${SubComponentEnums.POI_SEARCH}.
Incorporate all gathered information, including switch_reason and lastUserInput, into your responses.

Now follow a number of example interactions to get a better understanding of the system prompt.

❗️ ALWAYS USE A FUNCTION ❗️ 
`;
};

export const availableDestinationFunctions = [
    {
        name: SubComponentEnums.RETURN_TO_USER,
        description: `The ${SubComponentEnums.RETURN_TO_USER} function remembers {address, latitude, longitude, date_time, power_type, operator_name}`,
        parameters: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'MUST NOT be empty if {done: false}! the message to the user/driver about missing information.'
                },
                unconfirmed_address: {
                    type: 'string',
                    description: 'Insert what looks like a POI name or address in format "street name, city" or "POI name" to remember it'
                },
                address: {
                    type: 'string',
                    description: `the address or poi name that has been confirmed to exist. use ${SubComponentEnums.POI_SEARCH} on unconfirmed_address first!`
                },
                latitude: {
                    type: 'number',
                    description: 'the latitude of the coordinate of an existing address or POI name (0 is invalid)'
                },
                longitude: {
                    type: 'number',
                    description: 'the longitude of the coordinate of an existing address or POI name (0 is invalid)'
                },
                date_time: {
                    type: 'string',
                    description: 'the described date and time in the FUTURE, in 2023-05-15 14:00:00 format'
                },
                power_type: {
                    type: 'string',
                    description: 'DC: <=1h / AC: >1h / "both" by default. NEVER RETURN A NUMBER!'
                },
                operator_name: {
                    type: 'string',
                    description: 'the charge-point operator name / "all" by default'
                },
                min_power: {
                    type: 'number',
                    description: 'the minimum power in kW, defaults to 0'
                },
                max_power: {
                    type: 'number',
                    description: 'the maximum power in kW, defaults to 400'
                },
                done: {
                    type: 'boolean',
                    description: 'false by default. MUST NOT be false if {message: ""}! are you finished collecting {address, date_time}?'
                }
            },
            required: ['message', 'unconfirmed_address', 'address', 'date_time', 'power_type', 'done', 'latitude', 'longitude', 'operator_name', 'min_power', 'max_power']
        },
    },
    {
        name: SubComponentEnums.POI_SEARCH,
        description: `The ${SubComponentEnums.POI_SEARCH} function checks what looks like an address or POI name in unconfirmed_address for existence and returns coordinates {latitude, longitude} for that existing address or POI. Also follow these rules:
        0. remember {date_time, power_type}
        1. ALWAYS return already inferred {data_time, power_type} so that you can remember it`,
        parameters: {
            type: 'object',
            properties: {
                unconfirmed_address: {
                    type: 'string',
                    description: 'Insert what looks like a POI name or address in format "street name, city" or "POI name, city" to check for existence in order to get its coordinates. Complete sentences are invalid! "none" is invalid! CANNOT be empty!'
                },
                date_time: {
                    type: 'string',
                    description: 'the described date and time in the FUTURE, in 2023-05-15 14:00:00 format'
                },
                power_type: {
                    type: 'string',
                    description: 'DC: <=1 hour / AC: >1 hour / "both" by default. NEVER RETURN A NUMBER!'
                },
                operator_name: {
                    type: 'string',
                    description: 'the charge-point operator name / "all" by default'
                },
                min_power: {
                    type: 'number',
                    description: 'the minimum power in kW, defaults to 0'
                },
                max_power: {
                    type: 'number',
                    description: 'the maximum power in kW, defaults to 400'
                },
                done: {
                    type: 'boolean',
                    description: 'false by default. MUST NOT be false if {message: ""}! are you finished collecting {address, date_time}?'
                }
            },
            required: ['unconfirmed_address', 'date_time', 'power_type', 'operator_name', 'done', 'min_power', 'max_power']
        }
    },
    {
        name: SubComponentEnums.ENABLE_USER_LOCATION,
        description: `The ${SubComponentEnums.ENABLE_USER_LOCATION} function can be used ONCE to ask for the browser's location service, but this may be disabled. Returns non-empty {current_coordinates} if successful.
        Example: "I want to charge nearby" or if address is "nearby".
        
        Also follow these rules:
        0. only use if a charger "nearby" is requested
        1. only use if {current_location} is empty
        2. only ask once!
        3. ALWAYS return already inferred {data_time, power_type} so that you can remember it
        `,
        parameters: {
            type: 'object', 
            properties: {
                date_time: {
                    type: 'string',
                    description: 'the described date and time in the FUTURE, in 2023-05-15 14:00:00 format'
                },
                power_type: {
                    type: 'string',
                    description: 'DC: <=1 hour / AC: >1 hour / "both" by default'
                },
                operator_name: {
                    type: 'string',
                    description: 'the charge-point operator name / "all" by default. NEVER RETURN A NUMBER!'
                },
                min_power: {
                    type: 'number',
                    description: 'the minimum power in kW, defaults to 0'
                },
                max_power: {
                    type: 'number',
                    description: 'the maximum power in kW, defaults to 400'
                },
                done: {
                    type: 'boolean',
                    description: 'false by default. MUST NOT be false if {message: ""}! are you finished collecting {address, date_time}?'
                }
            },
            required: ['date_time', 'power_type', 'operator_name', 'done', 'min_power', 'max_power']
        }
    },
    {
        name: SubComponentEnums.HELP,
        description: `The ${SubComponentEnums.HELP} function is used when users ask assistant or ChargeGPT what they can do or ask for a functionality description or guidance for help on how to formulate requests for destination charging or the user request does not pertain to electric vehicle charging. Sometimes all information are there {address, date_time, power_type, latitude, longitude, operator_name, min_power, max_power} but user still can ask a question like "what else can you do?"`,
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