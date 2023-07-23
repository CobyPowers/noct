import Shard from "../lib/shard/Shard.ts";
import { GatewayIntent } from "../lib/types/gateway.ts";
import Logger from "../lib/util/Logger.ts";

const logger = new Logger({ prefix: "DEFAULT" });
const shard = new Shard(logger, {
  token:
    "NzIzNjI3NDUyMzc4Nzc1NjIz.Gl-pha.76Uxr9MdFghfOvkQyEk9XhLhPDIwC239IzA_Vk",
  gatewayURL: "wss://gateway.discord.gg/?v=10&encoding=json",
  intents: GatewayIntent.ALL,
  sharding: {
    shardNum: 0,
    numShards: 1,
  },
});

shard.start();
