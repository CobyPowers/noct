import { Snowflake } from "./global.ts";
import { Integration } from "./integration.ts";

export enum UserFlag {
  STAFF = 1 << 0,
  PARTNER = 1 << 1,
  HYPESQUAD = 1 << 2,
  BUG_HUNTER_LV1 = 1 << 3,
  HYPESQUAD_BRAVERY = 1 << 6,
  HYPESQUAD_BRILLIANCE = 1 << 7,
  HYPESQUAD_BALANCE = 1 << 8,
  EARLY_NITRO_SUPPORTER = 1 << 9,
  TEAM_USER = 1 << 10,
  BUG_HUNTER_LV2 = 1 << 14,
  VERIFIED_BOT = 1 << 16,
  VERIFIED_DEVELOPER = 1 << 17,
  CERTIFIED_MODERATOR = 1 << 18,
  BOT_INTERACTIONS_ONLY = 1 << 19,
  ACTIVE_DEVELOPER = 1 << 22,
}

export enum UserPremiumType {
  NONE = 0,
  NITRO_CLASSIC = 1,
  NITRO = 2,
  NITRO_BASIC = 3,
}

export const UserConnectionType = {
  BATTLENET: "battlenet",
  EBAY: "ebay",
  EPIC_GAMES: "epicgames",
  FACEBOOK: "facebook",
  GITHUB: "github",
  INSTAGRAM: "instagram",
  LOL: "leagueoflegends",
  PAYPAL: "paypal",
  PLAYSTATION: "playstation",
  REDDIT: "reddit",
  RIOT_GAMES: "riotgames",
  SPOTIFY: "spotify",
  SKYPE: "skype",
  STEAM: "steam",
  TIKTOK: "tiktok",
  TWITCH: "twitch",
  TWITTER: "twitter",
  XBOX: "xbox",
  YOUTUBE: "youtube",
} as const;
export type UserConnectionType =
  typeof UserConnectionType[keyof typeof UserConnectionType];

export enum UserConnectionVisibility {
  NONE = 0,
  EVERYONE = 1,
}

export type PartialUser = Partial<User>;

export interface User {
  id: Snowflake;
  username: string;
  discriminator: string;
  global_name: string | null;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string | null;
  accent_color?: number | null;
  locale?: string;
  verified?: boolean;
  email?: string | null;
  flags?: UserFlag;
  premium_type?: UserPremiumType;
  public_flags?: UserFlag;
  avatar_decorations?: string | null;
}

export interface UserConnection {
  id: string;
  name: string;
  type: UserConnectionType;
  revoked?: boolean;
  integrations?: Integration[];
  verified: boolean;
  friend_sync: boolean;
  show_activity: boolean;
  two_way_link: boolean;
  visibility: UserConnectionVisibility;
}
