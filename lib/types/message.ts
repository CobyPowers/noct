import { PartialApplication } from "./application.ts";
import { Attachment } from "./attachment.ts";
import { MentionedChannel, ThreadChannel } from "./channel.ts";
import { Embed } from "./embed.ts";
import { PartialEmoji, Reaction } from "./emoji.ts";
import { ISO8601, Snowflake } from "./global.ts";
import { RoleSubscriptionData } from "./role.ts";
import { User } from "./user.ts";

export enum MessageType {
  DEFAULT = 0,
  RECIPIENT_ADD = 1,
  RECIPIENT_REMOVE = 2,
  CALL = 3,
  CHANNEL_NAME_CHANGE = 4,
  CHANNEL_ICON_CHANGE = 5,
  CHANNEL_PINNED_MESSAGE = 6,
  USER_JOIN = 7,
  GUILD_BOOST = 8,
  GUILD_BOOST_TIER_1 = 9,
  GUILD_BOOST_TIER_2 = 10,
  GUILD_BOOST_TIER_3 = 11,
  CHANNEL_FOLLOW_ADD = 12,
  GUILD_DISCOVERY_DISQUALIFIED = 14,
  GUILD_DISCOVERY_REQUALIFIED = 15,
  GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
  GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 17,
  THREAD_CREATED = 18,
  REPLY = 19,
  CHAT_INPUT_COMMAND = 20,
  THREAD_STARTER_MESSAGE = 21,
  GUILD_INVITE_REMINDER = 22,
  CONTEXT_MENU_COMMAND = 23,
  AUTO_MODERATION_ACTION = 24,
  ROLE_SUBSCRIPTION_PURCHASE = 25,
  INTERACTION_PREMIUM_UPSELL = 26,
  STAGE_START = 27,
  STAGE_END = 28,
  STAGE_SPEAKER = 29,
  STAGE_TOPIC = 31,
  GUILD_APPLICATION_PREMIUM_SUBSCRIPTION = 32,
  GUILD_INCIDENT_ALERT_MODE_ENABLED = 36,
  GUILD_INCIDENT_ALERT_MODE_DISABLED = 37,
  GUILD_INCIDENT_REPORT_RAID = 38,
  GUILD_INCIDENT_REPORT_FALSE_ALARM = 39,
  PURCHASE_NOTIFICATION = 44,
  POLL_RESULT = 46
}

export enum MessageFlag {
  CROSSPOSTED = 1 << 0,
  IS_CROSSPOST = 1 << 1,
  SUPPRESS_EMBEDS = 1 << 2,
  SOURCE_MESSAGE_DELETED = 1 << 3,
  URGENT = 1 << 4,
  HAS_THREAD = 1 << 5,
  EPHEMERAL = 1 << 6,
  LOADING = 1 << 7,
  FAILED_TO_MENTION_SOME_ROLES_IN_THREAD = 1 << 8, // CONSIDER: changing this name to something less ass
  SUPPRESS_NOTIFICATIONS = 1 << 12,
  IS_VOICE_MESSAGE = 1 << 13,
}

export enum MessageActivityType {
  JOIN = 1,
  SPECTATE = 2,
  LISTEN = 3,
  JOIN_REQUEST = 5,
}

export enum MessageReferenceType {
  DEFAULT = 0,
  FORWARD = 1
}

export interface PartialMessage {
  content: string;
  timestamp: ISO8601;
  edited_timestamp: ISO8601 | null;
  mentions: User[];
  mention_roles: Snowflake[];
  attachments: Attachment[];
  embeds: Embed[];
  type: MessageType;
  flags?: MessageFlag;
  components?: MessageComponent[];
  sticker_items?: StickerItem[];
  stickers?: Sticker[];
}

export interface Message {
  id: Snowflake;
  channel_id: Snowflake;
  author: User;
  content: string;
  timestamp: ISO8601;
  edited_timestamp: ISO8601 | null;
  tts: boolean;
  mention_everyone: boolean;
  mentions: User[];
  mention_roles: Snowflake[];
  mention_channels?: MentionedChannel[];
  attachments: Attachment[];
  embeds: Embed[];
  reactions?: Reaction[];
  nonce?: number | string;
  pinned: boolean;
  webhook_id?: Snowflake;
  type: MessageType;
  activity?: MessageActivity;
  application?: PartialApplication; // TODO: check if PartialApplication is valid structure
  application_id?: Snowflake;
  message_reference?: MessageReference;
  flags?: MessageFlag;
  referenced_message?: Message;
  interaction?: MessageInteraction;
  thread?: ThreadChannel;
  components?: MessageComponent[];
  sticker_items?: StickerItem[];
  stickers?: Sticker[];
  position?: number;
  role_subscription_data?: RoleSubscriptionData;
  resolved?: Resolved; // CONSIDER: rename this to something more "elegant"
  poll?: Poll;
  call?: MessageCall;
}

export interface MessageActivity {
  type: MessageActivityType;
  party_id?: string;
}

export interface ApplicationCommandInteractionMetadata { // CONSIDER: moving this to another file
  id: Snowflake;
  type: InteractionType;
  user: User;
  authorizing_integration_owners: any; // TODO: figure out what this structure is supposed to be
  original_response_message_id?: Snowflake;
  target_user?: User;
  target_message_id?: Snowflake;
}

export interface MessageComponentInteractionMetadata {
  id: Snowflake;
  type: InteractionType;
  user: User;
  authorizing_integration_owners: any; // TODO: figure out what this structure is supposed to be
  original_response_message_id?: Snowflake;
  interacted_message_id: Snowflake;
}

export interface ModalSubmitInteractionMetadata {
  id: Snowflake;
  type: InteractionType;
  user: User;
  authorizing_integration_owners: any; // TODO: figure out what this structure is supposed to be
  original_response_message_id?: Snowflake;
  triggering_interaction_metadata: ApplicationCommandInteractionMetadata | MessageComponentInteractionMetadata
}

export interface MessageCall {
  participants: Snowflake[];
  ended_timestamp?: ISO8601 | null;
}

export interface MessageReference {
  type?: MessageReferenceType;
  message_id?: Snowflake;
  channel_id?: Snowflake;
  guild_id?: Snowflake;
  fail_if_not_exists?: boolean;
}

export interface MessageSnapshot {
  message?: PartialMessage;
}

// export interface MessageInteraction {
//   id: Snowflake;
//   type: InteractionType;
//   name: string;
//   user: User;
//   member?: PartialMember;
// }