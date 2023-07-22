import { HTTPMethod } from "../../deps.ts";
import { RouteOptions } from "../types/route.ts";

export default class Route {
  path: string;
  method: HTTPMethod;
  resources?: Record<string, string>;
  params?: Record<string, string | number | undefined>;
  data?: any;

  constructor(options: RouteOptions) {
    const { path, method, resources, params, data } = options;

    this.path = path;
    if (resources) {
      for (const [k, v] of Object.entries(resources)) {
        this.path = this.path.replace(`{${k}}`, v);
      }
    }

    this.method = method;
    this.resources = resources;
    this.params = params;
    this.data = data;
  }

  getBucketID(): string {
    return this.method.toUpperCase() + this.path;
  }
}