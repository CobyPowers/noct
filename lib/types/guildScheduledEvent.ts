import { ISO8601, Snowflake } from "./global.ts";
import { Member } from "./member.ts";
import { User } from "./user.ts";

export enum GuildScheduledEventPrivacyLevel {
  GUILD_ONLY = 2,
}

export enum GuildScheduledEventStatus {
  SCHEDULED = 1,
  ACTIVE = 2,
  COMPLETED = 3,
  CANCELED = 4,
}

export enum GuildScheduledEventEntityType {
  STAGE_INSTANCE = 1,
  VOICE = 2,
  EXTERNAL = 3,
}

export interface GuildScheduledEvent {
  id: Snowflake;
  guild_id: Snowflake;
  channel_id: Snowflake | null;
  creator_id?: Snowflake | null;
  name: string;
  description?: string | null;
  scheduled_start_time: ISO8601;
  scheduled_end_time: ISO8601 | null;
  privacy_level: GuildScheduledEventPrivacyLevel;
  status: GuildScheduledEventStatus;
  entity_type: GuildScheduledEventEntityType;
  entity_id: Snowflake | null;
  entity_metadata: GuildScheduledEventEntityMetadata;
  creator?: GuildScheduledEventCreator;
  user_count?: number;
  image?: string | null;
}

export interface GuildScheduledEventEntityMetadata {
  location?: string;
}

export interface GuildScheduledEventCreator {
  guild_scheduled_event_id: Snowflake;
  user: User;
  member?: Member;
}
