import { useTryAsync } from 'no-try';
import { AddressCharacteristics } from '../address-identifiers/address-characteristics.model';
import { SearchDestinationResponse } from './models/address.model';
import { queryFallback } from './query-utils.service';
import {
  getAirportSearchQueryTerm,
  getCategoryQueryTerm,
  getMainTrainStationWordByCountryCode,
  isAirportSearch,
  isMainTrainStationSearch,
  isPoiCategorySearch,
  processQueryResults,
  queryAutocomplete,
  queryPlacesByCategory,
} from './search-poi.service';

export const searchRouteNeeds = async (
  addressCharacteristics: Partial<AddressCharacteristics>,
  latitude: string,
  longitude: string
): Promise<SearchDestinationResponse> => {
  if (
    isAirportSearch(
      addressCharacteristics.poiName,
      addressCharacteristics.poiCategories
    )
  ) {
    return searchAirport(addressCharacteristics, latitude, longitude);
  }

  if (
    isMainTrainStationSearch(
      addressCharacteristics.poiName,
      addressCharacteristics.poiCategories
    )
  ) {
    return searchMainTrainStation(addressCharacteristics, latitude, longitude);
  }

  if (
    isPoiCategorySearch(
      addressCharacteristics.poiCategories,
      addressCharacteristics.poiName
    )
  ) {
    return searchPoiCategory(addressCharacteristics, latitude, longitude);
  }

  return searchPoi(addressCharacteristics, latitude, longitude);
};

const searchAirport = async (
  addressCharacteristics: Partial<AddressCharacteristics>,
  latitude: string,
  longitude: string
) => {
  const queryResults = (await queryFallback(() => {
    return queryAutocomplete({
      term: getAirportSearchQueryTerm(
        addressCharacteristics.poiName,
        addressCharacteristics.city
      ),
      lat: latitude,
      lng: longitude,
      radius: 1000,
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

const searchMainTrainStation = async (
  addressCharacteristics: Partial<AddressCharacteristics>,
  latitude: string,
  longitude: string
) => {
  const queryResults = (await queryFallback(
    () => {
      return queryAutocomplete({
        term: getMainTrainStationWordByCountryCode(
          addressCharacteristics.poiName,
          'Hauptbahnhof'
        ),
        lat: latitude,
        lng: longitude,
        radius: 1000,
        types: 'transit_station|parking',
      });
    },
    () => {
      return queryPlacesByCategory({
        term: 'main railway station',
        lat: latitude,
        lng: longitude,
        radius: 1000,
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

const queryRetryWrapper = async (
  queryFn: any,
  retryCount = 0
): Promise<any> => {
  const [err, results] = await useTryAsync(() => queryFn());

  if (err && (err as any)?.response?.status === 429 && retryCount < 5) {
    await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
    return queryRetryWrapper(queryFn, retryCount + 1);
  }

  if (err) {
    throw err;
  }

  return results;
};

const searchPoiCategory = async (
  addressCharacteristics: Partial<AddressCharacteristics>,
  latitude: string,
  longitude: string
) => {
  const searchTerm = getCategoryQueryTerm(addressCharacteristics.poiCategories);

  const queryResults = await queryFallback(async () => {
    const [err, categoryResults] = await useTryAsync(() =>
      queryPlacesByCategory({
        term: searchTerm,
        lat: latitude,
        lng: longitude,
        radius: 1000,
      })
    );
    if (!err && categoryResults.length > 0) {
      return {
        status: 200,
        data: {
          status: categoryResults.length > 0 ? 'OK' : 'ZERO_RESULTS',
          candidates: categoryResults,
        },
      };
    }

    return [];
  });

  return processQueryResults('searchPoiCategory', {
    status: 200,
    data: {
      status: queryResults.length > 0 ? 'OK' : 'ZERO_RESULTS',
      candidates: queryResults,
    },
  });
};

const searchPoi = async (
  addressCharacteristics: Partial<AddressCharacteristics>,
  latitude: string,
  longitude: string
) => {
  const queryResults = await queryFallback(async () => {
    return queryAutocomplete({
      term: addressCharacteristics.poiName,
      lat: latitude,
      lng: longitude,
      radius: 1000,
    });
  });

  return processQueryResults('searchPoi', {
    status: 200,
    data: {
      status: queryResults.length > 0 ? 'OK' : 'ZERO_RESULTS',
      candidates: queryResults,
    },
  });
};
