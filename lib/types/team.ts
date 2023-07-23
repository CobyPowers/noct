import { Snowflake } from "./global.ts";

export enum TeamMembershipState {
  INVITED = 1,
  ACCEPTED = 2,
}

export interface Team {
  id: Snowflake;
  icon: string | null;
  name: string;
  members: TeamMember[];
  owner_user_id: Snowflake;
}

export interface TeamMember {
  membership_state: TeamMembershipState;
  permissions: string[];
  team_id: Snowflake;
  user: PartialUser;
}
