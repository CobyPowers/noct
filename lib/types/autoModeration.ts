import { Snowflake } from "./global.ts";

export enum AutoModerationRuleTriggerType {
  KEYWORD = 1,
  SPAM = 3,
  KEYWORD_PRESET = 4,
  MENTION_SPAM = 5,
}

export enum AutoModerationRuleEventType {
  MESSAGE_SEND = 1,
}

export enum AutoModerationRuleActionType {
  BLOCK_MESSAGE = 1,
  SEND_ALERT_MESSAGE = 2,
  TIMEOUT = 3,
}

export enum KeywordPresetType {
  PROFANITY = 1,
  SEXUAL_CONTENT = 2,
  SLURS = 3,
}

export interface AutoModerationRule {
  id: Snowflake;
  guild_id: Snowflake;
  name: string;
  creator_id: Snowflake;
  event_type: AutoModerationRuleEventType;
  trigger_type: AutoModerationRuleTriggerType;
  trigger_metadata: AutoModerationRuleTriggerMetadata;
  actions: AutoModerationRuleAction[];
  enabled: boolean;
  exempt_roles: Snowflake[];
  exempt_channels: Snowflake[];
}

export interface AutoModerationRuleTriggerMetadata {
  keyword_filter?: string[];
  refex_patterns?: string[];
  presets?: KeywordPresetType[];
  allow_list?: string[];
  mention_total_limit?: number;
  mention_raid_protection_enabled?: boolean;
}

export interface AutoModerationRuleAction {
  type: AutoModerationRuleActionType;
  metadata: AutoModerationActionMetadata;
}

export interface AutoModerationActionMetadata {
  channel_id?: Snowflake;
  duration_seconds?: number;
  custom_message?: string;
}
