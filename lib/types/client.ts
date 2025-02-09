import Message from '../structures/Message.ts';
import { GatewayPayload, GatewayReadyReceiveEvent } from './gateway.ts';
import { HTTPClientOptions } from './http.ts';
import { ShardManagerOptions } from './shardManager.ts';

export interface DiscordClientOptions
  extends ShardManagerOptions, HTTPClientOptions {
}

export interface DiscordClientEventMap {
  start: [];
  stop: [];
  //error: [Error?];
  raw: [GatewayPayload];
  ready: [GatewayReadyReceiveEvent];
  onMessageCreate: [Message];
}
