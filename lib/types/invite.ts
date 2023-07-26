import { PartialApplication } from "./application.ts";
import { PartialChannel } from "./channel.ts";
import { ISO8601 } from "./global.ts";
import { PartialGuild } from "./guild.ts";
import { User } from "./user.ts";

export enum InviteTargetType {
  STREAM = 1,
  EMBEDDED_APPLICATION = 2,
}

export interface Invite {
  code: string;
  guild?: PartialGuild;
  channel: PartialChannel | null;
  inviter?: User;
  target_type?: InviteTargetType;
  target_user?: User;
  target_application?: PartialApplication;
  approximate_presence_count?: number;
  approximate_member_count?: number;
  expires_at?: ISO8601 | null;
  stage_instance?: InviteStageInstance;
  guild_scheduled_event?: GuildScheduledEvent;
}

export interface InviteMetadata {
  uses: number;
  max_uses: number;
  max_age: number;
  temporary: boolean;
  created_at: ISO8601;
}

export interface InviteStageInstance {
  members: PartialMember[];
  participant_count: number;
  speaker_count: number;
  topic: string;
}
