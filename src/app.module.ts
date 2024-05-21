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

@Module({
  imports: [CommonModule, HttpModule, ConfigModule.forRoot(configModuleOptions)],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(expressLogger).forRoutes('*');
  }
}
