import { Snowflake } from "./global.ts";
import { OAuthScope } from "./oauth.ts";
import { Team } from "./team.ts";

export enum ApplicationFlag {
  APPLICATION_AUTO_MODERATION_RULE_CREATE_BADGE = 1 << 6,
  GATEWAY_PRESENCE = 1 << 12,
  GATEWAY_PRESENCE_LIMITED = 1 << 13,
  GATEWAY_GUILD_MEMBERS = 1 << 14,
  GATEWAY_GUILD_MEMBERS_LIMITED = 1 << 15,
  VERIFICATION_PENDING_GUILD_LIMIT = 1 << 16,
  EMBEDDED = 1 << 17,
  GATEWAY_MESSAGE_CONTENT = 1 << 18,
  GATEWAY_MESSAGE_CONTENT_LIMITED = 1 << 19,
  APPLICATION_COMMAND_BADGE = 1 << 23,
}

export interface PartialApplication {
  id: Snowflake;
  flags: ApplicationFlag;
}

export interface Application extends PartialApplication {
  name: string;
  icon: string | null;
  description: string;
  rpc_origins?: string[];
  bot_public: boolean;
  bot_require_code_grant: boolean;
  terms_of_service_url?: string;
  privacy_policy_url?: string;
  owner?: PartialUser;
  verify_key: string;
  team: Team | null;
  guild_id?: Snowflake;
  guild?: PartialGuild;
  primary_sku_id?: Snowflake;
  slug?: string;
  cover_image?: string;
  approximate_guild_count?: number;
  tags?: string[];
  install_params?: ApplicationInstallParams;
  custom_install_url?: string;
  role_connections_verification_url?: string;
}

export interface ApplicationInstallParams {
  scopes: OAuthScope[];
  permissions: string;
}
