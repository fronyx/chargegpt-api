import * as FormData from 'form-data';
import axios from 'axios';
import { getAudioFile } from './audio-file.service';
import { configService } from '@fronyx/configurations';
import { useTryAsync } from 'no-try';

const baseURL =
  'https://westeurope.api.cognitive.microsoft.com/speechtotext/transcriptions:transcribe?api-version=2024-05-15-preview';

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'multipart/form-data',
    Accept: 'application/json',
    'Ocp-Apim-Subscription-Key': configService.getAzureTTSToken(),
  },
});

export const sdkTranscribeAudio = async (
  filePath: string,
  locales: string
): Promise<string> => {
  const formData = new FormData();

  const fileId = filePath.replace('/tmp/', '').split('.')[0];
  const response: any = await getAudioFile(fileId);
  formData.append('audio', response.Body);
  const definition = {
    locales: [locales],
    profanityFilterMode: 'Masked',
    channels: [0],
  };
  formData.append('definition', JSON.stringify(definition));

  const res = await client.post('', formData);

  if (!res.data) {
    return '';
  }

  return mapDataToText(res.data);
};

const mapDataToText = (data: any): string => {
  const phrases = data.phrases;

  if (!phrases || phrases.length === 0) {
    return '';
  }

  return phrases.map((phrase: any) => phrase.text).join(' ');
};

export const historyLanguageToLocales = (lang: string): string => {
  switch (lang) {
    case 'de':
      return 'de-DE';
    case 'en':
      return 'en-US';
    case 'pt':
      return 'pt-PT';
    case 'es':
      return 'es-ES';
    case 'fr':
      return 'fr-FR';
    default:
      return 'de-DE';
  }
};

export const getWhisperAudioPayload = async (
  filename: string,
  audioFormat = 'wav'
): Promise<FormData> => {
  const response: any = await getAudioFile(filename);

  const formData = new FormData();
  formData.append('file', response.Body, {
    contentType: response.ContentType,
    knownLength: response.ContentLength,
    filename: `${filename}.${audioFormat}`,
  });

  formData.append('model', 'whisper-1');

  return formData;
};


const openAiClient = axios.create(configService.getOpenAIWhisperConfig());

const getAudioTranscription = async (
  payload: FormData,
  client = openAiClient,
  retryCount = 0
): Promise<string> => {
  const [err, response] = await useTryAsync(() => client.post('', payload));

  if (err && retryCount >= 3) {
    throw err;
  }

  if (err) {
    await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
    return getAudioTranscription(payload, client, retryCount + 1);
  }

  if (response.data && response.data.text) {
    return response.data.text;
  } else {
    throw new Error('No text found in response');
  }
};

export const openAiTranscribeAudio = async (
  getAudioFn: () => Promise<FormData>,
) => {
  const audio = await getAudioFn();

  const [err, text] = await useTryAsync(() => getAudioTranscription(audio));

  if (err) {
    throw err;
  }

  return text;
};
