import { GatewayPayload, GatewayReadyReceiveEvent } from "./gateway.ts";
import { Presence } from "./presence.ts";

export enum ShardState {
  STARTED,
  STOPPED,
  ERRORED,
}

export interface ShardOptions {
  token: string;
  intents: number;
  gatewayURL: string;
  shardInfo: ShardInfo;
  largeThreshold?: number;
  compress?: boolean;
  presence?: Presence;
}

export interface ShardRestartOptions {
  resume?: boolean;
}

export interface ShardInfo {
  shardNum: number;
  numShards: number;
}

export interface ShardEventMap extends Record<string, unknown[]> {
  start: [];
  stop: [];
  connect: [];
  disconnect: [];
  error: [Error?];
  raw: [GatewayPayload];
  ready: [GatewayReadyReceiveEvent];
}