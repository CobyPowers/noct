import { ISO8601, Snowflake } from "./global.ts";
import { User } from "./user.ts";

export enum MemberFlag {
  DID_REJOIN = 1 << 0,
  COMPLETED_ONBOARDING = 1 << 1,
  BYPASSES_VERIFICATION = 1 << 2,
  STARTED_ONBOARDING = 1 << 3,
}

export interface Member {
  user?: User;
  nick?: string | null;
  avatar?: string | null;
  roles: Snowflake[];
  joined_at: ISO8601;
  premium_since: ISO8601 | null;
  deaf: boolean;
  mute: boolean;
  flags: MemberFlag;
  pending?: boolean;
  permissions?: string;
  communication_disabled_until?: ISO8601 | null;
}
