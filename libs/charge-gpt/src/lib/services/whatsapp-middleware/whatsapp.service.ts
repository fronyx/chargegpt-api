import { technicalConnectorNameToConnectorType } from '../../models/connector-type-to-standard-connector';
import { Coordinate, Location } from '@fronyx/data-transfer-object';
import { ReplyButton, whatsAppClient } from './whatsapp-client.service';
import * as FormData from 'form-data';
import { oggToWav } from '../audio-services/audio-file.service';

export interface WhatsAppRecommendationDestination {
  address: string;
  coordinates: Coordinate;
  countryCode: string;
}

export interface WhatsAppRecommendationAddress {
  address: string;
  coordinates: Coordinate;
}

export const sendMessage = async (
  recipient: string,
  message: string
): Promise<void> => {
  const response = await whatsAppClient.sendMessage(recipient, message);
  if (response.status !== 200) {
    console.error('Error sending message:', response);
  }
};

export const sendChargeGPTNotAvailableMessage = async (
  recipient: string
): Promise<void> => {
  const message =
    'We are sorry, ChargeGPT is not available at the moment. Please try again later.';
  await sendMessage(recipient, message);
};

export const sendRecommendation = async (
  recipient: string,
  location: Location,
  destination: WhatsAppRecommendationDestination,
  origin: WhatsAppRecommendationAddress,
  poi: WhatsAppRecommendationAddress
): Promise<void> => {
  const chargingStationDetails = getChargingStationDetails(
    location,
    destination,
    origin,
    poi
  );
  const recommendation = {
    latitude: location.lat.toString(),
    longitude: location.lng.toString(),
  };

  const sendMessageResponse = await whatsAppClient.sendMessage(
    recipient,
    chargingStationDetails
  );
  if (sendMessageResponse.status !== 200) {
    console.error('Error sending message:', sendMessageResponse);
  }

  const response = await whatsAppClient.sendRecommendation(
    recipient,
    recommendation
  );
  if (response.status !== 200) {
    console.error('Error sending location:', response);
  }
};

export const sendFAQHelpCTA = async (
  recipient: string,
  message: string
): Promise<void> => {
  const response = await whatsAppClient.sendCTA(
    recipient,
    message,
    'FAQ',
    'https://fronyx.io/chargegpt-whatsapp-faq'
  );
  if (response.status !== 200) {
    console.error('Error sending faq help cta:', response);
  }
};

export const askUserLocation = async (
  recipient: string,
  message: string
): Promise<void> => {
  const response = await whatsAppClient.askUserLocation(recipient, message);
  if (response.status !== 200) {
    console.error('Error asking for location:', response);
  }
};

export const sendMessageSeen = async (messageId: string): Promise<void> => {
  const response = await whatsAppClient.messageSeen(messageId);
  if (response.status !== 200) {
    console.error('Error sending seen:', response);
  }
};

export const sendConversationRestartedMessage = async (
  recipient: string
): Promise<void> => {
  await sendMessage(
    recipient,
    // eslint-disable-next-line quotes
    "I'm sorry, at the moment I can only have short conversations. That's why I needed to reset our conversation. Where and when do you want to charge?"
  );
};

export const getChargingStationDetails = (
  location: Location,
  destination: WhatsAppRecommendationDestination,
  origin: WhatsAppRecommendationAddress,
  poi: WhatsAppRecommendationAddress
): string => {
  const connectorTypes = location.connectorTypes
    .map((connectorType) => {
      return mapTechnicalConnectorTypeToConnectorType(connectorType);
    })
    .filter(
      (connectorType) =>
        connectorType !== null &&
        connectorType !== '' &&
        connectorType !== undefined
    );

  const locationID = `ID: ${location.locationId}`;
  const operatorName = ` - Operator: ${location.operatorName}`;
  const powerkW = ` - ${location.powerKw}kW`;
  const powerType = `, ${location.powerType}`;
  const connectorType = connectorTypes?.length
    ? `, ${connectorTypes.join(', ')}`
    : '';

  const prefix = `${locationID}${operatorName}${powerkW}${powerType}${connectorType}`;

  if (destination && origin) {
    const originAddress = origin ? ` - Origin: ${origin.address}` : '';
    const destinationAddress = destination
      ? ` - Destination: ${destination.address}`
      : '';
    const poiAddress = poi ? ` - ${poi.address}` : '';

    return `${prefix}${poiAddress}${originAddress}${destinationAddress}`;
  }

  const address = destination ? ` - ${destination.address}` : '';

  return `${prefix}${address}`;
};

export const mapTechnicalConnectorTypeToConnectorType = (
  connectorType: string
): string => {
  return technicalConnectorNameToConnectorType[connectorType.toLowerCase()];
};

export const askUserToChooseDestination = async (
  recipient: string,
  message: string
): Promise<void> => {
  const locations = message
    .split(/(\d\.\))/)
    .slice(1)
    .filter((_, index) => index % 2 !== 0);

  const optionButtons: ReplyButton[] = locations.map((_, index) => {
    return {
      type: 'reply',
      reply: {
        id: `${index + 1}`,
        title: `Option ${index + 1}`,
      },
    };
  });

  await whatsAppClient.askAddressOptions(recipient, message, optionButtons);
};

export const getAudioWavData = async (mediaId: string): Promise<any> => {
  const response = await whatsAppClient.getAudioUrl(mediaId);
  if (response.status !== 200) {
    console.error('Error getting audio data:', response);
    return null;
  }

  const downloadResponse = await whatsAppClient.downloadMedia(
    response.data.url,
    response.data.mime_type
  );

  if (downloadResponse.status !== 200) {
    console.error('Error getting audio data:', downloadResponse);
    return null;
  }

  return oggToWav(downloadResponse.data);
}

export const getWhatsAppAudioFormData = async (mediaId: string): Promise<FormData> => {
  const audioData = await getAudioWavData(mediaId);
  const contentType = 'audio/wav';
  const fileFormat = contentType.split('/')[1];

  const formData = new FormData();
  formData.append('file', audioData, {
    contentType: contentType,
    knownLength: audioData.ContentLength,
    filename: `${mediaId}.${fileFormat}`,
  });

  formData.append('model', 'whisper-1');

  return formData;
};
