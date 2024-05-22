import { Controller, Post, UploadedFiles, UseInterceptors, Res, Body } from '@nestjs/common';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { ConvertFileDto } from './dtos/convert-file.dto';
import { FfmpegService } from './ffmpeg.service';
import { FileService } from '../file/file.service';
import { FileFormat } from '../file/enums/file-format.enum';

@ApiTags('FFmpeg')
@Controller('ffmpeg')
export class FfmpegController {
  constructor(
    private readonly ffmpegService: FfmpegService,
    private readonly fileService: FileService,
  ) {}

  @Post('single')
  @UseInterceptors(FilesInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        inputFormat: {
          type: 'string',
          enum: Object.values(FileFormat),
          description: 'Input format of the file',
        },
        outputFormat: {
          type: 'string',
          enum: Object.values(FileFormat),
          description: 'Desired output format of the file',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to be uploaded',
        },
      },
      required: ['inputFormat', 'outputFormat', 'file'],
    },
  })
  async convertSingleFile(
    @UploadedFiles() files: Express.Multer.File,
    @Body() converFileDto: ConvertFileDto,
    @Res() res: Response,
  ) {
    if (!files) {
      return res.status(400).send('No files uploaded');
    }

    const file = files[0];
    const inputPath = await this.fileService.saveBufferToFile(file.buffer, file.originalname);
    const outputPath = path.join(__dirname, '..', 'uploads', `${Date.now()}.${converFileDto.outputFormat}`);

    await this.ffmpegService.convertFile(
      inputPath as string,
      outputPath,
      converFileDto.inputFormat,
      converFileDto.outputFormat,
    );
    res.download(outputPath, () => {
      fs.unlinkSync(inputPath as string);
      fs.unlinkSync(outputPath);
    });
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        inputFormat: {
          type: 'string',
          enum: Object.values(FileFormat),
          description: 'Input format of the file',
        },
        outputFormat: {
          type: 'string',
          enum: Object.values(FileFormat),
          description: 'Desired output format of the file',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Files to be uploaded',
        },
      },
      required: ['inputFormat', 'outputFormat', 'files'],
    },
  })
  async convertMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() converFileDto: ConvertFileDto,
    @Res() res: Response,
  ) {
    if (!files) {
      return res.status(400).send('No files uploaded');
    }

    const convertedFiles = await Promise.all(
      files.map(async (file) => {
        const inputPath = await this.fileService.saveBufferToFile(file.buffer, file.originalname);
        const outputPath = path.join(
          __dirname,
          '..',
          'uploads',
          `${Date.now()}-${file.originalname}.${converFileDto.outputFormat}`,
        );
        await this.ffmpegService.convertFile(
          inputPath as string,
          outputPath,
          converFileDto.inputFormat,
          converFileDto.outputFormat,
        );
        return { inputPath, outputPath };
      }),
    );

    const zipPath = path.join(__dirname, '..', 'uploads', `${Date.now()}.zip`);
    const outputFiles = convertedFiles.map((file) => file.outputPath);
    await this.fileService.zipFiles(outputFiles, zipPath);

    res.download(zipPath, () => {
      fs.unlinkSync(zipPath);
      convertedFiles.forEach((file: { inputPath: string; outputPath: string }) => {
        fs.unlinkSync(file.inputPath);
        fs.unlinkSync(file.outputPath);
      });
    });
  }
}
