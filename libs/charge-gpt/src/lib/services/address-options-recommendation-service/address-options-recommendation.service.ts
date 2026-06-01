import { ToolkitProject } from '@fronyx/toolkit';
import { ConversationHistory } from '../../models/conversation-history.model';
import { AddressOption } from '../address-services/models/address.model';
import { Answer } from '../../models/prompt';
import {
  returnMetaData,
  returnRecommendations,
} from '../conversations-helper.service';
import { setSelectedAddressOptionToHistory } from '../conversation-destination-search.service';
import { searchForAvailableChargingStations } from '../search-charging-stations-service/charging-station-search.service';
import { calculateChargingStationsScore } from '../scoring-services/recommendations-type.functions';
import { ChargingStationWithScoreDetails } from '../../models/charging-stations.model';

export const getRecommendationsForAllAddressOptions = async (
  history: ConversationHistory,
  project: ToolkitProject,
  addressOptions: AddressOption[]
): Promise<Answer> => {
  const destinationAddress = history.getDestinationAddress();

  const queries = addressOptions.map((addressOption) =>
    searchRecommendations(history, addressOption, destinationAddress, project)
  );

  const recommendations = await Promise.all(queries);

  if (recommendations.every(({ error }) => !!error)) {
    const firstRecommendationWithError = recommendations.find(
      ({ error }) => !!error
    );

    history.setDestinationAddress(''); //reset destination address after error messages are constucted

    return returnMetaData(
      history,
      project,
      firstRecommendationWithError?.error
    );
  }

  const recommendationsWithNoError = recommendations.filter(
    ({ error }) => !error
  );

  recommendationsWithNoError.sort(({ score: a }, { score: b }) => b - a);

  const recommendationWithHighestScore = recommendationsWithNoError[0];

  const recommendedAddressLatitude = Number(
    recommendationWithHighestScore.latitude
  );
  const recommendedAddressLongitude = Number(
    recommendationWithHighestScore.longitude
  );

  const destination = addressOptions.find(
    (addressOption) =>
      addressOption.lat === recommendedAddressLatitude &&
      addressOption.lng === recommendedAddressLongitude
  );
  setSelectedAddressOptionToHistory(history, destination);

  const chargingStations = recommendationsWithNoError.flatMap(({ locations }) => locations);
  history.setAvailableChargingStations(chargingStations);
  history.setAddressOptions([]);

  return returnRecommendations(
    history,
    project,
    recommendationWithHighestScore.locations,
    []
  );
};

const searchRecommendations = async (
  originalHistory: ConversationHistory,
  addressOption: AddressOption,
  destinationAddress: string,
  project: ToolkitProject
): Promise<{
  latitude: number;
  longitude: number;
  score: number;
  locations: ChargingStationWithScoreDetails[];
  error: string;
}> => {
  const clonedHistory = new ConversationHistory(originalHistory.getJSON());
  setSelectedAddressOptionToHistory(clonedHistory, addressOption);
  clonedHistory.setDestinationAddress(destinationAddress); //this is needed in case of displaying error message

  const { locations, error } = await searchForAvailableChargingStations(
    clonedHistory,
    project
  );

  if (error) {
    return {
      error,
      latitude: null,
      longitude: null,
      score: null,
      locations: [],
    };
  }

  const scoredChargingStations = calculateChargingStationsScore(locations);

  const scores = scoredChargingStations.map(({ score }) => score);

  return {
    latitude: addressOption.lat,
    longitude: addressOption.lng,
    score: Math.max(...scores),
    locations: scoredChargingStations,
    error,
  };
};
