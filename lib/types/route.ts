import { HTTPMethod } from 'nocular';

export interface RouteOptions {
  path: string;
  method: HTTPMethod;
  reason?: string;
  resources?: Record<string, string>;
  params?: Record<string, string | number | undefined>;
  data?: any;
}
