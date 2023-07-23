export { Nocular, HTTPMethod } from 'https://deno.land/x/nocular@v1.0.4/mod.ts';

export * as color from "https://deno.land/std@0.195.0/fmt/colors.ts";

export { deferred } from "https://deno.land/std@0.195.0/async/deferred.ts";
export type { Deferred } from "https://deno.land/std@0.195.0/async/deferred.ts";

export { EventEmitter } from "https://deno.land/x/event@2.0.1/mod.ts";

import { Foras } from "https://deno.land/x/foras@2.0.8/src/deno/mod.ts";
export { zlib, unzlib } from "https://deno.land/x/foras@2.0.8/src/deno/mod.ts";

Foras.initSyncBundledOnce();