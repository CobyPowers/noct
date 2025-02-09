import { HTTPMethod } from 'nocular';
import { RouteOptions } from '../types/route.ts';

export default class Route {
  path: string;
  bucketPath: string;
  method: HTTPMethod;
  reason?: string;
  resources?: Record<string, string>;
  params?: Record<string, string | number | undefined>;
  data?: any;

  constructor(options: RouteOptions) {
    const { path, method, reason, resources, params, data } = options;

    this.path = path;
    this.bucketPath = path;
    this.reason = reason;

    const bucketResources = [
      'channelID',
      'guildID',
      'webhookID',
      'webhookToken',
    ];

    if (resources) {
      for (const [k, v] of Object.entries(resources)) {
        if (bucketResources.includes(k)) 
          this.bucketPath = this.bucketPath.replace(`{${k}}`, v);

        this.path = this.path.replace(`{${k}}`, v);
      }
    }

    this.method = method;
    this.resources = resources;
    this.params = params;
    this.data = data;
  }

  getBucketID(): string {
    return this.method.toUpperCase() + this.bucketPath;
  }
}
