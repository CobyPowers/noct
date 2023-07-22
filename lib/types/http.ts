import { GatewaySessionStartLimit } from "./gateway.ts";
import { LogLevel } from "./logger.ts";

export interface HTTPClientOptions {
  baseURL?: string;
  apiVersion?: number;
  userAgent?: string;
  token: string;
}

export interface HTTPRateLimitError {
  message: string;
  retry_after: number;
  global: boolean;
  code?: number;
}

export interface HTTPGeneralError {
  code: number,
  errors: HTTPGeneralErrorNest | HTTPGeneralErrorDetails;
  message: string;
}

export interface HTTPGeneralErrorNest {
  [key: string]: HTTPGeneralErrorNest | HTTPGeneralErrorDetails;
}

export interface HTTPGeneralErrorDetails {
  _errors: {
    code: string;
    message: string;
  }[]
}

// #region Gateway

export interface HTTPGetGatewayURL {
  url: string;
}

export interface HTTPGetGatewayBotURL {
  url: string;
  shards: number;
  session_start_limit: GatewaySessionStartLimit;
}

// #endregion Gateway