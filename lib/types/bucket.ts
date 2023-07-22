import { LogLevel } from "./logger.ts";

export interface BucketOptions extends BucketInfo {}

export interface BucketInfo {
  limit: number;
  remaining: number;
  resetEpoch: number;
  resetSec: number;
}