import { GatewaySessionStartLimit } from "./gateway.ts";
import { Snowflake } from "./global.ts";
import { LogLevel } from "./logger.ts";

export interface HTTPClientOptions {
  baseURL?: string;
  apiVersion?: number;
  userAgent?: string;
  token: string;
}

export interface HTTPRequestOptions {
  ignoreGlobalLock?: boolean;
  tries?: number;
}

export interface HTTPRateLimitError {
  message: string;
  retry_after: number;
  global: boolean;
  code?: number;
}

export interface HTTPBadRequestError {
  code: number,
  errors: HTTPBadRequestErrorNest | HTTPBadRequestErrorDetails;
  message: string;
}

export interface HTTPBadRequestErrorNest {
  [key: string]: HTTPBadRequestErrorNest | HTTPBadRequestErrorDetails;
}

export interface HTTPBadRequestErrorDetails {
  _errors: {
    code: string;
    message: string;
  }[]
}

// #region Gateway

export interface HTTPGetGatewayConnectionInfoOptions {
  v?: number;
  encoding?: string;
  compress?: string;
}

// #endregion Gateway

// #region User

export interface HTTPGetUserOptions {
  userID: Snowflake;
}

// #endregion User