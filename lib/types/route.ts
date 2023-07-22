import { HTTPMethod } from "../../deps.ts";

export interface RouteOptions {
  path: string;
  method: HTTPMethod;
  resources?: Record<string, string>;
  params?: Record<string, string | number | undefined>;
  data?: any;
}