import { Snowflake } from "./global.ts";
import { User } from "./user.ts";

export interface PartialEmoji {
  id: Snowflake | null;
  name: string | null;
}

export interface Emoji extends PartialEmoji {
  roles?: Snowflake[];
  user?: User;
  require_colons?: boolean;
  managed?: boolean;
  animated?: boolean;
  available?: boolean;
}

export interface DefaultReaction {
  emoji_id: Snowflake | null;
  emoji_name: string | null;
}

export interface Reaction {
  count: number;
  me: boolean;
  emoji: PartialEmoji;
}
