import { chmodSync, copyFileSync } from 'fs';
import { path as ffmepgPath } from '@ffmpeg-installer/ffmpeg';
import { path as ffProbePath } from '@ffprobe-installer/ffprobe';
import * as ffmpeg from 'fluent-ffmpeg';

export const ffprobeDestPath = '/tmp/ffprobe';
const ffmepgDestPath = '/tmp/ffmpeg';

export const initRelatedAudioLib = () => {
  // Copy the ffprobe executable to the /tmp directory
  copyFileSync(ffProbePath, ffprobeDestPath);

  copyFileSync(ffmepgPath, ffmepgDestPath);

  // Set the permissions of the ffprobe executable to 777
  chmodSync(ffprobeDestPath, '777');
  chmodSync(ffmepgDestPath, '777');

  ffmpeg.setFfprobePath(ffprobeDestPath);
  ffmpeg.setFfmpegPath(ffmepgDestPath);
};
