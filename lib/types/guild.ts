import { Snowflake } from "./global.ts";

export interface UnavailableGuild {
  id: Snowflake;
  unavailable: true;
}
