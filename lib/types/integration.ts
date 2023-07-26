import { ISO8601, Snowflake } from "./global.ts";
import { OAuthScope } from "./oauth.ts";
import { User } from "./user.ts";

export enum IntegrationExpireBehavior {
  REMOVE_ROLE = 0,
  KICK = 1,
}

export interface Integration {
  id: Snowflake;
  name: string;
  type: IntegrationType;
  enabled: boolean;
  syncing?: boolean;
  role_id?: Snowflake;
  enable_emoticons?: boolean;
  expire_behavior?: IntegrationExpireBehavior;
  expire_grace_period?: number;
  user?: User;
  account: IntegrationAccount;
  synced_at?: ISO8601;
  subscriber_count?: number;
  revoked?: boolean;
  application?: IntegrationApplication;
  scopes: OAuthScope[];
}

export interface IntegrationAccount {
  id: string;
  name: string;
}

export interface IntegrationApplication {
  id: Snowflake;
  name: string;
  icon: string | null;
  description: string;
  bot?: User;
}
