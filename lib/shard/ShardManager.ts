import { EventEmitter } from 'event';
import DiscordClient from '../client/DiscordClient.ts';
import ShardManagerError from '../errors/ShardManagerError.ts';
import HTTPClient from '../http/HTTPClient.ts';
import {
  GatewayBotConnectionInfo,
  GatewayEncoding,
} from '../types/gateway.ts';
import { ShardingMethod, ShardManagerEventMap, ShardManagerOptions } from '../types/shardManager.ts';
import Logger from '../util/Logger.ts';
import { delay } from '../util/misc.ts';
import Shard from './Shard.ts';

export default class ShardManager extends EventEmitter<ShardManagerEventMap> {
  #client: DiscordClient;
  #http: HTTPClient;
  #logger: Logger;

  #shards: Map<number, Shard>;

  options: ShardManagerOptions;
  
  constructor(client: DiscordClient, options: ShardManagerOptions) {
    super();

    this.options = {
      shardingMethod: options.shardingMethod || ShardingMethod.AUTO,
      encoding: options.encoding || GatewayEncoding.JSON,
      gatewayVersion: 10,
      ...options,
    };

    if (
      this.options.shardingMethod === ShardingMethod.MANUAL &&
      !this.options.shardCount
    ) {
      throw new ShardManagerError(
        'If you are sharding manually, you must provide a shard count.',
      );
    }

    this.#client = client;
    this.#http = client.http;
    this.#logger = client.logger.withModule('SHARDER');

    this.#shards = new Map();

    Deno.addSignalListener('SIGINT', () => {
      this.stop(1000);
    });
  }

  async start() {
    const connInfo = await this.#http.getGatewayBotInfo();

    await this.#startShards(connInfo);

    this.emit("start");
  }

  async #startShards(connInfo: GatewayBotConnectionInfo) {
    let shardCount = this.options.shardingMethod === ShardingMethod.AUTO
      ? connInfo.shards
      : this.options.shardCount!;

    const sessionLimits = connInfo.session_start_limit;

    const remaining = sessionLimits.total;
    const maxConcurrency = sessionLimits.max_concurrency;

    const { token, intents, largeThreshold, compress, presence } = this.options;

    this.#logger.moduleInfo(`Initializing ${shardCount} Shard(s)...`);

    /* Shard Initialization */
    for (let i = 0; i < shardCount; i++) {
      const shard = new Shard(this, this.#logger, {
        token,
        intents,
        largeThreshold,
        compress,
        presence,
        gatewayURL: connInfo.url,
        shardInfo: {
          shardNum: i,
          numShards: shardCount,
        },
      });

      this.#shards.set(i, shard);

      if (i >= remaining - 1) {
        this.#logger.moduleInfo(
          'Daily allotted shard count exceeded, halting...',
        );

        shardCount = this.#shards.size;

        break;
      }
    }

    this.#logger.moduleInfo(`Starting ${shardCount} Shards(s)...`);

    /* Shard Starting */
    let shardQueue: Shard[] = [];
    for (let i = 0; i < shardCount; i++) {
      const waitForReady = (shards: Shard[]) => {
        return shards.map((shard) => {
          return new Promise<void>((res, rej) => {
            shard.once('ready', () => res());
          });
        });
      };

      const shard = this.#shards.get(i)!;
      shard.start();

      if (i == shardCount - 1)
        shard.once("ready", (data) => this.emit("ready", data));

      shardQueue.push(shard);

      if (i % maxConcurrency === 0 && i != shardCount - 1) {
        this.#logger.moduleInfo(
          'Max concurrency reached, waiting for previous bucket...',
        );

        await Promise.all(waitForReady(shardQueue));
        await delay(3000);

        shardQueue = [];
      }
    }
    this.#logger.moduleInfo(`${shardCount} Shards Started`);
  }

  stop(code?: number) {
    this.#shards.forEach((shard) => shard.stop(code));

    this.emit("stop");
  }

  get latency() {
    return this.#shards.values()
    .map(shard => shard.latency)
    .reduce((total, latency) => total += latency) / this.#shards.size;
  }
}
