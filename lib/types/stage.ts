import { Snowflake } from "./global.ts";

export enum StagePrivacyLevel {
  PUBLIC = 1,
  GUILD_ONLY = 2,
}

export interface StageInstance {
  id: Snowflake;
  guild_id: Snowflake;
  channel_id: Snowflake;
  topic: string;
  privacy_level: StagePrivacyLevel;
  discoverable_disabled: boolean;
  guild_scheduled_event_id: Snowflake | null;
}
