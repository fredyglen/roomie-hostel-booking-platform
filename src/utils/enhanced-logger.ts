
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: Record<string, unknown> | string | number | boolean | null;
}

class Logger {
  private isDevelopment: boolean;
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 100;

  constructor() {
    this.isDevelopment = import.meta.env.MODE === 'development';
  }

  private createLogEntry(level: LogLevel, message: string, data?: Record<string, unknown> | string | number | boolean | null): LogEntry {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };

    // Add to history, maintaining max size
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }

    return entry;
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown> | string | number | boolean | null) {
    const entry = this.createLogEntry(level, message, data);
    
    if (this.isDevelopment) {
      const consoleMethod = level === 'debug' ? 'log' : level;
      if (data) {
        console[consoleMethod](`[${level.toUpperCase()}] ${message}`, data);
      } else {
        console[consoleMethod](`[${level.toUpperCase()}] ${message}`);
      }
    }

    // In production, you might want to send logs to a service
    if (!this.isDevelopment && level === 'error') {
      // Send to error tracking service
      // Example: sendToErrorService(entry);
    }
  }

  debug(message: string, data?: Record<string, unknown> | string | number | boolean | null) {
    this.log('debug', message, data);
  }

  info(message: string, data?: Record<string, unknown> | string | number | boolean | null) {
    this.log('info', message, data);
  }

  warn(message: string, data?: Record<string, unknown> | string | number | boolean | null) {
    this.log('warn', message, data);
  }

  error(message: string, data?: Record<string, unknown> | string | number | boolean | null) {
    this.log('error', message, data);
  }

  getHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  clearHistory() {
    this.logHistory = [];
  }
}

export const logger = new Logger();
