import { HTTPMethod, Nocular, color } from "../../deps.ts";
import { NoctURL, NoctVersion } from "../../mod.ts";
import { HTTPClientOptions, HTTPBadRequestError as IHTTPBadRequestError, HTTPGetGatewayConnectionInfoOptions, HTTPRateLimitError, HTTPRequestOptions, HTTPGetUserOptions } from "../types/http.ts";
import Collection from "../util/Collection.ts";
import Lock from "../util/Lock.ts";
import Logger from "../util/Logger.ts";
import Bucket from "./Bucket.ts";
import Route from "./Route.ts";
import { delay, querify } from "../util/misc.ts";
import Reactive from "../util/Reactive.ts";
import { GatewayConnectionInfo } from "../types/gateway.ts";
import { GatewayBotConnectionInfo } from "../types/gateway.ts";
import HTTPBadRequestError from "../errors/HTTPBadRequestError.ts";
import HTTPError from "../errors/HTTPError.ts";
import { User } from "../types/user.ts";

export default class HTTPClient {
  #engine: Nocular;
  #logger: Logger;
  #buckets: Collection<string, Bucket>;
  #lock: Lock;

  #globalLock: Reactive<boolean>;

  baseURL: string;
  apiVersion: number;
  userAgent: string;
  token: string;
  
  constructor(logger: Logger, options: HTTPClientOptions) {
    this.baseURL = options.baseURL || "https://discord.com/api";
    this.apiVersion = options.apiVersion || 10;
    this.userAgent = options.userAgent || `Noct (${NoctURL}, ${NoctVersion})`;
    this.token = options.token;

    this.#globalLock = new Reactive(false);

    this.#engine = new Nocular({
      baseURL: this.baseURL + `/v${this.apiVersion}`
    });
    this.#engine.defaultHeaders.common = {
      'Authorization': `Bot ${this.token}`,
      'User-Agent': this.userAgent
    }

    this.#logger = logger.withModule("HTTP");
    this.#buckets = new Collection();
    this.#lock = new Lock();
  }

  async request<T = any>(route: Route, options?: HTTPRequestOptions): Promise<T> {
    const bucketID = route.getBucketID();
    const bucket = this.#buckets.get(bucketID);

    if (!options?.ignoreGlobalLock && this.#globalLock.value)
      await this.#globalLock.waitUntil(false);

    bucket
      ? await bucket.lock.acquire() 
      : await this.#lock.acquire();

    bucket && await bucket.prepare();

    const res = await this.#engine.request(route.path, {
      ...route,
      redirect: "follow",
      keepalive: true,
      validateStatus: () => true
    });

    this.#logger.moduleInfo(color.blue(`(${res.status}) ${route.method.toUpperCase()} ${route.path}`))

    this.#processBucket(bucketID, bucket, res.headers);

    bucket
      ? bucket.lock.release()
      : this.#lock.release()

    if (res.status === 400) {
      const data = res.data as IHTTPBadRequestError;

      throw new HTTPBadRequestError(data);
    }

    if (res.status === 401) {
      throw new HTTPError("You provided an invalid token.");
    }

    if (res.status === 403) {
      throw new HTTPError("You cannot access this resource.");
    }

    if (res.status === 404) {
      throw new HTTPError("This resource does not exist.");
    }

    if (res.status === 405) {
      throw new HTTPError(`Method '${route.method}' cannot be used with path '${route.path}'`)
    }

    if (res.status === 429) {
      const data = res.data as HTTPRateLimitError;

      if (data.global)
        this.#globalLock.update(true);

      await delay(data.retry_after * 1000);

      this.#globalLock.update(false);

      return await this.request<T>(route);
    }

    if (res.status === 500 || res.status == 502) {
      const tries = (options?.tries || 0) + 1;
      const delayMS = (Math.pow(2, tries)) * 1000; // exponential backoff algorithm

      this.#logger.debug(`HTTP request encountered a 5xx error, waiting ${delayMS}ms...`)

      await delay(delayMS);
      return await this.request<T>(route, { tries });
    }

    return res.data as T;
  }

  #processBucket(bucketID: string, bucket: Bucket | undefined, headers: Headers): void {
    if (headers.has('X-RateLimit-Bucket')) {
      bucket = bucket
        ? bucket!.update(headers)
        : Bucket.fromHeaders(this.#logger, bucketID, headers);

      this.#buckets.set(bucketID, bucket);
    }
  }

  #transformGatewayInfo<T extends GatewayConnectionInfo>(info: T, options?: HTTPGetGatewayConnectionInfoOptions): T {
    const params: Record<string, string | number | undefined> = {};

    if (options) {
      for (const [k, v] of Object.entries(options)) {
        params[k] = v;
      }
    }

    const query = querify(params);

    info.url += '?' + query;

    return info;
  }

  async getGatewayInfo(options?: HTTPGetGatewayConnectionInfoOptions): Promise<GatewayConnectionInfo> {
    const info = await this.request(
      new Route({
        method: HTTPMethod.GET,
        path: '/gateway'
      })
    )

    return this.#transformGatewayInfo(info, options);
  }

  async getGatewayBotInfo(options?: HTTPGetGatewayConnectionInfoOptions): Promise<GatewayBotConnectionInfo> {
    const info = await this.request(
      new Route({
        method: HTTPMethod.GET,
        path: '/gateway/bot'
      })
    )

    return this.#transformGatewayInfo(info, options);
  }

  getUser(options: HTTPGetUserOptions): Promise<User> {
    return this.request(new Route({
      method: HTTPMethod.GET,
      path: '/users/{userID}',
      resources: {
        ...options
      }
    }))
  }
}