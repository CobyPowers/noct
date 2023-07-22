import { StatusType } from "./activity.ts";
import { Activity } from "./activity.ts";
import { Snowflake } from "./global.ts";

export type GatewayPayload<T = any> = {
  op: 0,
  d: T | null,
  s: number,
  t: string
} | {
  op: number,
  d: T | null,
  s: null,
  t: null
}

//#region Misc

export interface GatewayConnectionProperties {
  os: string;
  browser: string;
  device: string;
}

export interface GatewaySessionStartLimit {
  total: number;
  remaining: number;
  reset_after: number;
  max_concurrency: number;
}

//#endregion

//#region Requests

export interface GatewayIdentifyReq {
  token: string;
  properties: GatewayConnectionProperties;
  compress?: boolean;
  large_threshold?: number;
  shard?: [number, number];
  presence?: GatewayUpdatePresenceReq;
  intents: number;
}

export interface GatewayResumeReq {
  token: string;
  session_id: string;
  seq: number;
}

export type GatewayHeartbeatReq = number;

export interface GatewayGuildMembersReq {
  guild_id: Snowflake;
  query?: string;
  limit: number;
  presences?: boolean;
  user_ids?: Snowflake | Snowflake[];
  nonce?: string;
}

export interface GatewayUpdateVoiceStateReq {
  guild_id: Snowflake;
  channel_id: Snowflake | null;
  self_mute: boolean;
  self_deaf: boolean;
}

export interface GatewayUpdatePresenceReq {
  since: number | null;
  activities: Activity[];
  status: StatusType;
  afk: boolean;
}

//#endregion Requests


//#region Events

export interface GatewayHelloEvent {
  heartbeat_interval: number;
}

export interface GatewayReadyEvent {
  v: number;
  user: User;
  guilds: UnavailableGuild[];
  session_id: string;
  resume_gateway_url: string;
  shard?: [number, number];
  application: PartialApplication;
}

export type GatewayResumedEvent = null;

export type GatewayReconnectEvent = null;

export type GatewayInvalidSessionEvent = boolean;

//#endregion Events