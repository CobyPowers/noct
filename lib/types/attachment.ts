import { Snowflake } from "./global.ts";

export enum AttachmentFlag {
  IS_REMIX = 1 << 2,
}

export interface Attachment {
  id: Snowflake;
  filename: string;
  description?: string;
  content_type?: string;
  size: number;
  url: string;
  proxy_url: string;
  height?: number | null;
  width?: number | null;
  ephemeral?: boolean;
  duration_secs?: number;
  waveform?: string;
  flags?: AttachmentFlag;
}
