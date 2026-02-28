type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, unknown>
}

class Logger {
  private formatLog(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context
    }
  }

  private print(entry: LogEntry) {
    const logFn = entry.level === 'error' ? console.error : 
                  entry.level === 'warn' ? console.warn : 
                  console.log

    logFn(`[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`, entry.context || '')
  }

  info(message: string, context?: Record<string, unknown>) {
    this.print(this.formatLog('info', message, context))
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.print(this.formatLog('warn', message, context))
  }

  error(message: string, context?: Record<string, unknown>) {
    this.print(this.formatLog('error', message, context))
    // Here you could also send the error to a tracking service like Sentry
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (import.meta.env.DEV) {
      this.print(this.formatLog('debug', message, context))
    }
  }
}

export const logger = new Logger()
