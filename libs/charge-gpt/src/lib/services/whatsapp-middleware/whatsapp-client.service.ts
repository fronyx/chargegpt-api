import { configService } from '@fronyx/configurations';
import axios from 'axios';

const businessPhoneNumberId = '432255216630607';
const baseURL = 'https://graph.facebook.com/v20.0';
const messageBaseURL = `${baseURL}/${businessPhoneNumberId}`;

export interface WhatsAppRecommendation {
  latitude: string;
  longitude: string;
}

type ReplyType = 'reply';

export interface ReplyButton {
  type: ReplyType;
  reply: {
    id: string;
    title: string;
  };
}

const getToken = () => {
  return configService.getWhatsAppClientToken();
};

const headers = { Authorization: `Bearer ${getToken()}` };

const client = axios.create({
  baseURL: messageBaseURL,
  headers,
});

const mediaClient = axios.create({
  baseURL,
  headers,
});

export const whatsAppClient = {
  sendMessage: (recipient: string, message: string) => {
    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipient,
      type: 'text',
      text: {
        preview_url: false,
        body: message,
      },
    };

    return client.post('/messages', body);
  },
  sendRecommendation: (
    recipient: string,
    recommendation: WhatsAppRecommendation
  ) => {
    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipient,
      type: 'location',
      location: recommendation,
    };

    return client.post('/messages', body);
  },
  sendCTA: (
    recipient: string,
    message: string,
    url_text: string,
    url: string
  ) => {
    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipient,
      type: 'interactive',
      interactive: {
        type: 'cta_url',
        body: {
          text: message,
        },
        action: {
          name: 'cta_url',
          parameters: {
            display_text: url_text,
            url: url,
          },
        },
      },
    };

    return client.post('/messages', body);
  },
  askUserLocation: (recipient: string, message: string) => {
    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipient,
      type: 'interactive',
      interactive: {
        type: 'location_request_message',
        body: {
          text: message,
        },
        action: {
          name: 'send_location',
        },
      },
    };
    return client.post('/messages', body);
  },
  messageSeen: (messageId: string) => {
    const body = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    };
    return client.post('/messages', body);
  },
  askAddressOptions: (
    recipient: string,
    message: string,
    replyButtons: ReplyButton[]
  ) => {
    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipient,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: message,
        },
        action: {
          buttons: replyButtons,
        },
      },
    };

    return client.post('/messages', body);
  },
  getAudioUrl: (mediaId: string) => {
    return mediaClient.get(`/${mediaId}`);
  },
  downloadMedia: (url: string, contentType: string) => {
    const downloadClient = axios.create({
      baseURL: url,
      headers,
    });

    return downloadClient.get('', {
      headers: {
        ...headers,
        'Content-Type': contentType,
      },
      responseType: 'arraybuffer',
    });
  },
};
