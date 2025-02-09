import { Activity, StatusType } from "./activity.ts";

export interface Presence {
  since: number | null;
  activities: Activity[];
  status: StatusType;
  afk: boolean;
}
