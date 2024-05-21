import { TransformableInfo } from 'logform';
import { format, LoggerOptions, transports } from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

const colorizer = format.colorize();

const printfFormat = (info: TransformableInfo) => {
  const { timestamp, level, message, stack, context } = info;
  let log = ` ${message}`;

  // also print the attached object if exist in the context
  if (typeof context === 'object') {
    log += '\n' + JSON.stringify(context);
  }

  // Add color to console
  if (!info.toColor) {
    log = `[${timestamp}] ${level}:` + log;
  } else {
    log = colorizer.colorize(level.toLowerCase(), `[${timestamp}] ${level}:` + log);
  }

  // Add stack if exist
  if (stack) {
    return `${log}\n${stack}`;
  }

  return log;
};

const transporters = {
  // Define console transport
  console: new transports.Console({
    format: format.combine(
      format((info) => {
        info.level = info.level.toUpperCase();
        info.toColor = true;
        return info;
      })(),
      // Add custom timestamp format
      format.timestamp({ format: 'HH:mm:ss' }),
      format.splat(),
      format.errors({ stack: true }),
      format.printf(printfFormat),
    ),
  }),

  // Define file transport
  combined: new transports.DailyRotateFile({
    filename: 'logs/%DATE%.log',
    datePattern: 'DD-MM-YYYY',
    auditFile: 'logs/audit.json',
    maxSize: '20m',
    maxFiles: '30d',
    format: format.combine(
      format((info) => {
        info.level = info.level.toUpperCase();
        info.toColor = false;
        return info;
      })(),
      format.timestamp({ format: 'HH:mm:ss' }),
      format.splat(),
      format.errors({ stack: true }),
      format.printf(printfFormat),
    ),
  }),

  error: new transports.DailyRotateFile({
    filename: 'logs/%DATE%-error.log',
    datePattern: 'DD-MM-YYYY',
    auditFile: 'logs/audit.json',
    maxSize: '20m',
    maxFiles: '30d',
    level: 'error',
    format: format.combine(
      format((info) => {
        info.level = info.level.toUpperCase();
        info.toColor = false;
        return info;
      })(),
      format.timestamp({ format: 'HH:mm:ss' }),
      format.splat(),
      format.errors({ stack: true }),
      format.printf(printfFormat),
    ),
  }),
};

export const winstonOptions: LoggerOptions = {
  transports: [transporters.combined, transporters.error, transporters.console],
};

export const expressLogger = expressWinston.logger({
  transports: [transporters.combined, transporters.error, transporters.console],
  format: format.combine(
    format((info) => {
      info.level = info.level.toUpperCase();
      info.toColor = false;
      return info;
    })(),
    format.timestamp({ format: 'HH:mm:ss' }),
    format.splat(),
    format.errors({ stack: true }),
    format.printf(printfFormat),
  ),
  meta: false,
  metaField: null,
  expressFormat: true,
  colorize: false,
});
