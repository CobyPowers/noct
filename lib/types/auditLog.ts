import { ApplicationCommand } from "./applicationCommands.ts";
import { Snowflake } from "./global.ts";
import { User } from "./user.ts";

export enum AuditLogEvent {
  GUILD_UPDATE = 1,
  CHANNEL_CREATE = 10,
  CHANNEL_UPDATE = 11,
  CHANNEL_DELETE = 12,
  CHANNEL_OVERWRITE_CREATE = 13,
  CHANNEL_OVERWRITE_UPDATE = 14,
  CHANNEL_OVERWRITE_DELETE = 15,
  MEMBER_KICK = 20,
  MEMBER_PRUNE = 21,
  MEMBER_BAN_ADD = 22,
  MEMBER_BAN_REMOVE = 23,
  MEMBER_UPDATE = 24,
  MEMBER_ROLE_UPDATE = 25,
  MEMBER_MOVE = 26,
  MEMBER_DISCONNECT = 27,
  BOT_ADD = 28,
  ROLE_CREATE = 30,
  ROLE_UPDATE = 31,
  ROLE_DELETE = 32,
  INVITE_CREATE = 40,
  INVITE_UPDATE = 41,
  INVITE_DELETE = 42,
  WEBHOOK_CREATE = 50,
  WEBHOOK_UPDATE = 51,
  WEBHOOK_DELETE = 52,
  EMOJI_CREATE = 60,
  EMOJI_UPDATE = 61,
  EMOJI_DELETE = 62,
  MESSAGE_DELETE = 72,
  MESSAGE_BULK_DELETE = 73,
  MESSAGE_PIN = 74,
  MESSAGE_UNPIN = 75,
  INTEGRATION_CREATE = 80,
  INTEGRATION_UPDATE = 81,
  INTEGRATION_DELETE = 82,
  STAGE_INSTANCE_CREATE = 83,
  STAGE_INSTANCE_UPDATE = 84,
  STAGE_INSTANCE_DELETE = 85,
  STICKER_CREATE = 90,
  STICKER_UPDATE = 91,
  STICKER_DELETE = 92,
  GUILD_SCHEDULED_EVENT_CREATE = 100,
  GUILD_SCHEDULED_EVENT_UPDATE = 101,
  GUILD_SCHEDULED_EVENT_DELETE = 102,
  THREAD_CREATE = 110,
  THREAD_UPDATE = 111,
  THREAD_DELETE = 112,
  APPLICATION_COMMAND_PERMISSION_UPDATE = 121,
  AUTO_MODERATION_RULE_CREATE = 140,
  AUTO_MODERATION_RULE_UPDATE = 141,
  AUTO_MODERATION_RULE_DELETE = 142,
  AUTO_MODERATION_BLOCK_MESSAGE = 143,
  AUTO_MODERATION_FLAG_TO_CHANNEL = 144,
  AUTO_MODERATION_USER_COMMUNICATION_DISABLED = 145,
  CREATOR_MONETIZATION_REQUEST_CREATED = 150,
  CREATOR_MONTETIZATION_TERMS_ACCEPTED = 151,
}

export enum AuditLogEntryInfoEntityType {
  ROLE = 0,
  MEMBER = 1,
}

export interface AuditLog {
  application_commands: ApplicationCommand[];
  audit_log_entries: AuditLogEntry[];
  auto_moderation_rules: AutoModerationRule[];
  guild_scheduled_events: GuildScheduledEvent[];
  integration: Integration[];
  threads: ThreadChannel[];
  users: User[];
  webhooks: Webhook[];
}

export interface AuditLogEntry {
  target_id: Snowflake | null;
  changes?: AuditLogChange[];
  user_id: Snowflake | null;
  id: Snowflake;
  action_type: AuditLogEvent;
  options?: AuditLogEntryInfo;
  reason?: string;
}

// TODO: Figure out if the 'number' properties are actually 'strings'

export interface AuditLogEntryInfo { // considered 'optional'
  application_id?: Snowflake;
  auto_moderation_rule_name?: string;
  auto_moderation_rule_trigger_type?: AutoModerationTriggerType;
  channel_id?: Snowflake;
  count?: number;
  delete_member_days?: number;
  id?: Snowflake;
  members_removed?: number;
  message_id?: Snowflake;
  role_name?: string;
  type?: AuditLogEntryInfoEntityType;
}

export interface AuditLogChange<T = any> {
  new_value?: T;
  old_value?: T;
  key: string;
}
