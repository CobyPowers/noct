import { Nocular, color } from "../../deps.ts";
import { NoctURL, NoctVersion } from "../../mod.ts";
import { HTTPClientOptions, HTTPGetGatewayBotURL, HTTPGetGatewayURL, HTTPRateLimitError } from "../types/http.ts";
import Collection from "../util/Collection.ts";
import Lock from "../util/Lock.ts";
import Logger from "../util/Logger.ts";
import Bucket from "./Bucket.ts";
import Route from "./Route.ts";
import { delay } from "../util/misc.ts";
import { LogLevel } from "../types/logger.ts";
import Reactive from "../util/Reactive.ts";

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

  async request<T = any>(route: Route): Promise<T> {
    const bucketID = route.getBucketID();
    const bucket = this.#buckets.get(bucketID);

    if (this.#globalLock.value)
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

    if (res.status === 429) {
      const data = res.data as HTTPRateLimitError;

      if (data.global)
        this.#globalLock.update(true);

      await delay(data.retry_after * 1000);

      this.#globalLock.update(false);

      return await this.request<T>(route);
    }

    return res.data as T;
  }

  #processBucket(bucketID: string, bucket: Bucket | undefined, headers: Headers) {
    if (headers.has('X-RateLimit-Bucket')) {
      if (!bucket) {
        bucket = Bucket.fromHeaders(logger, bucketID, headers); 
      } else {
        const data = Bucket.parseHeaders(headers);
        bucket = bucket.update({ id: bucketID, ...data });
      }

      this.#buckets.set(bucketID, bucket);
    }
  }

  getGatewayURL(): Promise<HTTPGetGatewayURL> {
    return this.request(
      new Route({
        method: 'get',
        path: '/gateway'
      })
    )
  }

  getGatewayBotURL(): Promise<HTTPGetGatewayBotURL> {
    return this.request(
      new Route({
        method: 'get',
        path: '/gateway/bot'
      })
    )
  }
}

const logger = new Logger({ prefix: 'DEFAULT', logLevel: LogLevel.DEBUG });
const http = new HTTPClient(logger, { token: 'NzIzNjI3NDUyMzc4Nzc1NjIz.GfNvo6.FQiNLHotyg7ioyZXtTzt1vnkNhnPe6wXYvWcaE' });

const getGatewayBotURLs = async () => {
  for (let i = 0; i < 15; i++) {
    const data = await http.getGatewayBotURL();
  }
}

getGatewayBotURLs();