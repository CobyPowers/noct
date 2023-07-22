import { BucketInfo, BucketOptions } from "../types/bucket.ts";
import Lock from "../util/Lock.ts";
import Logger from "../util/Logger.ts";

export default class Bucket {
  #logger: Logger;
  lock: Lock;
  
  id: string;
  limit: number;
  remaining: number;
  resetEpoch: number;
  resetMS: number;
  
  constructor(logger: Logger, id: string, options: BucketOptions) {
    this.#logger = logger.withModule('BUCKET');
    this.lock = new Lock();

    const { limit, remaining, resetEpoch, resetSec } = options;

    this.id = id;
    this.limit = limit;
    this.remaining = remaining;
    this.resetEpoch = resetEpoch * 1000;
    this.resetMS = resetSec * 1000;
  }

  static parseHeaders(headers: Headers): BucketInfo {
    const limit = parseInt(headers.get('X-RateLimit-Limit')!);
    const remaining = parseInt(headers.get('X-RateLimit-Remaining')!);
    const resetEpoch = parseFloat(headers.get('X-RateLimit-Reset')!);
    const resetSec = parseFloat(headers.get('X-RateLimit-Reset-After')!);

    return { limit, remaining, resetEpoch, resetSec };
  }

  static fromHeaders(logger: Logger, id: string, headers: Headers): Bucket {
    const data = this.parseHeaders(headers);
    
    return new Bucket(logger, id, data);
  }

  update(headers: Headers): Bucket {
    const data = Bucket.parseHeaders(headers);
    const { limit, remaining, resetEpoch, resetSec } = data;
    
    this.limit = limit;
    this.remaining = remaining;
    this.resetEpoch = resetEpoch * 1000;
    this.resetMS = resetSec * 1000;

    return this;
  }

  prepare(): Promise<void> {
    return new Promise((res, rej) => {
      if (!this.usable()) {
        this.#logger.debug(`Bucket '${this.id}' has exhausted rate limit, waiting ${this.resetMS}ms....`);
        setTimeout(() => res(), this.resetMS);
      } else res();
    })
  }

  usable(): boolean {
    return this.remaining > 0 ? true : false;
  }
}