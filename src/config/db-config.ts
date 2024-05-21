import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '../common/providers/config.service';

export const dbModuleOptions: MongooseModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get('dbUrl'),
  }),
};
