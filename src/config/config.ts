import { ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';
import { ConfigUtils } from './config.utils';

const configObject = () => ({
  environment: process.env.NODE_ENV as 'local' | 'test' | 'production',
  name: ConfigUtils.getPackageName(),
  version: ConfigUtils.getVersion(),
  port: parseInt(process.env.PORT),
});

export type IConfig = ReturnType<typeof configObject>;

export const configModuleOptions: ConfigModuleOptions = {
  load: [configObject],
  isGlobal: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('local', 'test', 'production'),
    PORT: Joi.number().default(3000),
  }),
};
