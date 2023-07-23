import { color } from "../../deps.ts";
import { LoggerOptions, LogLevel } from "../types/logger.ts";

const IsLevel = (level: LogLevel) => {
  return (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const method = descriptor.value!;

    descriptor.value = function (...args: any[]) {
      const logger = this as Logger;

      if (level >= logger.options.logLevel!) {
        return method.apply(logger, args);
      }
    };
  };
};

export default class Logger {
  options: LoggerOptions;

  constructor(options: LoggerOptions) {
    this.options = {
      padding: options.padding || 12,
      logLevel: options.logLevel || LogLevel.INFO,
      logLocale: options.logLocale || "en-US",
      useTimestamps: options.useTimestamps || true,
      ...options,
    };
  }

  @IsLevel(LogLevel.INFO)
  moduleInfo(msg: string) {
    const timestampStr = this.options.useTimestamps
      ? `[${this.getTimestamp()}]`
      : "";
    const prefixStr = color.magenta(color.bold(this.options.prefix));
    const paddingStr = " ".repeat(10 - this.options.prefix.length);

    console.info(`${timestampStr} ${prefixStr}${paddingStr}${msg}`);
  }

  @IsLevel(LogLevel.INFO)
  sent(msg: string) {
    this.moduleInfo(color.blue(`↑ ${msg}`));
  }

  @IsLevel(LogLevel.INFO)
  received(msg: string) {
    this.moduleInfo(color.blue(`↓ ${msg}`));
  }

  @IsLevel(LogLevel.INFO)
  cycle(msg: string) {
    this.moduleInfo(color.blue(`⟳ ${msg}`));
  }

  @IsLevel(LogLevel.INFO)
  check(msg: string) {
    this.moduleInfo(color.blue(`✓ ${msg}`));
  }

  @IsLevel(LogLevel.INFO)
  cross(msg: string) {
    this.moduleInfo(color.blue(`× ${msg}`));
  }

  @IsLevel(LogLevel.SEVERE)
  severe(...data: any[]) {
    console.error(...data);
  }

  @IsLevel(LogLevel.ERROR)
  error(...data: any[]) {
    console.error(...data);
  }

  @IsLevel(LogLevel.WARN)
  warn(...data: any[]) {
    console.warn(...data);
  }

  @IsLevel(LogLevel.INFO)
  info(...data: any[]) {
    console.info(...data);
  }

  @IsLevel(LogLevel.DEBUG)
  debug(...msgs: any[]) {
    console.debug(...msgs);
  }

  withModule(name: string): Logger {
    return new Logger({ ...this.options, prefix: name });
  }

  getTimestamp(): string {
    return (new Date())
      .toLocaleString(this.options.logLocale)
      .replace(",", "");
  }
}
