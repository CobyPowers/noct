import HTTPClient from "../lib/http/HTTPClient.ts";
import Shard from "../lib/shard/Shard.ts";
import { GatewayIntent } from "../lib/types/gateway.ts";
import Logger from "../lib/util/Logger.ts";

const TOKEN =
  "NzIzNjI3NDUyMzc4Nzc1NjIz.Gl-pha.76Uxr9MdFghfOvkQyEk9XhLhPDIwC239IzA_Vk";

const logger = new Logger({ prefix: "DEFAULT" });
const http = new HTTPClient(logger, { token: TOKEN });
const shard = new Shard(logger, {
  token: TOKEN,
  gatewayURL: (await http.getGatewayInfo({ v: 10, encoding: "json" })).url,
  intents: GatewayIntent.ALL ^ GatewayIntent.GUILD_PRESENCES,
  sharding: {
    shardNum: 0,
    numShards: 1,
  },
});

await shard.start();
