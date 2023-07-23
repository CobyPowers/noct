import {
  GatewayCompression,
  GatewayEncoding,
  GatewayUpdatePresenceSendEvent,
} from "./gateway.ts";

export enum ShardState {
  STARTED,
  STOPPED,
  ERRORED,
}

export interface ShardOptions {
  token: string;
  intents: number;
  gatewayURL: string;
  sharding: ShardInfo;
  largeThreshold?: number;
  compression?: GatewayCompression;
  presence?: GatewayUpdatePresenceSendEvent;
}

export interface ShardRestartOptions {
  resume?: boolean;
}

export interface ShardInfo {
  shardNum: number;
  numShards: number;
}

export interface ShardEmitMap extends Record<string, unknown[]> {
  start: [];
  stop: [];
  error: [Error];
}
