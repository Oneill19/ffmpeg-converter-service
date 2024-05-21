import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

// Modules
import { CommonModule } from './common/common.module';

// Config
import { configModuleOptions } from './config/config';
import { dbModuleOptions } from './config/db-config';

// Logger
import { expressLogger } from './logger/winston.config';

// Schemas
import { User, UserSchema } from './users/schemas/user.schema';

// Controllers
import { AuthController } from './auth/auth.controller';
import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';

// Services
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';

// Repositories
import { UsersRepository } from './users/users.repository';

@Module({
  imports: [
    CommonModule,
    HttpModule,
    ConfigModule.forRoot(configModuleOptions),
    MongooseModule.forRootAsync(dbModuleOptions),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController, AuthController, UsersController],
  providers: [AuthService, UsersService, UsersRepository],
})
export class AppModule implements NestModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(expressLogger).forRoutes('*');
  }
}
