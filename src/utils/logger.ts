import { ErrorHandler } from './ErrorHandler';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';

  private log(level: LogLevel, message: string, context?: LogContext | string) {
    if (!this.isDevelopment && level === 'debug') return;

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (context) {
      if (typeof context === 'string') {
        console[level](`${logMessage} - ${context}`);
      } else {
        console[level](logMessage, context);
      }
    } else {
      console[level](logMessage);
    }
  }

  debug(message: string, context?: LogContext | string) {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext | string) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext | string) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext | string) {
    this.log('error', message, context);
  }
}

export const logger = new Logger();
