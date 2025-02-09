import { ISO8601 } from "./global.ts";

export const EmbedType = {
  RICH: "rich",
  IMAGE: "image",
  VIDEO: "video",
  GIFV: "gifv",
  ARTICLE: "article",
  LINK: "link",
  POLL_RESULT: "poll_result"
} as const;
export type EmbedType = typeof EmbedType[keyof typeof EmbedType];

export interface Embed {
  title?: string;
  type?: EmbedType;
  description?: string;
  url?: string;
  timestamp?: ISO8601;
  color?: number;
  footer?: EmbedFooter;
  image?: EmbedImage;
  thumbnail?: EmbedThumbnail;
  video?: EmbedVideo;
  provider?: EmbedProvider;
  author?: EmbedAuthor;
  fields?: EmbedField[];
}

interface EmbedMedia {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface EmbedThumbnail extends EmbedMedia {}

export interface EmbedVideo extends EmbedMedia {}

export interface EmbedImage extends EmbedMedia {}

export interface EmbedProvider {
  name?: string;
  url?: string;
}

export interface EmbedAuthor {
  name: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface EmbedFooter {
  text: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}
