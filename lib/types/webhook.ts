import { PartialChannel } from "./channel.ts";
import { Snowflake } from "./global.ts";
import { PartialGuild } from "./guild.ts";
import { User } from "./user.ts";

export enum WebhookType {
  INCOMING = 1,
  CHANNEL_FOLLOWER = 2,
  APPLICATION = 3,
}

export interface Webhook {
  id: Snowflake;
  type: WebhookType;
  guild_id?: Snowflake | null;
  channel_id: Snowflake | null;
  user?: User;
  name: string | null;
  avatar: string | null;
  token?: string;
  application_id: Snowflake | null;
  source_guild?: PartialGuild;
  source_channel?: PartialChannel;
  url?: string;
}
