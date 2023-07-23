import { Locale, Snowflake } from "./global.ts";

export enum ApplicationCommandType {
  CHAT_INPUT = 1,
  USER = 2,
  MESSAGE = 3,
}

export enum ApplicationCommandOptionType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
  MENTIONABLE = 9,
  NUMBER = 10,
  ATTACHMENT = 11,
}

export interface ApplicationCommand {
  id: Snowflake;
  type?: ApplicationCommandType;
  application_id: Snowflake;
  guild_id?: Snowflake;
  name: string;
  name_localizations?: Record<Locale, string>;
  description: string;
  description_localizations?: Record<Locale, string>;
  options?: ApplicationCommandOption[];
  default_member_permissions: string | null;
  dm_permission?: boolean;
  default_permission?: boolean | false;
  nsfw?: boolean;
  version: Snowflake;
}

export interface ApplicationCommandOption {
  type: ApplicationCommandOptionType;
  name: string;
  name_localizations?: Record<Locale, string>;
  description: string;
  description_localizations?: Record<Locale, string>;
  required?: boolean;
  choices?: ApplicationCommandOptionChoice[];
  options?: ApplicationCommandOption[];
  channel_types?: ChannelType[];
  min_value?: number;
  max_value?: number;
  min_length?: number;
  max_length?: number;
  autocomplete?: boolean;
}

export interface ApplicationCommandOptionChoice {
  name: string;
  name_localizations?: Record<Locale, string>;
  value: string | number;
}
