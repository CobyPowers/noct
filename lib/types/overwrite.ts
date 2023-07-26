import { Snowflake } from "./global.ts";

export enum OverwriteType {
  ROLE = 0,
  MEMBER = 1,
}

export interface Overwrite {
  id: Snowflake;
  type: OverwriteType;
  allow: string;
  deny: string;
}
