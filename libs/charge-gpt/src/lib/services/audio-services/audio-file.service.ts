import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { configService } from '@fronyx/configurations';
import { Injectable } from '@nestjs/common';
import { generateUUID } from '../../../../../../apps/cdk-apps/src/shared/models/general/generate-uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as Sentry from '@sentry/minimal';
import { AudioFile } from '../../models/prompt';
import { path as ffmepgPath } from '@ffmpeg-installer/ffmpeg';
import { path as ffProbePath } from '@ffprobe-installer/ffprobe';
import * as ffmpeg from 'fluent-ffmpeg';
import {
  chmodSync,
  copyFileSync,
  createWriteStream,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { ulid } from 'ulidx';
const ffprobeDestPath = '/tmp/ffprobe';
const ffmepgDestPath = '/tmp/ffmpeg';

// Copy the ffprobe executable to the /tmp directory
copyFileSync(ffProbePath, ffprobeDestPath);

copyFileSync(ffmepgPath, ffmepgDestPath);

// Set the permissions of the ffprobe executable to 777
chmodSync(ffprobeDestPath, '777');
chmodSync(ffmepgDestPath, '777');

ffmpeg.setFfprobePath(ffprobeDestPath);
ffmpeg.setFfmpegPath(ffmepgDestPath);

const s3Client = new S3Client(configService.getAwsConfigurations());

@Injectable()
export class AudioFileService {
  async generatePresignUrl(
    project,
    data: { conversationId: string }
  ): Promise<AudioFile> {
    try {
      const fileId = `${data.conversationId}-${generateUUID()}`;
      const command = new PutObjectCommand({
        Bucket: configService.getChargeGptS3Bucket(),
        Key: fileId,
      });

      const url = await getSignedUrl(s3Client, command, {
        expiresIn: 1800,
      });

      const response: AudioFile = { url, fileId };

      const apiVersion = project.response.find(
        ({ name }) => name === 'version'
      );
      if (apiVersion.value === 1) {
        response.versionNumber = configService.getApiVersion();
      }

      return response;
    } catch (e) {
      Sentry.captureException(e);
      throw e;
    }
  }
}

export const getAudioFile = async (filename: string): Promise<any> => {
  const command = new GetObjectCommand({
    Bucket: configService.getChargeGptS3Bucket(),
    Key: filename,
    Range: 'bytes=0-20971520',
  });

  return s3Client.send(command);
};

export const oggToWav = async (data: any): Promise<any> => {
  const fileId = ulid();
  const inputPath = `/tmp/${fileId}.ogg`;
  const outputPath = `/tmp/${fileId}.wav`;
  const outStream = createWriteStream(outputPath);

  writeFileSync(inputPath, data);

  await new Promise<void>((resolve) => {
    ffmpeg(inputPath)
      .audioQuality(96)
      .toFormat('wav')
      .on('end', () => {
        resolve();
      })
      .pipe(outStream, { end: true });
  });

  const wavData = readFileSync(outputPath);
  unlinkSync(inputPath);
  unlinkSync(outputPath);
  return wavData;
};

export const initializeAudioFileLocally = async (fileId, audioFormat) => {
  const filePath = `/tmp/${fileId}.${audioFormat}`;
  const audioFile = await getAudioFile(fileId);
  writeFileSync(
    filePath,
    Buffer.from(await audioFile.Body.transformToByteArray())
  );
  chmodSync(filePath, 0o777);
  return filePath;
};

export const clearLocalAudioFile = (filePath) => {
  unlinkSync(filePath);
};
