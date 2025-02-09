import { StatusType } from "./activity.ts";
import { Activity } from "./activity.ts";
import { PartialApplication } from "./application.ts";
import { GatewayOpcode } from "./codes.ts";
import { Snowflake } from "./global.ts";
import { UnavailableGuild } from "./guild.ts";
import { Presence } from "./presence.ts";
import { User } from "./user.ts";

export const GatewayEncoding = {
  JSON: "json",
  ETF: "etf",
} as const;
export type GatewayEncoding =
  typeof GatewayEncoding[keyof typeof GatewayEncoding];

export const GatewayCompression = {
  ZLIB: "zlib-stream",
  NONE: "none",
} as const;
export type GatewayCompression =
  typeof GatewayCompression[keyof typeof GatewayCompression];

export enum GatewaySendEvent {
  IDENTIFY = "IDENTIFY",
  RESUME = "RESUME",
  HEARTBEAT = "HEARTBEAT",
  REQUEST_GUILD_MEMBERS = "REQUEST_GUILD_MEMBERS",
  UPDATE_VOICE_STATE = "UPDATE_VOICE_STATE",
  UPDATE_PRESENCE = "UPDATE_PRESENCE",
}

export enum GatewayReceiveEvent {
  HELLO = "HELLO",
  READY = "READY",
  RESUMED = "RESUMED",
  RECONNECT = "RECONNECT",
  INVALID_SESSION = "INVALID_SESSION",
  APPLICATION_COMMAND_PERMISSIONS_UPDATE =
    "APPLICATION_COMMAND_PERMISSIONS_UPDATE",
  AUTO_MODERATION_RULE_CREATE = "AUTO_MODERATION_RULE_CREATE",
  AUTO_MODERATION_RULE_UPDATE = "AUTO_MODERATION_RULE_UPDATE",
  AUTO_MODERATION_RULE_DELETE = "AUTO_MODERATION_RULE_DELETE",
  AUTO_MODERATION_ACTION_EXECUTION = "AUTO_MODERATION_ACTION_EXECUTION",
  CHANNEL_CREATE = "CHANNEL_CREATE",
  CHANNEL_UPDATE = "CHANNEL_UPDATE",
  CHANNEL_DELETE = "CHANNEL_DELETE",
  CHANNEL_PINS_UPDATE = "CHANNEL_PINS_UPDATE",
  THREAD_CREATE = "THREAD_CREATE",
  THREAD_UPDATE = "THREAD_UPDATE",
  THREAD_DELETE = "THREAD_DELETE",
  THREAD_LIST_SYNC = "THREAD_LIST_SYNC",
  THREAD_MEMBER_UPDATE = "THREAD_MEMBER_UPDATE",
  THREAD_MEMBERS_UPDATE = "THREAD_MEMBERS_UPDATE",
  GUILD_CREATE = "GUILD_CREATE",
  GUILD_UPDATE = "GUILD_UPDATE",
  GUILD_DELETE = "GUILD_DELETE",
  GUILD_AUDIT_LOG_ENTRY_CREATE = "GUILD_AUDIT_LOG_ENTRY_CREATE",
  GUILD_BAN_ADD = "GUILD_BAN_ADD",
  GUILD_BAN_REMOVE = "GUILD_BAN_REMOVE",
  GUILD_EMOJIS_UPDATE = "GUILD_EMOJIS_UPDATE",
  GUILD_STICKERS_UPDATE = "GUILD_STICKERS_UPDATE",
  GUILD_INTEGRATIONS_UPDATE = "GUILD_INTEGRATIONS_UPDATE",
  GUILD_MEMBER_ADD = "GUILD_MEMBER_ADD",
  GUILD_MEMBER_REMOVE = "GUILD_MEMBER_REMOVE",
  GUILD_MEMBER_UPDATE = "GUILD_MEMBER_UPDATE",
  GUILD_MEMBERS_CHUNK = "GUILD_MEMBERS_CHUNK",
  GUILD_ROLE_CREATE = "GUILD_ROLE_CREATE",
  GUILD_ROLE_UPDATE = "GUILD_ROLE_UPDATE",
  GUILD_ROLE_DELETE = "GUILD_ROLE_DELETE",
  GUILD_SCHEDULED_EVENT_CREATE = "GUILD_SCHEDULED_EVENT_CREATE",
  GUILD_SCHEDULED_EVENT_UPDATE = "GUILD_SCHEDULED_EVENT_UPDATE",
  GUILD_SCHEDULED_EVENT_DELETE = "GUILD_SCHEDULED_EVENT_DELETE",
  GUILD_SCHEDULED_EVENT_USER_ADD = "GUILD_SCHEDULED_EVENT_USER_ADD",
  GUILD_SCHEDULED_EVENT_USER_REMOVE = "GUILD_SCHEDULED_EVENT_USER_REMOVE",
  INTEGRATION_CREATE = "INTEGRATION_CREATE",
  INTEGRATION_UPDATE = "INTEGRATION_UPDATE",
  INTEGRATION_DELETE = "INTEGRATION_DELETE",
  INTERACTION_CREATE = "INTERACTION_CREATE",
  INVITE_CREATE = "INVITE_CREATE",
  INVITE_DELETE = "INVITE_DELETE",
  MESSAGE_CREATE = "MESSAGE_CREATE",
  MESSAGE_UPDATE = "MESSAGE_UPDATE",
  MESSAGE_DELETE = "MESSAGE_DELETE",
  MESSAGE_DELETE_BULK = "MESSAGE_DELETE_BULK",
  MESSAGE_REACTION_ADD = "MESSAGE_REACTION_ADD",
  MESSAGE_REACTION_REMOVE = "MESSAGE_REACTION_REMOVE",
  MESSAGE_REACTION_REMOVE_ALL = "MESSAGE_REACTION_REMOVE_ALL",
  MESSAGE_REACTION_REMOVE_EMOJI = "MESSAGE_REACTION_REMOVE_EMOJI",
  PRESENCE_UPDATE = "PRESENCE_UPDATE",
  STAGE_INSTANCE_CREATE = "STAGE_INSTANCE_CREATE",
  STAGE_INSTANCE_UPDATE = "STAGE_INSTANCE_UPDATE",
  STAGE_INSTANCE_DELETE = "STAGE_INSTANCE_DELETE",
  TYPING_START = "TYPING_START",
  USER_UPDATE = "USER_UPDATE",
  VOICE_STATE_UPDATE = "VOICE_STATE_UPDATE",
  VOICE_SERVER_UPDATE = "VOICE_SERVER_UPDATE",
  WEBHOOKS_UPDATE = "WEBHOOKS_UPDATE",
}

export enum GatewayIntent {
  ALL = 0b1111111111111111111111,
  GUILDS = 1 << 0,
  GUILD_MEMBERS = 1 << 1,
  GUILD_MODERATION = 1 << 2,
  GUILD_EMOJIS_AND_STICKERS = 1 << 3,
  GUILD_INTEGRATIONS = 1 << 4,
  GUILD_WEBHOOKS = 1 << 5,
  GUILD_INVITES = 1 << 6,
  GUILD_VOICE_STATES = 1 << 7,
  GUILD_PRESENCES = 1 << 8,
  GUILD_MESSAGES = 1 << 9,
  GUILD_MESSAGE_REACTIONS = 1 << 10,
  GUILD_MESSAGE_TYPING = 1 << 11,
  DIRECT_MESSAGES = 1 << 12,
  DIRECT_MESSAGE_REACTIONS = 1 << 13,
  DIRECT_MESSAGE_TYPING = 1 << 14,
  MESSAGE_CONTENT = 1 << 15, // affects content, attachments, embeds, and components
  GUILD_SCHEDULED_EVENTS = 1 << 16,
  AUTO_MODERATION_CONFIGURATION = 1 << 20,
  AUTO_MODERATION_EXECUTION = 1 << 21,
}

//#region Payloads

export type GatewayPayload =
  | GatewayDispatchPayload<
    GatewayDispatchReceiveEventMap,
    keyof GatewayDispatchReceiveEventMap
  >
  | GatewayHeartbeatPayload
  | GatewayIdentifyPayload
  | GatewayUpdatePresencePayload
  | GatewayVoiceStateUpdatePayload
  | GatewayResumePayload
  | GatewayReconnectPayload
  | GatewayRequestGuildMembersPayload
  | GatewayInvalidSessionPayload
  | GatewayHelloPayload
  | GatewayHeartbeatACKPayload;

export interface GatewayDispatchReceiveEventMap {
  READY: GatewayReadyReceiveEvent;
  MESSAGE_CREATE: any; // TODO: give MESSAGE_CREATE event a type
}

export interface GatewayDispatchPayload<E, K extends keyof E> {
  op: GatewayOpcode.DISPATCH;
  d: E[K];
  s: number;
  t: K;
}

export interface GatewayHeartbeatPayload {
  op: GatewayOpcode.HEARTBEAT;
  d: GatewayHeartbeatSendEvent;
}

export interface GatewayIdentifyPayload {
  op: GatewayOpcode.IDENTIFY;
  d: GatewayIdentifySendEvent;
}

export interface GatewayUpdatePresencePayload {
  op: GatewayOpcode.UPDATE_PRESENCE;
  d: GatewayUpdatePresenceSendEvent;
}

export interface GatewayVoiceStateUpdatePayload {
  op: GatewayOpcode.VOICE_STATE_UPDATE;
  d: GatewayUpdateVoiceStateSendEvent;
}

export interface GatewayResumePayload {
  op: GatewayOpcode.RESUME;
  d: GatewayResumeSendEvent;
}

export interface GatewayReconnectPayload {
  op: GatewayOpcode.RECONNECT;
  d: GatewayReconnectReceiveEvent;
}

export interface GatewayRequestGuildMembersPayload {
  op: GatewayOpcode.REQUEST_GUILD_MEMBERS;
  d: GatewayReqGuildMembersSendEvent;
}

export interface GatewayInvalidSessionPayload {
  op: GatewayOpcode.INVALID_SESSION;
  d: GatewayInvalidSessionReceiveEvent;
}

export interface GatewayHelloPayload {
  op: GatewayOpcode.HELLO;
  d: GatewayHelloReceiveEvent;
}

export interface GatewayHeartbeatACKPayload {
  op: GatewayOpcode.HEARTBEAT_ACK;
  d: GatewayHeartbeatACKReceiveEvent;
}

//#endregion

//#region Misc

export interface GatewayConnectionProperties {
  os: string;
  browser: string;
  device: string;
}

export interface GatewayConnectionInfo {
  url: string;
}

export interface GatewayBotConnectionInfo extends GatewayConnectionInfo {
  shards: number;
  session_start_limit: GatewaySessionStartLimit;
}

export interface GatewaySessionStartLimit {
  total: number;
  remaining: number;
  reset_after: number;
  max_concurrency: number;
}

//#endregion

//#region Send Events

export interface GatewayIdentifySendEvent {
  token: string;
  properties: GatewayConnectionProperties;
  compress?: boolean;
  large_threshold?: number;
  shard?: [number, number];
  presence?: GatewayUpdatePresenceSendEvent;
  intents: number;
}

export interface GatewayResumeSendEvent {
  token: string;
  session_id: string;
  seq: number;
}

export type GatewayHeartbeatSendEvent = number | null;

export interface GatewayReqGuildMembersSendEvent {
  guild_id: Snowflake;
  query?: string;
  limit: number;
  presences?: boolean;
  user_ids?: Snowflake | Snowflake[];
  nonce?: string;
}

export interface GatewayUpdateVoiceStateSendEvent {
  guild_id: Snowflake;
  channel_id: Snowflake | null;
  self_mute: boolean;
  self_deaf: boolean;
}

export type GatewayUpdatePresenceSendEvent = Presence;

//#endregion Requests

//#region Receive Events

export interface GatewayHelloReceiveEvent {
  heartbeat_interval: number;
}

export interface GatewayReadyReceiveEvent {
  v: number;
  user: User;
  guilds: UnavailableGuild[];
  session_id: string;
  resume_gateway_url: string;
  shard?: [number, number];
  application: PartialApplication;
}

export type GatewayResumedReceiveEvent = null;

export type GatewayReconnectReceiveEvent = null;

export type GatewayInvalidSessionReceiveEvent = boolean;

export type GatewayHeartbeatACKReceiveEvent = null;

//#endregion Events
