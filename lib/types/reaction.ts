import { PartialEmoji } from './emoji.ts';

export interface Reaction {
  count: number;
  count_details: ReactionCountDetails;
  me: boolean;
  me_burst: boolean;
  emoji: PartialEmoji;
  burst_colors: string[];
}

export interface ReactionCountDetails {
  burst: number;
  normal: string;
}