export type APIVersion = 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3;

export interface HTTPClientOptions {
  baseURL?: string;
  userAgent?: string;
  token: string;
}