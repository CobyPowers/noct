import { AuditLogEvent } from './auditLog.ts';
import {
  AutoModerationRuleAction,
  AutoModerationRuleEventType,
  AutoModerationRuleTriggerMetadata,
  AutoModerationRuleTriggerType,
} from './autoModeration.ts';
import { GatewaySessionStartLimit } from './gateway.ts';
import { Snowflake } from './global.ts';
import { LogLevel } from './logger.ts';

export interface HTTPClientOptions {
  baseURL?: string;
  apiVersion?: number;
  userAgent?: string;
  token: string;
}

export interface HTTPRequestOptions {
  ignoreGlobalLock?: boolean;
  tries?: number;
}

export interface HTTPRateLimitError {
  message: string;
  retry_after: number;
  global: boolean;
  code?: number;
}

export interface HTTPBadRequestError {
  code: number;
  errors: HTTPBadRequestErrorNest | HTTPBadRequestErrorDetails;
  message: string;
}

export interface HTTPBadRequestErrorNest {
  [key: string]: HTTPBadRequestErrorNest | HTTPBadRequestErrorDetails;
}

export interface HTTPBadRequestErrorDetails {
  _errors: {
    code: string;
    message: string;
  }[];
}

// #region Gateway

export interface HTTPGetGatewayConnectionInfoOptions {
  v?: number;
  encoding?: string;
  compress?: string;
}

// #endregion Gateway

//#region Application Role

export interface HTTPGetApplicationRoleConnectionMetadataOptions {
  applicationID: Snowflake;
}

//#endregion

//#region Audit Log

export interface HTTPGetAuditLogOptions {
  guildID: Snowflake;
}

export interface HTTPGetAuditLogParams {
  user_id?: Snowflake;
  action_type?: AuditLogEvent;
  before?: Snowflake;
  after?: Snowflake;
  limit?: number;
}

//#endregion

//#region Auto Moderation

export interface HTTPGetAutoModerationRulesOptions {
  guildID: Snowflake;
}

export interface HTTPGetAutoModerationRuleOptions {
  guildID: Snowflake;
  autoModerationRuleID: Snowflake;
}

export interface HTTPCreateAutoModerationRuleOptions {
  guildID: Snowflake;
  reason?: string;
}

export interface HTTPCreateAutoModerationRuleData {
  name: string;
  event_type: AutoModerationRuleEventType;
  trigger_type: AutoModerationRuleTriggerType;
  trigger_metadata?: AutoModerationRuleTriggerMetadata;
  actions: AutoModerationRuleAction[];
  enabled?: boolean;
  exempt_roles?: Snowflake[];
  exempt_channels?: Snowflake[];
}

export interface HTTPModifyAutoModerationRuleOptions {
  guildID: Snowflake;
  autoModerationRuleID: Snowflake;
  reason?: string;
}

export interface HTTPModifyAutoModerationRuleData {
  name?: string;
  event_type?: AutoModerationRuleEventType;
  trigger_type?: AutoModerationRuleTriggerType;
  trigger_metadata?: AutoModerationRuleTriggerMetadata;
  actions?: AutoModerationRuleAction[];
  enabled?: boolean;
  exempt_roles?: Snowflake[];
  exempt_channels?: Snowflake[];
}

export interface HTTPDeleteAutoModerationRuleOptions {
  guildID: Snowflake;
  autoModerationRuleID: Snowflake;
  reason?: string;
}

//#endregion

//#region Channel

export interface HTTPGetChannelOptions {
  channelID: Snowflake;
}

export interface HTTPModifyGroupChannelOptions {
  channelID: Snowflake;
  reason?: string;
}

export interface HTTPModifyGroupChannelData {
  name?: string;
  icon?: string;
}

//#endregion Channel

// #region User

export interface HTTPGetUserOptions {
  userID: Snowflake;
}

// #endregion User
