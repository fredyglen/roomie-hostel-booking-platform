
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private isDevelopment: boolean;
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 100;

  constructor() {
    // Handle both Vite and Node.js environments
    this.isDevelopment = (
      (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'development') ||
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV !== 'production'
    );
  }

  private createLogEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
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

  private log(level: LogLevel, message: string, data?: unknown) {
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

  debug(message: string, data?: unknown) {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown) {
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
