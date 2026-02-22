/**
 * Logger Utility
 * Structured logging for development and production
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ||
  (process.env.NODE_ENV === "production" ? "info" : "debug");

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatOutput(entry: LogEntry): string {
  if (process.env.NODE_ENV === "production") {
    return JSON.stringify(entry);
  }
  
  // Development: pretty print
  const colors = {
    debug: "\x1b[36m", // cyan
    info: "\x1b[32m", // green
    warn: "\x1b[33m", // yellow
    error: "\x1b[31m", // red
  };
  const reset = "\x1b[0m";
  
  const levelStr = `${colors[entry.level]}[${entry.level.toUpperCase()}]${reset}`;
  const timeStr = `\x1b[90m${entry.timestamp}\x1b[0m`;
  
  let output = `${timeStr} ${levelStr} ${entry.message}`;
  
  if (entry.context) {
    output += `\n  Context: ${JSON.stringify(entry.context, null, 2)}`;
  }
  
  if (entry.error) {
    output += `\n  Error: ${entry.error.name}: ${entry.error.message}`;
    if (entry.error.stack) {
      output += `\n  Stack: ${entry.error.stack}`;
    }
  }
  
  return output;
}

function createLogEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  error?: Error
): LogEntry {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
  };

  if (context) {
    entry.context = context;
  }

  if (error) {
    entry.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return entry;
}

function log(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  error?: Error
): void {
  if (!shouldLog(level)) return;

  const entry = createLogEntry(level, message, context, error);
  const output = formatOutput(entry);

  if (level === "error") {
    console.error(output);
  } else if (level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) =>
    log("debug", message, context),
    
  info: (message: string, context?: Record<string, unknown>) =>
    log("info", message, context),
    
  warn: (message: string, context?: Record<string, unknown>) =>
    log("warn", message, context),
    
  error: (message: string, error?: Error, context?: Record<string, unknown>) =>
    log("error", message, context, error),
};

// Audit log helper
export function auditLog(
  action: string,
  resource: string,
  details: {
    userId?: string;
    resourceId?: string;
    ipAddress?: string;
    userAgent?: string;
    status?: "success" | "failure";
    [key: string]: unknown;
  }
) {
  logger.info(`[AUDIT] ${action}`, {
    resource,
    ...details,
  });
}
