import * as audioSdk from 'microsoft-cognitiveservices-speech-sdk';
import { BlobServiceClient } from '@azure/storage-blob';
import { ulid } from 'ulidx';
import { unlinkSync } from 'fs';
import { configService } from '@fronyx/configurations';

export const textToSpeech = async (
  text: string,
  language: SupportedLanguage
): Promise<string> => {
  const fileName = `audio-${Date.now()}-${ulid()}.wav`;
  await synthesizeTextToSpeech(text, fileName, language);
  return `https://publicassets.example.blob.core.windows.net/chargegpt-tts-audio/${fileName}`;
};

export const uploadAudioToAzure = async (
  audio: ArrayBuffer,
  byteLength: number,
  fileName: string,
  filePath: string
) => {
  const blockService = BlobServiceClient.fromConnectionString(
    configService.getBlobStorageConnectionString()
  );
  const containerClient = blockService.getContainerClient(
    'chargegpt-tts-audio'
  );
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  const config = { blobHTTPHeaders: { blobContentType: 'audio/x-wav' } };
  await blockBlobClient.upload(audio, byteLength, config);
  unlinkSync(filePath);
};

export const synthesizeTextToSpeech = async (
  text: string,
  fileName: string,
  language: SupportedLanguage
) => {
  await new Promise<void>((resolve, reject) => {
    const speechConfig = audioSdk.SpeechConfig.fromSubscription(
      configService.getAzureTTSToken(),
      'westeurope'
    );
    const filePath = `/tmp/${fileName}`;
    const audioConfig = audioSdk.AudioConfig.fromAudioFileOutput(filePath);

    const { languageCode, voiceName } = getSpeechToTextConfig(language);

    speechConfig.speechSynthesisVoiceName = voiceName;
    speechConfig.speechSynthesisLanguage = languageCode;
    let synthesizer = new audioSdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(
      text,
      async (res) => {
        synthesizer.close();
        synthesizer = null;

        await uploadAudioToAzure(
          res.audioData,
          res.audioData.byteLength,
          fileName,
          filePath
        );

        resolve();
      },
      () => {
        reject('Error synthesizing audio.');
      }
    );
  });
};

export type SupportedLanguage = 'de' | 'es' | 'fr' | 'pt' | 'cz' | 'en';

export interface SpeechToTextConfig {
  languageCode: string;
  voiceName: string;
}

export const getSpeechToTextConfig = (
  lang: SupportedLanguage
): SpeechToTextConfig => {
  switch (lang) {
    case 'de': {
      return { languageCode: 'de-DE', voiceName: 'de-DE-KatjaNeural' };
    }
    case 'es': {
      return { languageCode: 'es-ES', voiceName: 'es-ES-AlvaroNeural' };
    }
    case 'fr': {
      return { languageCode: 'fr-FR', voiceName: 'fr-FR-ClaudeNeural ' };
    }
    case 'pt': {
      return { languageCode: 'pt-PT', voiceName: 'pt-PT-FernandaNeural' };
    }
    case 'cz': {
      return { languageCode: 'cs-CZ', voiceName: 'cs-CZ-VlastaNeural' };
    }
    case 'en': {
      return { languageCode: 'en-GB', voiceName: 'en-GB-RyanNeural' };
    }
    default:
      throw new Error('Language not supported for speech synthesis.');
  }
};

