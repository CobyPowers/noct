import { Snowflake } from "./global.ts";

export enum RoleFlag {
  IN_PROMPT = 1 << 0,
}

export interface Role {
  id: Snowflake;
  name: string;
  color: number;
  hoist: boolean;
  icon?: string | null;
  unicode_emoji?: string | null;
  position: number;
  permissions: number; // TODO: figure out if permissions is 'string' or 'number'
  managed: boolean;
  mentionable: boolean;
  tags?: RoleTag[];
  flags: RoleFlag;
}

export interface RoleTag {
  bot_id?: Snowflake;
  integration_id?: Snowflake;
  premium_subscriber?: null; // TODO: figure out if premium_subscriber is 'null' or 'boolean'
  subscription_listing_id?: Snowflake;
  available_for_purchase?: null;
  guild_connections?: null;
}

export interface RoleSubscriptionData {
  role_subscription_listing_id: Snowflake;
  tier_name: string;
  total_months_subscribed: number;
  is_renewal: boolean;
}
