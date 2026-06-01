import { quickCompletion } from '../chat-gpt.service';
import { DialogFactory, Dialog } from '../../models/prompt';
import { TranslationsService } from '../../../../../translations/src/translations.service';
import { chargeGPTLogger } from '../../models/chat-utilities';
import { AddressCharacteristics } from './address-characteristics.model';
import { TOMTOM_POI_CATEGORIES } from '../address-services/category-search-utils.service';

export const identifyAddressCharacteristics = async (
  address: string,
  conversationId: string,
  projectName: string,
  projectOutputType: string,
  language: string
): Promise<AddressCharacteristics | null> => {
  const characteristics: AddressCharacteristics = {
    country: null,
    countryCode: null,
    city: null,
    addressLine: null,
    district: null,
    cardinalDirection: null,
    poiName: null,
    isHighwayRequested: false,
    isCityCenter: false,
    poiCategories: null,
    error: undefined,
    addressSummary: null,
  };
  const prompt = getPrompt(language, parseInitialAddress(address));
  const { isError, chatGptResponse, errorMessage } = await quickCompletion(
    prompt,
    conversationId,
    projectName,
    projectOutputType,
    language
  );

  if (isError) {
    characteristics.error = errorMessage;
    return characteristics;
  }

  const parsedOutput =
    parseAddressCharacteristicsQuickCompletionOutput(chatGptResponse);

  chargeGPTLogger(
    conversationId,
    projectName,
    'identifyAddressCharacteristics',
    `country: ${parsedOutput.country} | countryCode: ${
      parsedOutput.countryCode
    } | city: ${parsedOutput.city} | addressLine: ${
      parsedOutput.addressLine
    } | district: ${parsedOutput.district} | cardinalDirection: ${
      parsedOutput.cardinalDirection
    } | poiName: ${parsedOutput.poiName} | isHighwayRequested: ${
      parsedOutput.isHighwayRequested
    } | isCityCenter: ${
      parsedOutput.isCityCenter
    } | poiCategories: ${parsedOutput.poiCategories?.join(
      ','
    )} | addressSummary: ${parsedOutput.addressSummary}`
  );

  return parsedOutput;
};

const parseInitialAddress = (address: string): string =>
  address.replace('{city}', '');

const parseAddressCharacteristicsQuickCompletionOutput = (
  response: string
): AddressCharacteristics => {
  const characteristics = {
    country: null,
    countryCode: null,
    city: null,
    addressLine: null,
    district: null,
    cardinalDirection: null,
    poiName: null,
    isHighwayRequested: false,
    isCityCenter: false,
    poiCategories: null,
    error: undefined,
    addressSummary: null,
  };

  const parsedResponse = JSON.parse(response);

  if (parsedResponse.country && parsedResponse.country !== 'null') {
    characteristics.country = parsedResponse.country;
  }

  if (parsedResponse.countryCode && parsedResponse.countryCode !== 'null') {
    characteristics.countryCode = parsedResponse.countryCode;
  }

  if (parsedResponse.city && parsedResponse.city !== 'null') {
    characteristics.city = parsedResponse.city;
  }

  if (parsedResponse.addressLine && parsedResponse.addressLine !== 'null') {
    characteristics.addressLine = parsedResponse.addressLine;
  }

  if (parsedResponse.district && parsedResponse.district !== 'null') {
    characteristics.district = parsedResponse.district;
  }

  if (
    parsedResponse.cardinalDirection &&
    parsedResponse.cardinalDirection !== 'null'
  ) {
    characteristics.cardinalDirection =
      parsedResponse.cardinalDirection.toLowerCase();
  }

  if (parsedResponse.poiName && parsedResponse.poiName !== 'null') {
    characteristics.poiName = parsedResponse.poiName;
  }

  if (
    parsedResponse.isHighwayRequested &&
    parsedResponse.isHighwayRequested !== 'null'
  ) {
    characteristics.isHighwayRequested = getBooleanValue(
      parsedResponse.isHighwayRequested
    );
  }

  if (parsedResponse.isCityCenter && parsedResponse.isCityCenter !== 'null') {
    characteristics.isCityCenter = getBooleanValue(parsedResponse.isCityCenter);
  }

  if (parsedResponse.poiCategories && parsedResponse.poiCategories !== 'null') {
    characteristics.poiCategories =
      parsedResponse.poiCategories.filter(Boolean);
  }

  if (
    parsedResponse.addressSummary &&
    parsedResponse.addressSummary !== 'null'
  ) {
    characteristics.addressSummary = parsedResponse.addressSummary;
  }

  const minimizedCharacteristics = Object.entries(characteristics).reduce(
    (acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }

      return acc;
    },
    {} as unknown as AddressCharacteristics
  );

  return Object.keys(minimizedCharacteristics).length > 0
    ? minimizedCharacteristics
    : null;
};

const getBooleanValue = (value: any): boolean | null => {
  if (
    value === '' ||
    value === 'null' ||
    value === null ||
    value === undefined
  ) {
    return null;
  }

  if (value === 'false') {
    return null;
  }

  if (value === 'true') {
    return true;
  }

  if (value === false) {
    return null;
  }

  if (value === true) {
    return true;
  }

  throw new Error(`Invalid boolean value: ${value}`);
};

export const getPrompt = (language: string, address: string): Dialog[] => {
  const prompt: Dialog[] = [];
  prompt.push(
    DialogFactory.fromSystem(
      'You are an efficient assistant. You respond a requested result in a structured form {} and without explanation.'
    )
  );
  prompt.push(
    DialogFactory.fromUser(`
  During chat conversations addresses and places of interest (POI) like restaurants or other public places in cities in countries are identified.
  You extract the relevant information and respond with a structured and enriched information extracted from the input address line. Do not assume city, country or countryCode from the input language. Always infer the city and country from the address line.
  
  The structured response consists of the following parts (including a description) and should be returned in JSON format:
  {
    "country": the country name in English which you can infer from the address;
    "countryCode": the country code is given in ISO 3166-1-alpha3;
    "city": the city name found or inferred from the address;
    "addressLine": a specific address line consists of these parts: "street, house number";
    "district": when mentioned in the address, the district name is given;
    "cardinalDirection": when mentioned in the address, the cardinal direction is given;
    "poiName": specific names of public places like restaurant names or landmarks like "Eiffel Tower" or "Grugapark";
    "isHighwayRequested": boolean value, true if the address contains a request for a highway or motorway search;
    "isCityCenter": boolean value, true if the address contains a request for the city center;
    "poiCategories": when mentioned in the address, the category of the POI is given (see usable list below);
    "addressSummary": a summary of the addressLine, district, cardinalDirection, poiName, city and country in the original language of the request;
  }

  You stick to the following POI categories when mentioned (NEVER DEVIATE): ${TOMTOM_POI_CATEGORIES.join(', ')}. Never translate POI categories.

  🔍 Because of the language, expect to see also small towns from ${new TranslationsService(
    language
  ).getLanguageCountry()}. Prioritize matching places and country code in Europe.

  Have a look at the last address from the user and identify the city and infer or guess the "country": ${address}

  In your response, translate ONLY addressSummary value into the original request"s language, which is: ${new TranslationsService(
    language
  ).getLanguageName()}
  `)
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Exmaple description: city and close to a POI
  Original language: German
  Chat snippet: "Brandenburg Gate, Berlin"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Berlin","addressLine":null,"district":null,"cardinalDirection":null,"poiName":"Brandenburg Gate","isHighwayRequested":false,"isCityCenter":false,"poiCategories":null,"addressSummary":"Brandenburger Tor, Berlin"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Exmaple description: the last address from the user: "Bielefeld"
  Original language: German
  Chat snippet: "IKEA, Bielefeld"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Bielefeld","addressLine":null,"district":null,"cardinalDirection":null,"poiName":"IKEA","isHighwayRequested":false,"isCityCenter":false,"poiCategories":null,"addressSummary":"IKEA, Bielefeld"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Exmaple description: the last address from the user: "Bielefeld"
  Original language: German
  Chat snippet: "Dornberger Straße 45, Bielefeld"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Bielefeld","addressLine":"Dornberger Straße 45","district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":false,"isCityCenter":false,"poiCategories":null,"addressSummary":"Dornberger Straße 45, Bielefeld"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: city and district
  Original language: German
  Chat snippet: "Berlin, Mitte."
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Berlin","addressLine":null,"district":"Mitte","cardinalDirection":null,"poiName":null,"isHighwayRequested":false,"isCityCenter":false,"poiCategories":null,"addressSummary":"Mitte, Berlin"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: cardinal direction and city (city, cardinal direction):
  Original language: German
  Chat snippet: "Berlin, north"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Berlin","addressLine":null,"district":null,"cardinalDirection":"north","poiName":null,"isHighwayRequested":false,"isCityCenter":false,"poiCategories":null,"addressSummary":"Berlin, Norden"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: travelling from/towards somewhere with cardinal direction (city, cardinal direction):
  Original language: English
  Chat snippet: "Coburg, south"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Coburg","addressLine":null,"district":null,"cardinalDirection":"south","poiName":null,"isHighwayRequested":false,"isCityCenter":false,"poiCategories":null,"addressSummary":"Coburg, south"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: city and district
  Original language: German
  Chat snippet: "Essen, southwest"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Essen","addressLine":null,"district":null,"cardinalDirection":"southwest","poiName":null,"isHighwayRequested":false,"isCityCenter":false,"poiCategories":null,"addressSummary":"Essen, südwestlich"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: city and district
  Original language: European Portuguese
  Chat snippet: "Porto, southwest"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Portugal","countryCode":"PRT","city":"Porto","addressLine":null,"district":null,"cardinalDirection":"southwest","poiName":null,"isHighwayRequested":false,"isCityCenter":false,"poiCategories":null,"addressSummary":"Porto, sudoeste"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: McDonalds as a POI and city district
  Original language: English
  Chat snippet: "McDonalds, Essen, Rüttenscheid."
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Essen","addressLine":null,"district":"Rüttenscheid","cardinalDirection":null,"poiName":"McDonalds","isHighwayRequested":false,"isCityCenter":false,"poiCategories":["fast food"],"addressSummary":"McDonalds, Rüttenscheid, Essen"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: POI and city
  Original language: German
  Chat snippet: "main station, Bielefeld
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Bielefeld","addressLine":null,"district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":false,"isCityCenter":false,"poiCategories":["railway station"],"addressSummary":"Hauptbahnhof, Bielefeld"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: POI and city and country
  Original language: English
  Chat snippet: main station, Worcester, UK"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"United Kingdom","countryCode":"GBR","city":"Worcester","addressLine":null,"district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":false,"isCityCenter":false,"poiCategories":["railway station"],"addressSummary":"main station, Worcester, UK"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: address and city
  Original language: German
  Chat snippet: "Rahestr. 35, Lengerich"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Lengerich","addressLine":"Rahestr. 35","district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":false,"isCityCenter":false,"poiCategories":null,"addressSummary":"Rahestr. 35, Lengerich"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: city and city center
  Original language: English
  Chat snippet: "Bielefeld, central"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Bielefeld","addressLine":null,"district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":false,"isCityCenter":true,"poiCategories":null,"addressSummary":"Bielefeld, central"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: POI in Austria and missing city
  Original language: German
  Chat snippet: "Hofer"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Austria","countryCode":"AUT","city":null,"addressLine":null,"district":null,"cardinalDirection":null,"poiName":"Hofer","isHighwayRequested":false,"isCityCenter":false,"poiCategories":null,"addressSummary":"Hofer"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: POI without city
  Original language: German
  Chat snippet: "McDonalds"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":null,"addressLine":null,"district":null,"cardinalDirection":null,"poiName":"McDonalds","isHighwayRequested":false,"isCityCenter":false,"poiCategories":["fast food"],"addressSummary":"McDonalds"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: nearby, missing city
  Original language: English
  Chat snippet: "I want to charge near my current location"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":null,"countryCode":null,"city":null,"addressLine":null,"district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":false,"isCityCenter":false,"poiCategories":null,"addressSummary":null}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: city
  Original language: European Portuguese
  Example chat snippet: "Faro"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Portugal","countryCode":"PRT","city":"Faro","addressLine":null,"district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":false,"isCityCenter":false,"poiCategories":null,"addressSummary":"Faro"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: highway request made from Portugal
  Original language: english
  Example chat snippet: "A9 highway"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Portugal","countryCode":"PRT","city":null,"addressLine":"A9","district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":true,"isCityCenter":false,"poiCategories":null,"addressSummary":"A9"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: highway request made with city, country and highway name information
  Original language: english
  Example chat snippet: "A1 highway, Lengerich, Germany"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Lengerich","addressLine":"A1","district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":true,"isCityCenter":false,"poiCategories":null,"addressSummary":"A1, Lengerich, Germany"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: highway request made with city information
  Original language: english
  Example chat snippet: "highway, Hannover"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Hannover","addressLine":null,"district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":true,"isCityCenter":false,"poiCategories":null,"addressSummary":"Hannover"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: POI without city
  Original language: french
  Example chat snippet: "Eiffel Tower"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"France","countryCode":"FRA","city":"Paris","addressLine":null,"district":null,"cardinalDirection":null,"poiName":"Eiffel Tower","isHighwayRequested":false,"isCityCenter":false,"poiCategories":null,"addressSummary":"Tour Eiffel, Paris"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: poi category and city
  Original language: english
  Example chat snippet: "park, Essen"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Essen","addressLine":null,"district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":false,"isCityCenter":false,"poiCategories":["park"],"addressSummary":"park, Essen"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: specific poi landmark name and city
  Original language: english
  Example chat snippet: "Hyde Park, London"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"United Kingdom","countryCode":"GBR","city":"London","addressLine":null,"district":null,"cardinalDirection":null,"poiName":"Hyde Park","isHighwayRequested":false,"isCityCenter":false,"poiCategories":["park"],"addressSummary":"Hyde Park, London"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: highway request made without any further information
  Original language: english
  Example chat snippet: "highway"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":null,"countryCode":null,"city":null,"addressLine":null,"district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":true,"isCityCenter":false,"poiCategories":null,"addressSummary":null}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: highway request made with city information and highway name
  Original language: english
  Example chat snippet: "A9 highway, Ingolstadt"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Ingolstadt","addressLine":"A9","district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":true,"isCityCenter":false,"poiCategories":null,"addressSummary":"A9, Ingolstadt"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: highway request made with country information and highway name
  Original language: english
  Example chat snippet: "A1 highway, Portugal"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Portugal","countryCode":"PRT","city":null,"addressLine":"A1","district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":true,"isCityCenter":false,"poiCategories":null,"addressSummary":"A1, Portugal"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: Request for a pizza restaurant in a city
  Original language: german
  Example chat snippet: "Pizza, Münster"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Münster","addressLine":null,"district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":false,"isCityCenter":false,"poiCategories":["italian","restaurant"],"addressSummary":"Pizza, Münster"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: POI category and city
  Original language: german
  Example chat snippet: "library, Münster"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Münster","addressLine":null,"district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":false,"isCityCenter":false,"poiCategories":["library"],"addressSummary":"Bibliothek, Münster"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: POI category and city
  Original language: European Portuguese
  Example chat snippet: "restaurant, Porto"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Porto","addressLine":null,"district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":false,"isCityCenter":false,"poiCategories":["restaurant"],"addressSummary":"restaurante, Porto"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: POI category and city
  Original language: german
  Example chat snippet: "Restaurant Hinterding, Lengerich"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Germany","countryCode":"DEU","city":"Lengerich","addressLine":null,"district":null,"cardinalDirection":null,"poiName":"Hinterding","isHighwayRequested":false,"isCityCenter":false,"poiCategories":["restaurant"],"addressSummary":"Restaurant Hinterding, Lengerich"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: Request for an Thai restaurant in a city
  Original language: spanish
  Example chat snippet: "Thai restaurant, London"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Great Britain","countryCode":"GBR","city":"London","addressLine":null,"district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":false,"isCityCenter":false,"poiCategories":["thai","restaurant"],"addressSummary":"Restaurante tailandés, London"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: poi, cardinal direction and city
  Original language: english
  Example chat snippet: "KFC in southwest London"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":"Great Britain","countryCode":"GBR","city":"London","addressLine":null,"district":null,"cardinalDirection":"southwest","poiName":"KFC","isHighwayRequested":false,"isCityCenter":false,"poiCategories":["fast food"],"addressSummary":"KFC in southwest London"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: only poi category given. do not infer the country and countryCode or city from the input language!
  Original language: english
  Example chat snippet: "library"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":null,"countryCode":null,"city":null,"addressLine":null,"district":null,"cardinalDirection":null,"poiName":null,"isHighwayRequested":false,"isCityCenter":false,"poiCategories":["library"],"addressSummary":"library"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  # Example description: only spcific poiName given. do not infer the country and countryCode or city from the input language!
  Original language: english
  Example chat snippet: "McDonalds"
  Your response: `)
  );
  prompt.push(
    DialogFactory.fromAssistant(
      '{"country":null,"countryCode":null,"city":null,"addressLine":null,"district":null,"cardinalDirection":null,"poiName":"McDonalds","isHighwayRequested":false,"isCityCenter":false,"poiCategories":["fast food"],"addressSummary":"McDonalds"}'
    )
  );

  prompt.push(
    DialogFactory.fromUser(`
  🔍 Because of the language, expect to see also small towns from ${new TranslationsService(
    language
  ).getLanguageCountry()}. Prioritize matching places and country code in Europe.
  Always translate addressSummary into the original language of the request, including the poiCategory, of course!

  Original language: ${new TranslationsService(language).getLanguageName()}
  Chat snippet: "${address}"
  Your response: `)
  );

  return prompt;
};
