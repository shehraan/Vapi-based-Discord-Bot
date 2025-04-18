/**
 * Simple logging utility to help with debugging
 */

// Log levels
enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

// Default log level (can be overridden with environment variable)
const currentLogLevel = process.env.LOG_LEVEL ? 
  (LogLevel[process.env.LOG_LEVEL as keyof typeof LogLevel] ?? LogLevel.INFO) : 
  LogLevel.INFO;

// Timestamp for logs
const timestamp = () => new Date().toISOString();

/**
 * Logger class for consistent log formatting
 */
class Logger {
  static error(message: string, ...args: any[]) {
    if (currentLogLevel >= LogLevel.ERROR) {
      console.error(`[${timestamp()}] [ERROR] ${message}`, ...args);
    }
  }

  static warn(message: string, ...args: any[]) {
    if (currentLogLevel >= LogLevel.WARN) {
      console.warn(`[${timestamp()}] [WARN] ${message}`, ...args);
    }
  }

  static info(message: string, ...args: any[]) {
    if (currentLogLevel >= LogLevel.INFO) {
      console.log(`[${timestamp()}] [INFO] ${message}`, ...args);
    }
  }

  static debug(message: string, ...args: any[]) {
    if (currentLogLevel >= LogLevel.DEBUG) {
      console.log(`[${timestamp()}] [DEBUG] ${message}`, ...args);
    }
  }

  static command(name: string, userId: string, status: 'start' | 'complete' | 'error') {
    const statusText = status === 'start' ? 'Starting' : status === 'complete' ? 'Completed' : 'Error in';
    this.info(`${statusText} command '${name}' for user ${userId}`);
  }
}

export default Logger;