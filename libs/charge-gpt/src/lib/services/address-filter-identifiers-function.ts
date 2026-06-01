import { ConversationHistory } from '../models/conversation-history.model';

export const isDestinationInformationInHistory = (
  history: ConversationHistory
) => {
  const { address, latitude, longitude } = history.getData();

  const addressOptions = history.getAddressOptions();

  return (address && latitude && longitude) || addressOptions?.length > 0;
};

export const isCurrentCoordinatesInHistory = (history: ConversationHistory) => {
  const currentCoordinates = history.getCurrentCoordinates();

  return currentCoordinates?.lat && currentCoordinates?.lng;
};
