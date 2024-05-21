import { ConfigModuleOptions } from '@nestjs/config';
import { randomBytes } from 'crypto';
import Joi from 'joi';
import { ConfigUtils } from './config.utils';

const configObject = () => ({
  environment: process.env.NODE_ENV as 'local' | 'test' | 'production',
  name: ConfigUtils.getPackageName(),
  version: ConfigUtils.getVersion(),
  port: parseInt(process.env.PORT),
  dbUrl: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET,
});

export type IConfig = ReturnType<typeof configObject>;

export const configModuleOptions: ConfigModuleOptions = {
  load: [configObject],
  isGlobal: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('local', 'test', 'production'),
    PORT: Joi.number().default(3000),
    DB_URL: Joi.string().uri().default('mongodb://127.0.0.1:27017/db_name'),
    JWT_SECRET: Joi.string().default(generateRandomSecret()),
  }),
};

function generateRandomSecret() {
  return randomBytes(256).toString('base64');
}
