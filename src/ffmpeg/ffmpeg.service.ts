import { Injectable } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

ffmpeg.setFfmpegPath(ffmpegPath);

@Injectable()
export class FfmpegService {
  async convertFile(inputPath: string, outputPath: string, inputFormat: string, outputFormat: string): Promise<string> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .inputFormat(inputFormat)
        .toFormat(outputFormat)
        .save(outputPath)
        .on('end', () => {
          console.log('Conversion completed successfully');
          resolve(outputPath);
        })
        .on('error', (error: unknown) => {
          console.error('Error during conversion', error);
          reject(error);
        });
    });
  }
}
