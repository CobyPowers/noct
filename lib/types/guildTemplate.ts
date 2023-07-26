import { ISO8601, Snowflake } from "./global.ts";
import { User } from "./user.ts";

export interface GuildTemplate {
  code: string;
  name: string;
  description: string | null;
  usage_count: number;
  creator_id: Snowflake;
  creator: User;
  created_at: ISO8601;
  updated_at: ISO8601;
  source_guild_id: Snowflake;
  serialized_source_guild: PartialGuild;
  is_dirty: boolean | null;
}
