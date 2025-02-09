import { DefaultReaction } from './emoji.ts';
import { ISO8601, Snowflake } from './global.ts';
import { Member } from './member.ts';
import { Overwrite } from './overwrite.ts';
import { User } from './user.ts';
import { VoiceRegion } from './voice.ts';

export enum ChannelType {
  TEXT = 0, // TextChannel
  PRIVATE = 1, // PrivateChannel
  VOICE = 2, // VoiceChannel
  GROUP = 3, // GroupChannel
  CATEGORY = 4, // CategoryChannel
  ANNOUNCEMENT = 5, // AnnouncementChannel
  THREAD_ANNOUNCEMENT = 10, // ThreadChannel
  PUBLIC_THREAD = 11, // ThreadChannel
  PRIVATE_THREAD = 12, // ThreadChannel
  STAGE = 13, // StageChannel
  DIRECTORY = 14, // DirectoryChannel
  FORUM = 15, // ForumChannel (contains threads)
}

export enum ChannelFlag {
  PINNED = 1 << 1,
  REQUIRE_TAG = 1 << 4,
}

export enum VideoQualityMode {
  AUTO = 1,
  FULL = 2,
}

export enum ForumSortOrderType {
  LATEST_ACTIVITY,
  CREATION_DATE,
}

export enum ForumLayoutType {
  NOT_SET = 0,
  LIST_VIEW = 1,
  GALLERY_VIEW = 2,
}

export type Channel =
  | TextChannel
  | PrivateChannel
  | VoiceChannel
  | GroupChannel
  | CategoryChannel
  | AnnouncementChannel
  | ThreadChannel
  | StageChannel
  | DirectoryChannel
  | ForumChannel;

export interface GlobalChannel {
  id: Snowflake;
  type: ChannelType;
  guild_id?: Snowflake;
  position?: number;
  permission_overwrites?: Overwrite[];
  name?: string | null;
  topic?: string | null;
  nsfw?: boolean;
  last_message_id?: Snowflake | null;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  recipients?: User[];
  icon?: string | null;
  owner_id?: Snowflake;
  application_id?: Snowflake;
  managed?: boolean;
  parent_id?: Snowflake | null;
  last_pin_timestamp?: ISO8601 | null;
  rtc_region?: VoiceRegion | null;
  video_quality_mode?: VideoQualityMode;
  message_count?: number;
  member_count?: number;
  thread_metadata?: ThreadMetadata;
  member?: ThreadMember;
  default_auto_archive_duration?: number;
  permissions?: string;
  flags?: ChannelFlag;
  total_message_sent?: number;
  available_tags?: ForumTag[]; // TODO: ForumChannelTag or ForumTag (?)
  applied_tags?: Snowflake[];
  default_reaction_emoji?: DefaultReaction | null;
  default_thread_rate_limit_per_user?: number;
  default_sort_order?: ForumSortOrderType | null;
  default_forum_layout?: ForumLayoutType;
}

export interface FollowedChannel {
  channel_id: Snowflake;
  webhook_id: Snowflake;
}

export interface MentionedChannel {
  id: Snowflake;
  guild_id: Snowflake;
  type: ChannelType;
  name: string;
}

export interface PartialChannel {
  id: Snowflake;
  name: string;
}

interface BaseChannel {
  id: Snowflake;
  type: ChannelType;
  flags: ChannelFlag;
}

interface GuildChannel extends BaseChannel {
  guild_id: Snowflake;
  parent_id: Snowflake | null;
  position: number;
  permission_overwrites: Overwrite[];
  name: string;
}

interface NonGuildChannel extends BaseChannel {
  last_message_id: Snowflake | null;
  recipients: User[];
  last_pin_timestamp?: ISO8601;
}

interface GuildTextChannel extends GuildChannel {
  nsfw: boolean;
  topic: string | null;
  rate_limit_per_user: number;
  last_message_id: Snowflake | null;
  last_pin_timestamp?: ISO8601;
  default_auto_archive_duration?: number;
}

interface GuildVoiceChannel extends GuildChannel {
  nsfw: boolean;
  bitrate: number;
  user_limit: number;
  rtc_region: VoiceRegion | null;
  last_message_id: Snowflake | null;
  video_quality_mode?: VideoQualityMode;
}

export interface TextChannel extends GuildTextChannel {
  type: ChannelType.TEXT;
}

export interface AnnouncementChannel extends GuildTextChannel {
  type: ChannelType.ANNOUNCEMENT;
}

export interface VoiceChannel extends GuildVoiceChannel {
  type: ChannelType.VOICE;
}

export interface PrivateChannel extends NonGuildChannel {
  type: ChannelType.PRIVATE;
}

export interface GroupChannel extends NonGuildChannel {
  type: ChannelType.GROUP;
  icon: string | null;
  owner_id: Snowflake;
}

export interface CategoryChannel extends GuildChannel {
  type: ChannelType.CATEGORY;
  parent_id: null;
}

export interface ThreadChannel extends
  Omit<
    GuildTextChannel,
    | 'position'
    | 'permission_overwrites'
    | 'nsfw'
    | 'topic'
    | 'default_auto_archive_duration'
  > {
  type:
    | ChannelType.PUBLIC_THREAD
    | ChannelType.PRIVATE_THREAD
    | ChannelType.THREAD_ANNOUNCEMENT;
  owner_id: Snowflake;
  message_count: number;
  member_count: number;
  total_message_sent: number;
  thread_metadata: ThreadMetadata;
  applied_tags?: Snowflake[];
  member?: ThreadMember; // only available in HTTP requests
}

export interface ThreadMetadata {
  archived: boolean;
  auto_archive_duration: number;
  archive_timestamp: ISO8601;
  locked: boolean;
  invitable?: boolean;
  create_timestamp?: ISO8601 | null;
}

export interface ThreadMember {
  id?: Snowflake;
  user_id?: Snowflake;
  join_timestamp: ISO8601;
  flags?: number;
  member?: Member;
}

export interface StageChannel extends GuildVoiceChannel {
  type: ChannelType.STAGE;
  topic: string | null;
}

export interface DirectoryChannel extends BaseChannel {
  // TODO: fill out the DirectoryChannel
}

export interface ForumChannel
  extends Omit<GuildTextChannel, 'last_pin_timestamp'> {
  type: ChannelType.FORUM;
  available_tags: ForumTag[];
  default_sort_order: ForumSortOrderType | null;
  default_forum_layout: ForumLayoutType;
  default_auto_archive_duration?: number;
  default_reaction_emoji?: DefaultReaction | null;
  default_thread_rate_limit_per_user?: number;
}

export interface ForumTag {
  id: Snowflake;
  name: string;
  moderated: boolean;
  emoji_id: Snowflake | null;
  emoji_name: Snowflake | null;
}
