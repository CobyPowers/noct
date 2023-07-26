import { Emoji } from "./emoji.ts";
import { Locale, Snowflake } from "./global.ts";
import { Role } from "./role.ts";
import { Sticker } from "./sticker.ts";
import { User } from "./user.ts";

export enum GuildMessageNotificationLevel {
  ALL_MESSAGES = 0,
  ONLY_MENTIONS = 1,
}

export enum GuildExplicitContentFilterLevel {
  DISABLED = 0,
  MEMBERS_WITHOUT_ROLES = 1,
  ALL_MEMBERS = 2,
}

export enum GuildMFALevel {
  NONE = 0,
  ELEVATED = 1,
}

export enum GuildVerificationLevel {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  VERY_HIGH = 4,
}

export enum GuildNSFWLevel {
  DEFAULT = 0,
  EXPLICIT = 1,
  SAFE = 2,
  AGE_RESTRICTED = 3,
}

export enum GuildPremiumTier {
  NONE = 0,
  TIER_1 = 1,
  TIER_2 = 2,
  TIER_3 = 3,
}

export enum GuildSystemChannelFlag {
  SUPPRESS_JOIN_NOTIFICATIONS = 1 << 0,
  SUPPRESS_PREMIUM_SUBSCRIPTIONS = 1 << 1,
  SUPPRESS_GUILD_REMINDER_NOTIFICATIONS = 1 << 2,
  SUPPRESS_JOIN_NOTIFICATION_REPLIES = 1 << 3,
  SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS = 1 << 4,
  SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATION_REPLIES = 1 << 5,
}

export const GuildFeature = {
  ANIMATED_BANNER: "ANIMATED_BANNER",
  ANIMATED_ICON: "ANIMATED_ICON",
  APPLICATION_COMMAND_PERMISSIONS_V2: "APPLICATION_COMMAND_PERMISSIONS_V2",
  AUTO_MODERATION: "AUTO_MODERATION",
  BANNER: "BANNER",
  COMMUNITY: "COMMUNITY",
  CREATOR_MONETIZABLE_PROVISIONAL: "CREATOR_MONETIZABLE_PROVISIONAL",
  CREATOR_STORE_PAGE: "CREATOR_STORE_PAGE",
  DEVELOPER_SUPPORT_SERVER: "DEVELOPER_SUPPORT_SERVER",
  DISCOVERABLE: "DISCOVERABLE",
  FEATURABLE: "FEATURABLE",
  INVITES_DISABLED: "INVITES_DISABLED",
  INVITE_SPLASH: "INVITE_SPLASH",
  MEMBER_VERIFICATION_GATE_ENABLED: "MEMBER_VERIFICATION_GATE_ENABLED",
  MORE_STICKERS: "MORE_STICKERS",
  NEWS: "NEWS",
  PARTNERED: "PARTNERED",
  PREVIEW_ENABLED: "PREVIEW_ENABLED",
  RAID_ALERTS_DISABLED: "RAID_ALERTS_DISABLED",
  ROLE_ICONS: "ROLE_ICONS",
  ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE:
    "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE",
  ROLE_SUBSCRIPTIONS_ENABLED: "ROLE_SUBSCRIPTIONS_ENABLED",
  TICKETED_EVENTS_ENABLED: "TICKETED_EVENTS_ENABLED",
  VANITY_URL: "VANITY_URL",
  VERIFIED: "VERIFIED",
  VIP_REGIONS: "VIP_REGIONS",
  WELCOME_SCREEN_ENABLED: "WELCOME_SCREEN_ENABLED",
} as const;
export type GuildFeature = typeof GuildFeature[keyof typeof GuildFeature];

export const GuildMutableFeature = {
  COMMUNITY: "COMMUNITY",
  DISCOVERABLE: "DISCOVERABLE",
  INVITES_DISABLED: "INVITES_DISABLED",
  RAID_ALERTS_DISABLED: "RAID_ALERTS_DISABLED",
};
export type GuildMutableFeature =
  typeof GuildMutableFeature[keyof typeof GuildMutableFeature];

export enum GuildOnboardingMode {
  DEFAULT = 0,
  ADVANCED = 1,
}

export enum GuildOnboardingPromptType {
  MULTIPLE_CHOICE = 0,
  DROPDOWN = 1,
}

export interface UnavailableGuild {
  id: Snowflake;
  unavailable: true;
}

export type PartialGuild = Partial<Guild>;

export interface Guild {
  id: Snowflake;
  name: string;
  icon: string | null;
  icon_hash?: string | null;
  splash: string | null;
  discovery_splash: string | null;
  owner_id: Snowflake;
  rtc_region?: string | null;
  afk_channel_id: Snowflake | null;
  afk_timeout: number;
  widget_enabled?: boolean;
  widget_channel_id?: Snowflake | null;
  verification_level: GuildVerificationLevel;
  default_message_notifications: GuildMessageNotificationLevel;
  explicit_content_filter: GuildExplicitContentFilterLevel;
  roles: Role[];
  emojis: Emoji[];
  features: GuildFeature[];
  mfa_level: GuildMFALevel;
  application_id: Snowflake | null;
  system_channel_id: Snowflake | null;
  system_channel_flags: GuildSystemChannelFlag;
  rules_channel_id: Snowflake | null;
  max_presences?: number | null;
  max_members?: number;
  vanity_url_code: string | null;
  description: string | null;
  banner: string | null;
  premium_tier: GuildPremiumTier;
  premium_subscription_count?: number;
  preferred_locale: Locale;
  public_updates_channel_id?: Snowflake | null;
  max_video_channel_users?: number;
  max_stage_video_channel_users?: number;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  welcome_screen?: GuildWelcomeScreen;
  nsfw_level: GuildNSFWLevel;
  stickers?: Sticker[];
  premium_progress_bar_enabled: boolean;
  safety_alerts_channel_id: Snowflake | null;
}

export interface GuildPreview {
  id: Snowflake;
  name: string;
  icon: string | null;
  splash: string | null;
  discovery_splash: string | null;
  emojis: Emoji[];
  features: GuildFeature[];
  approximate_member_count: number;
  approximate_presence_count: number;
  description: string | null;
  stickers: Sticker[];
}

export interface GuildWidgetSettings {
  enabled: boolean;
  channel_id: Snowflake | null;
}

export interface GuildWidget {
  id: Snowflake;
  name: string;
  instant_invite: string | null;
  channels: PartialChannel[];
  members: PartialUser[];
  presence_count: number;
}

export interface Ban {
  reason: string | null;
  user: User;
}

export interface GuildWelcomeScreen {
  description: string | null;
  welcome_channels: GuildWelcomeScreenChannel[];
}

export interface GuildWelcomeScreenChannel {
  channel_id: Snowflake;
  description: string;
  emoji_id: Snowflake | null;
  emoji_name: string | null;
}

export interface GuildOnboarding {
  guild_id: Snowflake;
  prompts: GuildOnboardingPrompt[];
  default_channel_ids: Snowflake[];
  enabled: boolean;
  mode: GuildOnboardingMode;
}

export interface GuildOnboardingPrompt {
  id: Snowflake;
  type: GuildOnboardingPromptType;
  options: GuildOnboardingPromptOptions;
  title: string;
  single_select: boolean;
  required: boolean;
  in_onboarding: boolean;
}

export interface GuildOnboardingPromptOptions {
  id: Snowflake;
  channel_ids: Snowflake[];
  role_ids: Snowflake[];
  emoji: Emoji;
  title: string;
  description: string | null;
}
