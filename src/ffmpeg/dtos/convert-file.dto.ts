import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { FileFormat } from '../../file/enums/file-format.enum';

export class ConvertFileDto {
  @ApiProperty({
    description: 'Input format of the file',
    enum: FileFormat,
  })
  @IsEnum(FileFormat)
  inputFormat: string;

  @ApiProperty({
    description: 'Desired output format of the file',
    enum: FileFormat,
  })
  @IsEnum(FileFormat)
  outputFormat: string;
}
