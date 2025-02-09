import { GatewayCompression, GatewayEncoding, GatewayPayload, GatewayReadyReceiveEvent } from './gateway.ts';
import { ShardEventMap, ShardOptions } from './shard.ts';

export const ShardingMethod = {
  MANUAL: 'manual',
  AUTO: 'auto',
};
export type ShardingMethod = typeof ShardingMethod[keyof typeof ShardingMethod];

export interface ShardManagerOptions
  extends Omit<ShardOptions, 'gatewayURL' | 'shardInfo'> {
  shardingMethod?: ShardingMethod;
  shardCount?: number;
  encoding?: GatewayEncoding;
  gatewayVersion?: number;
}

export interface ShardManagerEventMap extends ShardEventMap {
  start: [];
  stop: [];
  error: [Error?];
  raw: [GatewayPayload];
  ready: [GatewayReadyReceiveEvent];
}