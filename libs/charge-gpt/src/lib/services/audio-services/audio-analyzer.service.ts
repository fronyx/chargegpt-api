import * as ffmpeg from 'fluent-ffmpeg';
import {
  ffprobeDestPath,
  initRelatedAudioLib,
} from './initialize-ffmpeg.service';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import {
  ChargeGPTInvalidRequestParameterError,
  UnsupportedAudioFormatError,
} from '../../../../../../apps/cdk-apps/src/shared';

export const getMeanVolume = async (filePath): Promise<number> => {
  initRelatedAudioLib();

  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .audioFilters('volumedetect')
      .addOption('-f', 'null')
      .addOption('-t', '10')
      .noVideo()
      .on('error', (err) => {
        reject(err);
      })
      .on('end', (stdout, stderr) => {
        const results = stderr.split('\n');
        const meanVolumeString = results.find((result) =>
          result.includes('mean_volume')
        );

        if (!meanVolumeString) {
          return reject(new Error('Unprocessable audio file'));
        }

        const meanVolume = parseFloat(meanVolumeString.split(':')[1]);

        return resolve(meanVolume);
      })
      .saveToFile('/dev/null');
  });
};

export const getAudioDuration = async (filePath): Promise<number> => {
  return getAudioDurationInSeconds(filePath, ffprobeDestPath);
};

export const validateAudioContent = async (filePath): Promise<void> => {
  try {
    const duration = await getAudioDuration(filePath);
    const VOLUME_THRESHOLD = -37; // volume threshold in dB

    const meanVolume = await getMeanVolume(filePath);
    const isVolumeTooLow = meanVolume <= VOLUME_THRESHOLD;

    if (isVolumeTooLow) {
      throw new UnsupportedAudioFormatError(
        `Unsupported media: volume too low. Submitted volume: ${meanVolume} dB. Accepted volume: >${VOLUME_THRESHOLD} dB.`
      );
    }

    if (duration > 60) {
      throw new ChargeGPTInvalidRequestParameterError(
        `Unsupported media length. Submitted value: ${duration}s. Accepted value: <60s.`
      );
    }
  } catch (error) {
    if (
      error instanceof UnsupportedAudioFormatError ||
      error instanceof ChargeGPTInvalidRequestParameterError
    ) {
      throw error;
    } else {
      throw new UnsupportedAudioFormatError(
        'Unsupported media: Audio too big. Accepted maximum file size 20MB.'
      );
    }
  }
};
