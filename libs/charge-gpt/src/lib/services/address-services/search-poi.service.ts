import { configService } from '@fronyx/configurations';
import axios from 'axios';
import { AddressNotFoundError } from '../../models/address-search-error';
import { useTry, useTryAsync } from 'no-try';
import {
  filterOptionsTooCloseFromEachOther,
  sortOptionsByDistanceFromCurrentCoordinates,
} from './poi-search-utils.service';
import {
  CardinalDirections,
  getProperCardinalDirection,
  movePointToCardinalDirection,
} from './cardinal-directions-utils.service';
import { LocationBiasOutput } from './location-bias.model';
import {
  boundingBox2GoogleBoundingBox,
  boundingBox2String,
} from './location-bias.service';
import { getHighwayName } from './highway-search-utils.service';
import {
  getPossibleCategory,
  getPossibleChargePointPoiCategory,
  getPossiblePoiSearchCategory,
} from './category-search-utils.service';
import { queryFallback } from './query-utils.service';
import {
  clusterLocationsTogether,
  getClusterSummarizer,
  removeExtraCommas,
} from './clustering-locations-utils.service';
import { AddressCharacteristics } from '../address-identifiers/address-characteristics.model';
import {
  SearchDestinationResponse,
  TomTomLocation,
} from './models/address.model';
import { alpha2to3Map } from '@fronyx/data-transfer-object';
import { getTranslation } from '@fronyx/translations';
import { chooseMostSuitableGeocodeOptions } from './suitable-geocode-options.service';
import { Dialog, DialogFactory } from '../../models/prompt';
import { quickCompletion } from '../chat-gpt.service';
import {
  mapAddressResultsIntoAddressOptions,
  mapTomTomLocationIntoSearchPoiAddress,
  SearchPoiAddress,
} from './address-options-display.service';

const centerLat = '51.090684'; // Germany as center
const centerLng = '10.380769';

export const getPoiSearchTerm = (
  addressCharacteristics: Partial<AddressCharacteristics>
) => {
  return [
    addressCharacteristics.poiName,
    addressCharacteristics.addressLine,
    addressCharacteristics.district,
  ]
    .filter(Boolean)
    .join(', ');
};

export const getPoiCategorySearchTerm = (
  addressCharacteristics: Partial<AddressCharacteristics>
) => {
  return [
    addressCharacteristics?.poiCategories[0],
    addressCharacteristics.addressLine,
    addressCharacteristics.district,
  ]
    .filter(Boolean)
    .join(', ');
};

const getGoogleApiClient = (apiName: 'details' | 'autocomplete') => {
  const client = axios.create({
    baseURL: `https://maps.googleapis.com/maps/api/place/${apiName}`,
  });

  return client;
};

const getTomTomApiClient = (
  apiName: 'poiSearch' | 'geocode' | 'categorySearch' | 'reverseGeocode'
) => {
  const client = axios.create({
    baseURL: `https://api.tomtom.com/search/2/${apiName}`,
  });

  return client;
};

export const getExternalApiAddressClient = (
  apiName:
    | 'details'
    | 'autocomplete'
    | 'poiSearch'
    | 'geocode'
    | 'categorySearch'
    | 'reverseGeocode'
) => {
  return {
    search: (args: {
      term: string;
      lat?: string;
      lng?: string;
      radius?: number;
      types?: string;
      topLeft?: string;
      btmRight?: string;
    }) => {
      let client;
      let url = '';

      if (apiName === 'autocomplete' || apiName === 'details') {
        url += '/json';
        client = getGoogleApiClient(apiName);
        url += `?key=${configService.getGoogleApiToken()}`;
      }

      if (
        apiName === 'poiSearch' ||
        apiName === 'geocode' ||
        apiName === 'categorySearch'
      ) {
        client = getTomTomApiClient(apiName);
        url += `/${encodeURIComponent(
          args.term
        )}.json?key=${configService.getTomtomApiKey()}`;
      }

      if (apiName === 'autocomplete') {
        url += '&inputtype=textquery';
        url += `&input=${encodeURIComponent(args.term)}`;
        url += '&fields=geometry,place_id,formatted_address,name';
        url += args.types ? `&types=${args.types}` : '';

        if (args.lat && args.lng) {
          const searchRadius =
            args.radius !== null && args.radius !== undefined
              ? args.radius
              : 10000;
          url += `&locationrestriction=circle:${searchRadius}@${args.lat},${args.lng}`;
        }

        if (
          args.topLeft &&
          args.btmRight &&
          !isAirportSearch(args.term, [args.types])
        ) {
          url += `&locationrestriction=rectangle:${args.btmRight}|${args.topLeft}`;
        }

        if (
          args.topLeft &&
          args.btmRight &&
          !!isAirportSearch(args.term, [args.types])
        ) {
          url += `&locationbias=rectangle:${args.btmRight}|${args.topLeft}`;
        }
      }

      if (apiName === 'details') {
        url += `&place_id=${args.term}`;
        url +=
          '&fields=geometry,formatted_address,name,type,place_id,address_components';
      }

      if (
        apiName === 'poiSearch' ||
        apiName === 'geocode' ||
        apiName === 'categorySearch'
      ) {
        url += args.lat ? `&lat=${args.lat}` : '';
        url += args.lng ? `&lon=${args.lng}` : '';
        url += args.radius ? `&radius=${args.radius}` : '';
        url += args.topLeft ? `&topLeft=${args.topLeft}` : '';
        url += args.btmRight ? `&btmRight=${args.btmRight}` : '';
      }

      if (apiName === 'poiSearch' || apiName === 'geocode') {
        url += '&limit=5';
      }

      if (apiName === 'categorySearch') {
        url += '&limit=30';
      }

      if (apiName === 'reverseGeocode') {
        client = getTomTomApiClient(apiName);
        url += `/${args.lat},${
          args.lng
        }.json?key=${configService.getTomtomApiKey()}`;
      }

      console.info(
        `External API Address URL: ${client.defaults.baseURL + url}`
      );

      return client.get(url);
    },
  };
};

export const isMainTrainStationSearch = (
  poiName: string,
  categories: string[] = []
) => {
  const trainStationCategories = [
    'railroad station',
    'railroad stop',
    'railway siding',
    'railway station',
  ];
  const mainStationRegex =
    /\b(main station|central station|hauptbahnhof|hbf)\b/i;
  return (
    mainStationRegex.test(poiName) ||
    categories.some((cat) => trainStationCategories.includes(cat))
  );
};

export const isHighwayRequest = (
  isHighwayRequested: boolean,
  address: string
) => {
  if (isHighwayRequested) {
    return true;
  }

  if (getHighwayName(address)) {
    return true;
  }

  const highwayRegex = /\b(autobahn|highway|rest area|rest stop)\b/i;
  return highwayRegex.test(address);
};

export const isCityCenter = (isCityCenter: boolean, address: string) => {
  if (isCityCenter) {
    return true;
  }

  const highwayRegex = /\b(center|central)\b/i;
  return highwayRegex.test(address);
};

export const isPoiCategorySearch = (categories: string[], poiName: string) => {
  if (poiName) {
    return false;
  }

  if (!categories || categories.length < 1) {
    return false;
  }

  return categories.some((val) => getPossibleCategory(val, null) !== null);
};

export const isChargePointSearchNeededForPoiCategories = (
  categories: string[],
  poiName: string
) => {
  if (poiName) {
    return false;
  }

  if (!categories || categories.length < 1) {
    return false;
  }

  return categories.some(
    (val) => getPossibleChargePointPoiCategory(val) !== null
  );
};

export const isPoiSearchBasedOnCategories = (
  categories: string[],
  poiName: string
) => {
  if (poiName) {
    return false;
  }

  if (!categories || categories.length < 1) {
    return false;
  }

  return categories.some((val) => getPossiblePoiSearchCategory(val) !== null);
};

export const removeWordsFromTerm = (term: string, word: string): string => {
  if (!word && !term) {
    return '';
  }

  if (!term) {
    return '';
  }

  if (!word) {
    return term.toLowerCase().trim();
  }

  const sanitizedWord = word.toLowerCase();
  return term
    .toLowerCase()
    .replace(`${sanitizedWord}, `, '')
    .replace(`, ${sanitizedWord}`, '')
    .replace(sanitizedWord, '')
    .trim();
};

export const isAirportSearch = (poiName: string, categories: string[]) => {
  if (!categories || categories.length < 1) {
    return false;
  }

  const airportCategories = ['airport', 'airports'];
  const isCategoriesContainAirport = categories.some((val) =>
    airportCategories.includes(val)
  );
  const isNameContainAirport =
    poiName && poiName.toLowerCase().includes('airport');

  return isCategoriesContainAirport || isNameContainAirport;
};

export const searchAirport = async (
  addressCharacteristics: Partial<AddressCharacteristics>,
  currentLatitude?: string,
  currentLongitude?: string
) => {
  let locationBiasError, locationBias;

  if ((!currentLatitude || !currentLongitude) && addressCharacteristics.city) {
    const [error, bias] = await useTryAsync(() =>
      getLocationBias(
        addressCharacteristics.city,
        addressCharacteristics.cardinalDirection
      )
    );

    locationBiasError = error;
    locationBias = bias;

    if (locationBiasError) {
      return mapResultsToPoiSearchResults(
        [],
        'searchAirport',
        new AddressNotFoundError('No Address API results found.')
      );
    }
  }

  let lat, lng, radius, topLeft, btmRight;

  if (!locationBias) {
    lat = currentLatitude;
    lng = currentLongitude;
    radius = 50000;
  } else {
    topLeft = locationBias.boundingBox.topLeftPoint;
    btmRight = locationBias.boundingBox.btmRightPoint;
  }

  const queryResults = (await queryFallback(() => {
    return queryAutocomplete({
      term: getAirportSearchQueryTerm(
        addressCharacteristics.poiName,
        addressCharacteristics.city
      ),
      lat,
      lng,
      radius,
      topLeft,
      btmRight,
      types: 'airport',
    });
  })) as any;

  return processQueryResults('searchAirport', {
    status: 200,
    data: {
      status: queryResults.length > 0 ? 'OK' : 'ZERO_RESULTS',
      candidates: queryResults,
    },
  });
};

export const getAirportSearchQueryTerm = (poiName: string, city: string) => {
  if (poiName) {
    return poiName;
  }

  return `${city} airport`;
};

export const searchMainTrainStation = async (
  addressCharacteristics: Partial<AddressCharacteristics>,
  currentLatitude?: string,
  currentLongitude?: string
) => {
  let locationBiasError, locationBias;

  if ((!currentLatitude || !currentLongitude) && addressCharacteristics.city) {
    const [error, bias] = await useTryAsync(() =>
      getLocationBias(
        addressCharacteristics.city,
        addressCharacteristics.cardinalDirection
      )
    );

    locationBiasError = error;
    locationBias = bias;

    if (locationBiasError) {
      return mapResultsToPoiSearchResults(
        [],
        'searchMainTrainStation',
        new AddressNotFoundError('No Address API results found.')
      );
    }
  }

  let lat, lng, radius, topLeft, btmRight;

  if (!locationBias) {
    lat = currentLatitude;
    lng = currentLongitude;
    radius = 5000;
  } else {
    topLeft = locationBias.boundingBox.topLeftPoint;
    btmRight = locationBias.boundingBox.btmRightPoint;
  }

  const queryResults = (await queryFallback(
    () => {
      return queryAutocomplete({
        term: getMainTrainStationWordByCountryCode(
          addressCharacteristics.poiName,
          locationBias?.countryCode
        ),
        lat,
        lng,
        radius,
        types: 'transit_station|parking',
        topLeft,
        btmRight,
      });
    },
    () => {
      return queryPlacesByCategory({
        term: 'main railway station',
        lat,
        lng,
        radius,
        topLeft,
        btmRight,
      });
    }
  )) as any;

  return processQueryResults('searchMainTrainStation', {
    status: 200,
    data: {
      status: queryResults.length > 0 ? 'OK' : 'ZERO_RESULTS',
      candidates: queryResults,
    },
  });
};

const getLocationBiasHighwayQueryWithFallback = (
  city: string,
  address: string,
  languageCountryCode: string
) => {
  return city
    ? city
    : translateHighwayAddress(
        address,
        getHighwayWordByCountryCode(languageCountryCode)
      );
};

const translateHighwayAddress = (address: string, highwayWord: string) => {
  return address.replace('highway', highwayWord);
};

export const searchOnHighway = async (
  addressCharacteristics: Partial<AddressCharacteristics>,
  currentLatitude?: string,
  currentLongitude?: string,
  languageCountryCode?: string
) => {
  const highwayName = getHighwayName(addressCharacteristics.addressLine);

  let locationBiasError, locationBias;
  if (!currentLatitude || !currentLongitude) {
    const [error, bias] = await useTryAsync(() =>
      getLocationBias(
        getLocationBiasHighwayQueryWithFallback(
          addressCharacteristics.city,
          addressCharacteristics.addressLine,
          languageCountryCode
        ),
        addressCharacteristics.cardinalDirection
      )
    );
    locationBiasError = error;
    locationBias = bias;

    if (locationBiasError) {
      return mapResultsToPoiSearchResults(
        [],
        'searchOnHighway',
        new AddressNotFoundError('No Address API results found.')
      );
    }
  }

  let lat, lng;

  if (!locationBias) {
    lat = currentLatitude;
    lng = currentLongitude;
  } else {
    lat = locationBias.lat;
    lng = locationBias.lng;
  }

  const queryResults = await queryFallback(
    async () => {
      const results = await queryPlacesByCategory({
        term: `${highwayName ? `${highwayName} ` : ''}rest area`,
        lat,
        lng,
        radius: 30000,
      });
      return {
        status: 200,
        data: {
          status: results.length > 0 ? 'OK' : 'ZERO_RESULTS',
          candidates: results,
        },
      };
    },
    () => {
      return queryAutocomplete({
        term: getAutocompleteHighwayQueryTerm(
          highwayName,
          addressCharacteristics.poiName,
          addressCharacteristics.city,
          locationBias?.countryCode
        ),
        lat,
        lng,
        radius: 15000,
      });
    }
  );

  return processQueryResults('searchOnHighway', {
    status: 200,
    data: {
      status: queryResults.length > 0 ? 'OK' : 'ZERO_RESULTS',
      candidates: queryResults,
    },
  });
};

// The ordering of words affects the result of the search
const getAutocompleteHighwayQueryTerm = (
  highwayName: string,
  poiName: string,
  city: string,
  countryCode: string
) => {
  if (poiName) {
    return poiName;
  }

  if (highwayName) {
    return `${highwayName ? highwayName : ''} ${city}`;
  } else {
    return `${
      highwayName ? highwayName : ''
    } ${city} ${getHighwayWordByCountryCode(countryCode)}`;
  }
};

const getAlpha3CountryCodeFromGoogleAddressComponents = (components: any) => {
  const country = components.find(({ types }) => types.includes('country'));

  if (!country) {
    return null;
  }

  return alpha2to3Map[country.short_name.toUpperCase()];
};

const getMunicipalityFromGoogleAddressComponents = (components: any) => {
  const locality = components.find(({ types }) => types.includes('locality'));

  if (!locality) {
    return null;
  }

  return locality.long_name;
};

const getGooglePositionFromGoogleData = (googleData: any) => {
  if (googleData.geometry.location) {
    return {
      lat: googleData.geometry.location.lat,
      lon: googleData.geometry.location.lng,
    };
  }

  return {
    lat: googleData.geometry.viewport.northeast.lat,
    lon: googleData.geometry.viewport.northeast.lng,
  };
};

const googleToTomtomData = (googleData: any) => {
  const data = {
    type: googleData.types[0],
    id: googleData.place_id,
    matchConfidence: { score: 1 },
    address: {
      freeformAddress: googleData.formatted_address,
      countryCode: getAlpha3CountryCodeFromGoogleAddressComponents(
        googleData.address_components
      ),
      municipality: getMunicipalityFromGoogleAddressComponents(
        googleData.address_components
      ),
    },
    poi: {
      name: googleData.name,
    },
    position: getGooglePositionFromGoogleData(googleData),
    boundingBox: {
      topLeftPoint: {
        lat: googleData.geometry.viewport.northeast.lat,
        lon: googleData.geometry.viewport.southwest.lng,
      },
      btmRightPoint: {
        lat: googleData.geometry.viewport.southwest.lat,
        lon: googleData.geometry.viewport.northeast.lng,
      },
    },
  };

  return data;
};

export const processQueryResults = (queryName: string, queryResults: any) => {
  if (queryResults.status !== 200) {
    console.info(
      `Address API ${queryName} failed: ${JSON.stringify(queryResults)}`
    );
    return mapResultsToPoiSearchResults(
      [],
      queryName,
      new AddressNotFoundError('No Address API results found.')
    );
  }

  if (queryResults.data.status !== 'OK') {
    return mapResultsToPoiSearchResults(
      [],
      queryName,
      new AddressNotFoundError('No Address API results found.')
    );
  }

  const data = queryResults.data.candidates;

  const [removeApartError, addressApartFromEachOther] = useTry(() => {
    const filterOptionsData = data.map((val: any) => ({
      ...val,
      name: val.poi.name,
      lat: val.position.lat,
      lng: val.position.lon,
    }));

    return filterOptionsTooCloseFromEachOther(filterOptionsData);
  });

  if (removeApartError) {
    console.info(JSON.stringify(removeApartError));
  }

  return mapResultsToPoiSearchResults(
    mapAddressResultsIntoAddressOptions(addressApartFromEachOther),
    queryName,
    null
  );
};

export const getCityFromHighwayQuery = (term: string): string => {
  return removeWordsFromTerm(
    removeWordsFromTerm(removeWordsFromTerm(term, 'rest area'), 'highway'),
    'autobahn'
  );
};

export const searchDestination = async (
  addressCharacteristics: Partial<AddressCharacteristics>,
  currentLatitude?: string,
  currentLongitude?: string,
  radius?: number,
  languageCountryCode?: string
): Promise<SearchDestinationResponse> => {
  if (
    isAirportSearch(
      addressCharacteristics.poiName,
      addressCharacteristics.poiCategories
    )
  ) {
    return searchAirport(
      addressCharacteristics,
      currentLatitude,
      currentLongitude
    );
  }

  if (
    isMainTrainStationSearch(
      addressCharacteristics.poiName,
      addressCharacteristics.poiCategories
    )
  ) {
    return searchMainTrainStation(
      addressCharacteristics,
      currentLatitude,
      currentLongitude
    );
  }

  if (
    isHighwayRequest(
      addressCharacteristics.isHighwayRequested,
      addressCharacteristics.addressLine
    )
  ) {
    return searchOnHighway(
      addressCharacteristics,
      currentLatitude,
      currentLongitude,
      languageCountryCode
    );
  }

  if (
    isCityCenter(
      addressCharacteristics.isCityCenter,
      addressCharacteristics.addressLine
    )
  ) {
    return searchDestination(
      {
        ...addressCharacteristics,
        isCityCenter: false,
      },
      currentLatitude,
      currentLongitude,
      1500,
      languageCountryCode
    );
  }

  if (
    isChargePointSearchNeededForPoiCategories(
      addressCharacteristics.poiCategories,
      addressCharacteristics.poiName
    )
  ) {
    return searchPoiCategory(
      addressCharacteristics,
      currentLatitude,
      currentLongitude,
      languageCountryCode
    );
  }

  if (
    isPoiSearchBasedOnCategories(
      addressCharacteristics.poiCategories,
      addressCharacteristics.poiName
    )
  ) {
    return searchPoiBasedOnCategory(
      addressCharacteristics,
      currentLatitude,
      currentLongitude,
      languageCountryCode
    );
  }

  if (
    isGeocodeSearch(
      addressCharacteristics.city,
      addressCharacteristics.poiName,
      addressCharacteristics.district
    )
  ) {
    return searchGeocode(
      addressCharacteristics,
      currentLatitude,
      currentLongitude
    );
  }

  let locationBiasError, locationBias;

  if ((!currentLatitude || !currentLongitude) && addressCharacteristics.city) {
    const [error, bias] = await useTryAsync(() =>
      getLocationBias(addressCharacteristics.city, null)
    );

    locationBiasError = error;
    locationBias = bias;

    if (locationBiasError) {
      return mapResultsToPoiSearchResults(
        [],
        'searchDestination',
        new AddressNotFoundError('No location bias found.')
      );
    }
  }

  let lat, lng, topLeft, btmRight;

  if (!locationBias) {
    lat = currentLatitude;
    lng = currentLongitude;
    radius = radius ?? 10000;
  } else {
    topLeft = locationBias.boundingBox.topLeftPoint;
    btmRight = locationBias.boundingBox.btmRightPoint;
  }

  const queryTerm = getPoiSearchTerm(addressCharacteristics);

  const queryResults = await queryFallback(
    async () => {
      return queryAutocomplete({
        term: queryTerm,
        lat,
        lng,
        radius,
        topLeft,
        btmRight,
      });
    },
    async () => {
      return autocompleteCardinalDirectionWrapper(
        () =>
          queryAutocomplete({
            term: getFallbackPoiSearchTerm(addressCharacteristics),
          }),
        addressCharacteristics.cardinalDirection as CardinalDirections,
        addressCharacteristics.countryCode
      );
    }
  );

  const candidates = sortOptionsByDistanceFromCurrentCoordinates(
    queryResults,
    currentLatitude && currentLongitude
      ? { lat: currentLatitude, lng: currentLongitude }
      : null
  );

  return processQueryResults('searchDestination', {
    status: 200,
    data: {
      status: queryResults.length > 0 ? 'OK' : 'ZERO_RESULTS',
      candidates,
    },
  });
};

const getFallbackPoiSearchTerm = (
  addressCharacteristics: Partial<AddressCharacteristics>
) => {
  return [
    addressCharacteristics.poiName,
    addressCharacteristics.addressLine,
    addressCharacteristics.district,
    addressCharacteristics.city,
  ]
    .filter(Boolean)
    .join(', ');
};

export const isGeocodeSearch = (
  city: string,
  poiName: string,
  district: string
) => {
  return !!city && !poiName && !district;
};

export const searchPoiCategory = async (
  addressCharacteristics: Partial<AddressCharacteristics>,
  currentLatitude?: string,
  currentLongitude?: string,
  languageCountryCode?: string
) => {
  let locationBiasError, locationBias;

  if (!currentLatitude || !currentLongitude) {
    const [error, bias] = await useTryAsync(() =>
      getLocationBias(
        addressCharacteristics.city,
        addressCharacteristics.cardinalDirection
      )
    );

    locationBiasError = error;
    locationBias = bias;

    if (locationBiasError) {
      return mapResultsToPoiSearchResults(
        [],
        'searchPoiCategory',
        new AddressNotFoundError('No Address API results found.')
      );
    }
  }

  let lat, lng, radius, topLeft, btmRight;

  if (!locationBias) {
    lat = currentLatitude;
    lng = currentLongitude;
    radius = 15000;
  } else {
    topLeft = locationBias.boundingBox.topLeftPoint;
    btmRight = locationBias.boundingBox.btmRightPoint;
  }

  const searchTerm = getCategoryQueryTerm(addressCharacteristics.poiCategories);

  const queryResults = await queryFallback(
    async () => {
      const categoryResults = await queryPlacesByCategory({
        term: searchTerm,
        lat,
        lng,
        radius,
        topLeft,
        btmRight,
      });
      if (categoryResults.length > 0) {
        const groupedLocations = clusterLocationsTogether(
          categoryResults,
          getClusterSummarizer(languageCountryCode)
        );

        return {
          status: 200,
          data: {
            status: groupedLocations.length > 0 ? 'OK' : 'ZERO_RESULTS',
            candidates: groupedLocations,
          },
        };
      }

      return [];
    },
    () =>
      queryAutocomplete({
        term: searchTerm,
        lat,
        lng,
        radius,
        topLeft,
        btmRight,
      })
  );

  return processQueryResults('searchPoiCategory', {
    status: 200,
    data: {
      status: queryResults.length > 0 ? 'OK' : 'ZERO_RESULTS',
      candidates: queryResults,
    },
  });
};

export const searchPoiBasedOnCategory = async (
  addressCharacteristics: Partial<AddressCharacteristics>,
  currentLatitude?: string,
  currentLongitude?: string,
  languageCountryCode?: string
) => {
  let locationBiasError, locationBias;

  if (!currentLatitude || !currentLongitude) {
    const [error, bias] = await useTryAsync(() =>
      getLocationBias(
        addressCharacteristics.city,
        addressCharacteristics.cardinalDirection
      )
    );

    locationBiasError = error;
    locationBias = bias;

    if (locationBiasError) {
      return mapResultsToPoiSearchResults(
        [],
        'searchPoiBasedOnCategory',
        new AddressNotFoundError('No Address API results found.')
      );
    }
  }

  let lat, lng, radius, topLeft, btmRight;

  if (!locationBias) {
    lat = currentLatitude;
    lng = currentLongitude;
    radius = 15000;
  } else {
    topLeft = locationBias.boundingBox.topLeftPoint;
    btmRight = locationBias.boundingBox.btmRightPoint;
  }

  const searchTerm = await getTranslatedPoiCategories(
    addressCharacteristics.country,
    addressCharacteristics.poiCategories[0]
  );

  const queryResults = await queryFallback(
    async () => {
      const categoryResults = await queryPlacesByName({
        term: searchTerm,
        lat,
        lng,
        topLeft,
        btmRight,
      });

      if (categoryResults.length > 0) {
        const groupedLocations = clusterLocationsTogether(
          categoryResults,
          getClusterSummarizer(languageCountryCode)
        );

        return {
          status: 200,
          data: {
            status: groupedLocations.length > 0 ? 'OK' : 'ZERO_RESULTS',
            candidates: groupedLocations,
          },
        };
      }

      return [];
    },
    () =>
      queryAutocomplete({
        term: searchTerm,
        lat,
        lng,
        radius,
        topLeft,
        btmRight,
      })
  );

  return processQueryResults('searchPoiBasedOnCategory', {
    status: 200,
    data: {
      status: queryResults.length > 0 ? 'OK' : 'ZERO_RESULTS',
      candidates: queryResults,
    },
  });
};

export const queryAutocomplete = async (args: {
  term: string;
  lat?: string;
  lng?: string;
  radius?: number;
  types?: string; // | delimited list of types
  topLeft?: string;
  btmRight?: string;
}) => {
  const { southwest, northeast } = boundingBox2GoogleBoundingBox(
    args.topLeft,
    args.btmRight
  );

  const queryResults = await getExternalApiAddressClient('autocomplete').search(
    {
      ...args,
      topLeft: northeast,
      btmRight: southwest,
    }
  );

  if (queryResults.status !== 200) {
    return {
      status: queryResults.status,
      data: {
        status: 'ZERO_RESULTS',
      },
    };
  }

  if (queryResults.data.status !== 'OK') {
    return {
      status: queryResults.status,
      data: {
        status: queryResults.data.status,
      },
    };
  }

  const placeDetailsQueries = queryResults.data.predictions.map(
    async ({ place_id }) => {
      const detailsResults = await matchPoiId(place_id);
      return detailsResults;
    }
  );

  const addressDetailsResults = await Promise.all(placeDetailsQueries);

  return {
    status: 200,
    data: {
      status: 'OK',
      candidates: addressDetailsResults.filter(Boolean),
    },
  };
};

export const searchGeocode = async (
  addressCharacteristics: Partial<AddressCharacteristics>,
  currentLatitude?: string,
  currentLongitude?: string
) => {
  let lat, lng, radius;

  if (currentLatitude && currentLongitude) {
    lat = currentLatitude;
    lng = currentLongitude;
    radius = 15000;
  }

  const searchTerm = getGeocodeQueryTerm(addressCharacteristics);

  const queryResults = await queryFallback(
    async () => {
      const geocodeResults = await queryPlacesByGeocode({
        term: searchTerm,
        lat,
        lng,
      });

      if (geocodeResults.length > 0 && !addressCharacteristics?.addressLine) {
        return {
          status: 200,
          data: {
            status: 'OK',
            candidates: geocodeResults,
          },
        };
      }

      if (geocodeResults.length > 0 && addressCharacteristics?.addressLine) {
        if (geocodeResults[0].type === 'Street') {
          return {
            status: 200,
            data: {
              status: 'OK',
              candidates: geocodeResults,
            },
          };
        }

        return {
          status: 200,
          data: {
            status: 'ZERO_RESULTS',
          },
        };
      }

      if (geocodeResults.length < 0) {
        return {
          status: 200,
          data: {
            status: 'ZERO_RESULTS',
          },
        };
      }

      return [];
    },
    () =>
      queryAutocomplete({
        term: searchTerm,
        lat,
        lng,
        radius,
      })
  );

  const candidates = chooseMostSuitableGeocodeOptions(
    addressCharacteristics,
    queryResults
  );

  return processQueryResults('searchGeocode', {
    status: 200,
    data: {
      status: candidates.length > 0 ? 'OK' : 'ZERO_RESULTS',
      candidates: candidates
        .map((val) => {
          if (addressCharacteristics.cardinalDirection) {
            return moveLocationToCardinalDirection(
              val,
              getProperCardinalDirection(
                addressCharacteristics.cardinalDirection
              ),
              addressCharacteristics.countryCode
            );
          }

          return val;
        })
        .map((val) =>
          fillInPoiObjectForGeocodeOption(
            val,
            translateCardinalDirectionByCountryCode(
              getProperCardinalDirection(
                addressCharacteristics.cardinalDirection
              ),
              addressCharacteristics.countryCode
            )
          )
        ),
    },
  });
};

const translateCardinalDirectionByCountryCode = (
  cardinalDirection: CardinalDirections,
  countryCode: string
) => {
  if (!cardinalDirection) {
    return undefined;
  }

  const countryCode2ToLanguageMap = {
    GBR: 'en',
    DEU: 'de',
    FRA: 'fr',
    ESP: 'es',
    ITA: 'it',
    PTR: 'pt',
    POL: 'pl',
    CZE: 'cz',
  };

  const targetLanguage = countryCode2ToLanguageMap[countryCode] ?? 'en';
  return getTranslation(
    targetLanguage,
    `cardinalDirections.${cardinalDirection}`
  );
};

const moveLocationToCardinalDirection = (
  location,
  cardinalDirection,
  countryCode
) => {
  const movedCoordinates = movePointToCardinalDirection(
    cardinalDirection,
    countryCode,
    (location.boundingBox ?? location.viewport).topLeftPoint,
    (location.boundingBox ?? location.viewport).btmRightPoint
  );

  return {
    ...location,
    position: {
      lat: movedCoordinates.lat,
      lon: movedCoordinates.lng,
    },
  };
};

const fillInPoiObjectForGeocodeOption = (location, cardinalDirection) => {
  const parts = Array.from(new Set([cardinalDirection])).filter(Boolean);

  return {
    poi: {
      name: parts.join(', '),
    },
    ...location,
  };
};

const getGeocodeQueryTerm = (
  addressCharacteristics: Partial<AddressCharacteristics>
) => {
  return [
    addressCharacteristics.addressLine,
    addressCharacteristics.district,
    addressCharacteristics.city,
  ]
    .filter(Boolean)
    .join(', ');
};

export const getCategoryQueryTerm = (categories: string[]) => {
  return categories.filter(Boolean).join(' ');
};

const queryPlacesByGeocode = async (args: {
  term: string;
  lat: string;
  lng: string;
}) => {
  const queryResults = await getExternalApiAddressClient('geocode').search(
    args
  );

  if (queryResults.status !== 200) {
    return [];
  }

  if (queryResults.data.summary.totalResults === 0) {
    return [];
  }

  return queryResults.data.results.map((val) => {
    const matchConfidence = val.matchConfidence
      ? val.matchConfidence
      : { score: 1 };
    val.address.countryCode = val.address.countryCodeISO3;
    return {
      ...val,
      address: {
        ...val.address,
        countryCode: val.address.countryCodeISO3,
      },
      matchConfidence,
    };
  });
};

export const queryPlacesByCategory = async (args: {
  term: string;
  lat?: string;
  lng?: string;
  radius?: number;
  topLeft?: string;
  btmRight?: string;
}) => {
  const queryResults = await getExternalApiAddressClient(
    'categorySearch'
  ).search(args);

  if (queryResults.status !== 200) {
    return [];
  }

  if (queryResults.data.summary.totalResults === 0) {
    return [];
  }

  return queryResults.data.results.map((val) => {
    const matchConfidence = val.matchConfidence
      ? val.matchConfidence
      : { score: 1 };
    return {
      ...val,
      address: {
        ...val.address,
        countryCode: val.address.countryCodeISO3,
      },
      matchConfidence,
    };
  });
};

const queryPlacesByName = async (args: {
  term: string;
  lat?: string;
  lng?: string;
  topLeft?: string;
  btmRight?: string;
}) => {
  const queryResults = await getExternalApiAddressClient('poiSearch').search(
    args
  );

  if (queryResults.status !== 200) {
    return [];
  }

  if (queryResults.data.summary.totalResults === 0) {
    return [];
  }

  return queryResults.data.results.map((val) => {
    const matchConfidence = val.matchConfidence
      ? val.matchConfidence
      : { score: 1 };
    return {
      ...val,
      address: {
        ...val.address,
        countryCode: val.address.countryCodeISO3,
      },
      matchConfidence,
    };
  });
};

export const getLocationBias = async (
  city: string,
  cardinalDirectionInput: string
): Promise<LocationBiasOutput> => {
  const locationBiasSearchRadius = 4000000;

  const response = await queryFallback(() => {
    return getExternalApiAddressClient('autocomplete').search({
      term: city,
      lat: centerLat,
      lng: centerLng,
      radius: locationBiasSearchRadius,
    });
  });

  if (response.length < 1) {
    throw new AddressNotFoundError('No Address API results found.');
  }

  const [firstPrediction] = response.filter(({ description }) => {
    return description.toLowerCase().includes(city.toLowerCase());
  });

  const predictionData = !firstPrediction ? response[0] : firstPrediction;

  const firstResult = await matchPoiId(predictionData.place_id);

  const countryCode = firstResult.address.countryCode;

  const cardinalDirection = getProperCardinalDirection(cardinalDirectionInput);

  if (cardinalDirection) {
    return movePointToCardinalDirection(
      cardinalDirection,
      countryCode,
      firstResult.boundingBox.topLeftPoint,
      firstResult.boundingBox.btmRightPoint
    );
  }

  return {
    lat: firstResult.position.lat,
    lng: firstResult.position.lon,
    countryCode,
    cardinalDirection,
    boundingBox: boundingBox2String(firstResult.boundingBox),
  };
};

const queryPlaceById = async (id: string) => {
  const queryResults = await getExternalApiAddressClient('details').search({
    term: id,
  });

  if (queryResults.status !== 200) {
    return null;
  }

  if (queryResults.data.status !== 'OK') {
    return null;
  }

  return queryResults.data.result;
};

const matchPoiId = async (id: string) => {
  const details = await queryPlaceById(id);

  if (!details) {
    return null;
  }

  return googleToTomtomData(details);
};

const getHighwayWordByCountryCode = (countryCode: string) => {
  if (!countryCode) {
    return 'Autobahn';
  }

  const dictionary = {
    DEU: 'Autobahn',
    CZE: 'dálnice',
    POL: 'autostrada',
    PTR: 'autoestrada',
    GBR: 'highway',
    ESP: 'autopista',
    FRA: 'autoroute',
  };
  return dictionary[countryCode];
};

export const getMainTrainStationWordByCountryCode = (
  poiName: string,
  countryCode: string
) => {
  if (poiName) {
    return poiName;
  }

  if (!countryCode) {
    return 'Hauptbahnhof';
  }

  const dictionary = {
    DEU: 'Hauptbahnhof',
    CZE: 'Hlavní nádraží',
    POL: 'Dworzec Centralny',
    PTR: 'Estação Central',
    GBR: 'Central Station',
    ESP: 'Estación central',
    FRA: 'Gare centrale',
  };
  return dictionary[countryCode];
};

export const removePoiNameFromTerm = (
  term: string,
  businessName: string
): { term: string; businessName: string } => {
  if (!businessName) {
    return {
      term: term.toLowerCase(),
      businessName: undefined,
    };
  }

  const newBusinessName = businessName.toLowerCase().trim();
  const newTerm = term
    .toLowerCase()
    .replace(`, ${newBusinessName}`, '')
    .replace(`${newBusinessName}, `, '')
    .replace(newBusinessName, '');

  return { term: newTerm, businessName: newBusinessName };
};

const poiSearchQueries = [
  'searchAirport',
  'searchMainTrainStation',
  'searchDestination',
  'searchPoiCategory',
  'searchPoiBasedOnCategory',
];

export const mapResultsToPoiSearchResults = (
  results: any[],
  queryName: string,
  error?: any
) => {
  if (error) {
    return {
      error,
      addressOptions: null,
      isPoiSearch: false,
    };
  }

  const addressOptions =
    results.length === 1
      ? results.map((option) => ({
          ...option,
          address: removeExtraCommas(option.address),
          name: removeExtraCommas(option.name),
        }))
      : results;

  const isPoiSearch = poiSearchQueries.includes(queryName);

  return {
    addressOptions,
    error,
    isPoiSearch,
  };
};

export const autocompleteCardinalDirectionWrapper = async (
  autocompleteFn: any,
  cardinalDirection: CardinalDirections,
  countryCode: string
) => {
  const res = await autocompleteFn();
  if (res.status === 200 && res.data.status === 'OK') {
    res.data.candidates = res.data.candidates.map((val) => {
      if (cardinalDirection) {
        return moveLocationToCardinalDirection(
          val,
          getProperCardinalDirection(cardinalDirection),
          countryCode
        );
      }

      return val;
    });
  }

  return res;
};

export const getAddressFromCurrentCoordinates = async (currentCoordinates: {
  lat: number;
  lng: number;
}): Promise<SearchPoiAddress> => {
  const queryResults = await getExternalApiAddressClient(
    'reverseGeocode'
  ).search({
    term: '',
    lat: currentCoordinates.lat.toString(),
    lng: currentCoordinates.lng.toString(),
  });

  if (queryResults.status !== 200) {
    return null;
  }

  if (queryResults.data.summary.numResults === 0) {
    return null;
  }

  return mapTomTomLocationIntoSearchPoiAddress(queryResults.data.addresses[0]);
};

const getTranslatedPoiCategories = async (country: string, category) => {
  const prompt = getPrompt(country, category);

  if (!country) {
    return category;
  }

  const { isError, chatGptResponse } = await quickCompletion(
    prompt,
    'conversationId',
    'chargegpt_demo_new',
    'recommendations',
    'en'
  );

  if (isError) {
    return category;
  }

  return chatGptResponse;
};

const getPrompt = (country: string, term: string) => {
  const prompt: Dialog[] = [];

  prompt.push(
    DialogFactory.fromSystem(
      `You are an efficient assistant. You need to translate this word, ${term} into the language that used in the ${country}. You don't have to explain the word, just translate it in one line.`
    )
  );

  return prompt;
};
