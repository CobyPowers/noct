import { HTTPBadRequestError as IHTTPBadRequestError, HTTPBadRequestErrorDetails, HTTPBadRequestErrorNest } from "../types/http.ts";

export default class HTTPBadRequestError extends Error {
  data: IHTTPBadRequestError;
  override name: string;
  code: number;
  shortMessage: string;
  
  constructor(data: IHTTPBadRequestError) {
    super();

    this.data = data;
    this.name = 'HTTPBadRequestError';
    this.code = data.code;
    this.shortMessage = data.message;

    this.#parseData(data);
  }

  #parseData(data: IHTTPBadRequestError): void {
    let buffer = `[${data.code}] ${data.message}`;

    if (data.errors)
      buffer += '\n' + this.#parseNest(data.errors);

    this.message = buffer;
  }

  #parseNest(data: HTTPBadRequestErrorNest | HTTPBadRequestErrorDetails, prefix: string = ''): string {
    let buffer = '';

    if ('_errors' in data) {
      if (prefix)
        prefix += ' '

      buffer += '  ';
      buffer += prefix;
      buffer += this.#parseDetails(<HTTPBadRequestErrorDetails>data, prefix.length + 2);

      return buffer;
    }

    if (prefix)
      prefix += '.';

    for (const [k, v] of Object.entries(data)) {
      buffer += this.#parseNest(v, prefix + k);
    }

    return buffer;
  }

  #parseDetails(data: HTTPBadRequestErrorDetails, padding: number = 0): string {
    let buffer = '';

    for (let i = 0; i < data._errors.length; i++) {
      const err = data._errors[i];

      if (i > 0) {
        buffer += ' '.repeat(padding);
      }

      buffer += `-> ${err.message}\n`;
    }

    return buffer;
  }
}