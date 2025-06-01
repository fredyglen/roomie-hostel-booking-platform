
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  userId?: string;
  sessionId?: string;
}

class EnhancedLogger {
  private isDevelopment = import.meta.env.MODE === 'development';
  private userId?: string;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createLogEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      userId: this.userId,
      sessionId: this.sessionId
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment && level === 'debug') return false;
    return true;
  }

  private formatMessage(entry: LogEntry): string {
    const prefix = `[${entry.timestamp}] ${entry.level.toUpperCase()}`;
    const userInfo = entry.userId ? ` [User: ${entry.userId}]` : '';
    const sessionInfo = ` [Session: ${entry.sessionId.slice(-6)}]`;
    return `${prefix}${userInfo}${sessionInfo}: ${entry.message}`;
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context);
    const formattedMessage = this.formatMessage(entry);

    if (context) {
      console[level](formattedMessage, context);
    } else {
      console[level](formattedMessage);
    }

    // In production, you could send logs to a service like LogRocket, Sentry, etc.
    if (!this.isDevelopment && (level === 'error' || level === 'warn')) {
      this.sendToLoggingService(entry);
    }
  }

  private sendToLoggingService(entry: LogEntry) {
    // Placeholder for external logging service integration
    // Example: Send to Sentry, LogRocket, or custom logging endpoint
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext | Error) {
    if (context instanceof Error) {
      this.log('error', message, {
        name: context.name,
        message: context.message,
        stack: context.stack
      });
    } else {
      this.log('error', message, context);
    }
  }

  // Specialized logging methods
  apiRequest(method: string, url: string, context?: LogContext) {
    this.debug(`API Request: ${method} ${url}`, context);
  }

  apiResponse(method: string, url: string, status: number, duration: number) {
    this.debug(`API Response: ${method} ${url} - ${status} (${duration}ms)`);
  }

  userAction(action: string, context?: LogContext) {
    this.info(`User Action: ${action}`, context);
  }

  performanceMetric(metric: string, value: number, unit: string = 'ms') {
    this.info(`Performance: ${metric} = ${value}${unit}`);
  }
}

export const logger = new EnhancedLogger();
