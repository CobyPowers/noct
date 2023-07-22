export enum LogLevel {
  SEVERE = 5,
  ERROR = 4,
  WARN = 3,
  INFO = 2,
  DEBUG = 1,
  NONE = 0
}

export interface LoggerOptions {
  prefix: string;
  padding?: number;
  logLevel?: LogLevel;
  logLocale?: string;
  useTimestamps?: boolean;
}