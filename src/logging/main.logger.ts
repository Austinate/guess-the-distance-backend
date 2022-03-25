import { ExecutionContext, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

export class MainLogger implements LoggerService {
  private readonly logger: winston.Logger;

  private static createLogger(): winston.Logger {
    const format = winston.format;

    return winston.createLogger({
      level: 'debug',
      format: format.combine(
        format.colorize({
          all: true,
        }),
        format.label({
          label: '[Nest]',
        }),
        format.timestamp({
          format: 'YYYY/MM/DD HH:MM:SS',
        }),
        format.printf(
          (info) =>
            `${info.label} ${info.timestamp} [${info.level}]: ${info.message}`,
        ),
      ),
      transports: [new winston.transports.Console()],
    });
  }

  constructor(logger: winston.Logger = MainLogger.createLogger()) {
    this.logger = logger;
  }

  log(message: any) {
    this.logger.log({
      level: 'info',
      message: message,
    });
  }

  error(message: any) {
    this.logger.log({
      level: 'error',
      message: message,
    });
  }

  warn(message: any) {
    this.logger.log({
      level: 'warn',
      message: message,
    });
  }

  debug?(message: any) {
    this.logger.log({
      level: 'debug',
      message: message,
    });
  }

  verbose?(message: any) {
    this.logger.log({
      level: 'verbose',
      message: message,
    });
  }

  private methodDescription(context: ExecutionContext): string {
    const req = context.switchToHttp().getRequest<Request>();
    const handler = context.getHandler();

    // resulting string example: `[UserController]  GET /users/4618cfbc-d6b2-40d6-b948-9c6cc6055637, handler name: findOne`
    return `[${context.getClass().name}]  ${req.method} ${
      req.url
    } handler name: ${handler.name}`;
  }

  logMethodInvoke(context: ExecutionContext) {
    this.debug(this.methodDescription(context));
  }

  logUnhandledError(context: ExecutionContext, error: Error) {
    this.error(this.methodDescription(context) + ', ' + error);
  }
}
