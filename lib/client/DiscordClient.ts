import { EventEmitter } from 'event';
import HTTPClient from '../http/HTTPClient.ts';
import ShardManager from '../shard/ShardManager.ts';
import { DiscordClientEventMap, DiscordClientOptions } from '../types/client.ts';
import Logger from '../util/Logger.ts';
import { GatewayOpcode } from '../types/codes.ts';
import Message from '../structures/Message.ts';
import User from '../structures/User.ts';

export default class DiscordClient extends EventEmitter<DiscordClientEventMap> {
  logger: Logger;
  http: HTTPClient;
  sharder: ShardManager;

  user?: User;

  constructor(options: DiscordClientOptions) {
    super();
    
    this.logger = new Logger({ prefix: 'CLIENT' });
    this.http = new HTTPClient(this, options);
    this.sharder = new ShardManager(this, options);

    this.#registerEvents();
  }

  #registerEvents() {
    this.sharder.on("ready", (data) => {
      this.user = new User(this, data.user);

      this.emit("ready", data);
    });

    this.sharder.on("raw", (payload) => {
      this.emit("raw", payload);

      if (payload.op == GatewayOpcode.DISPATCH) {
        if (payload.t == "MESSAGE_CREATE") {
          const msg = new Message(this, payload.d);
          this.emit("onMessageCreate", msg)
        }
      }
    })
  }

  async start() {
    await this.sharder.start();
    this.emit("start");
  }

  stop() {
    this.sharder.stop();
    this.emit("stop")
  }

  async updateUser(data: {
    username?: string,
    avatar?: string,
    banner?: string
  }) {
    const user = new User(this, await this.http.modifyCurrentUser(data));
    return this.user = user;
  }

  get latency() {
    return this.sharder.latency;
  }
}
