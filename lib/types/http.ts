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

export interface HTTPBadRequestError {
  code: number;
  errors?: HTTPBadRequestErrorNest | HTTPBadRequestErrorDetails;
  message: string;
}

export interface HTTPBadRequestErrorNest {
  [key: string]: HTTPBadRequestErrorNest | HTTPBadRequestErrorDetails;
}

export interface HTTPBadRequestErrorDetails {
  _errors: {
    code: string;
    message: string;
  }[];
}