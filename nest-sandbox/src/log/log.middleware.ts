import { Injectable, NestMiddleware } from "@nestjs/common";
import pino, { Logger } from 'pino';

export class AppLogger {
  private static readonly logger: Logger = pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        singleLine: true,
      },
    },
  });

  static info(msg: string, ...args: any[]) {
    this.logger.info(msg, ...args);
  }

  static error(msg: string, ...args: any[]) {
    this.logger.error(msg, ...args);
  }

  static warn(msg: string, ...args: any[]) {
    this.logger.warn(msg, ...args);
  }

  static debug(msg: string, ...args: any[]) {
    this.logger.debug(msg, ...args);
  }

  static get raw(): Logger {
    return this.logger;
  }
}

@Injectable()
export class RequestLoggingMidleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: Error | any) => void): void {
    AppLogger.info(`method: ${req.method}`);
    next();
  }
}

@Injectable()
export class ResponseLoggingMidleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: Error | any) => void): void {
    res.on('finish', () => {
      AppLogger.info(`response ok.`);
    });
    next();
  }
}
