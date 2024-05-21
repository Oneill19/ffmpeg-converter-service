import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

// Modules
import { CommonModule } from './common/common.module';

// Config
import { configModuleOptions } from './config/config';

// Logger
import { expressLogger } from './logger/winston.config';

// Controllers
import { AppController } from './app.controller';
import { FfmpegController } from './ffmpeg/ffmpeg.controller';

// Services
import { FileService } from './file/file.service';
import { FfmpegService } from './ffmpeg/ffmpeg.service';

@Module({
  imports: [CommonModule, HttpModule, ConfigModule.forRoot(configModuleOptions)],
  controllers: [AppController, FfmpegController],
  providers: [FileService, FfmpegService],
})
export class AppModule implements NestModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(expressLogger).forRoutes('*');
  }
}
