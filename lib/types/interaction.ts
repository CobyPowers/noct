import { Snowflake } from "./global.ts";

export interface Interaction {
  id: Snowflake;
  application_id: Snowflake;
  type: InteractionType;
  data;
}
