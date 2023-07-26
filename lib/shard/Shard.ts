import { color, EventEmitter } from "../../deps.ts";
import {
  GatewayDispatchPayload,
  GatewayDispatchReceiveEventMap,
  GatewayHeartbeatPayload,
  GatewayIdentifyPayload,
  GatewayPayload,
  GatewayResumePayload,
} from "../types/gateway.ts";
import {
  ShardEmitMap,
  ShardOptions,
  ShardRestartOptions,
  ShardState,
} from "../types/shard.ts";
import Logger from "../util/Logger.ts";
import { clamp } from "../util/misc.ts";
import { GatewayOpcode } from "../types/codes.ts";
import HeartbeatManager from "./HeartbeatManager.ts";

export default class Shard extends EventEmitter<ShardEmitMap> {
  #ws!: WebSocket;
  #logger: Logger;
  #hb: HeartbeatManager;

  #state: ShardState = ShardState.STOPPED;

  #seq: number = 0;
  #sessionID: string = "";
  #resumeURL: string = "";

  options: ShardOptions;

  constructor(logger: Logger, options: ShardOptions) {
    super();

    this.options = {
      ...options,
      largeThreshold: clamp(options.largeThreshold, 50, 250),
      compression: options.compression || "none",
    };

    this.#logger = logger.withModule(`SHARD ${options.sharding.shardNum}`);
    this.#hb = new HeartbeatManager(this);

    Deno.addSignalListener("SIGINT", () => {
      this.stop(1000);
    });
  }

  start() {
    const ws = this.#ws = new WebSocket(
      this.#resumeURL || this.options.gatewayURL,
    );

    ws.addEventListener("open", this.#onConnect.bind(this));
    ws.addEventListener("close", this.#onDisconnect.bind(this));
    ws.addEventListener("error", this.#onError.bind(this));
    ws.addEventListener("message", this.#onMessage.bind(this));
  }

  restart(options?: ShardRestartOptions) {
    const resume = options?.resume || false;

    this.stop();

    if (!resume) {
      this.#reset();
    }

    this.start();
  }

  stop(code: number = 3000) {
    if (this.#state === ShardState.STARTED) {
      this.#ws.close(code, "");
    }
  }

  #reset() {
    this.#seq = 0;
    this.#sessionID = "";
    this.#resumeURL = "";
  }

  send(data: any) {
    this.#ws.send(JSON.stringify(data));
  }

  #onConnect() {
    this.#state = ShardState.STARTED;

    this.#logger.check("Connected");
  }

  #onDisconnect(ev: CloseEventInit) {
    this.#state = ShardState.STOPPED;
    this.#hb.stop();

    this.#logger.cross(`Disconnected (${ev.code})`);

    if (ev.code?.toString().startsWith("1")) {
      return this.#reset();
    }

    switch (ev.code) {
      case undefined:
      case 4000: // unknown err
      case 4001: // unknown opcode
      case 4002: // decode err
      case 4003: // not authed
      case 4005: // already authed
      case 4008: { // rate limited
        this.restart({ resume: true });
        break;
      }
      case 4007: // invalid seq
      case 4009: { // session time out
        this.restart();
        break;
      }
      case 4004: // auth failed
      case 4010: // invalid shard
      case 4011: // sharding required
      case 4012: // invalid api version
      case 4013: // invalid intent(s)
      case 4014: // disallowed intent(s)
      default:
        break;
    }
  }

  #onError(ev: ErrorEventInit) {
    this.#state = ShardState.ERRORED;

    this.#logger.error(ev);

    throw ev.error;
  }

  #onMessage(ev: MessageEvent<string>) {
    const payload = JSON.parse(ev.data) as GatewayPayload;

    switch (payload.op) {
      case GatewayOpcode.HELLO: {
        this.#logger.received("Hello");
        this.#hb.start(payload.d.heartbeat_interval);
        this.#sessionID ? this.sendResume() : this.sendIdentify();
        break;
      }
      case GatewayOpcode.RECONNECT: {
        this.#logger.received("Reconnect");
        this.restart({ resume: true });
        break;
      }
      case GatewayOpcode.INVALID_SESSION: {
        this.#logger.received("Invalid Session");
        this.restart({ resume: payload.d });
        break;
      }
      case GatewayOpcode.HEARTBEAT: {
        this.#hb.tick();
        this.#logger.received("Heartbeat");
        break;
      }
      case GatewayOpcode.HEARTBEAT_ACK: {
        this.#hb.ack();
        this.#logger.received(`Heartbeat ACK (${this.latency}ms)`);
        break;
      }
      case GatewayOpcode.DISPATCH: {
        this.#onDispatch(payload);
        break;
      }
      default: {
        this.#logger.moduleInfo(
          `${color.brightYellow("Opcode")} ${
            color.green(GatewayOpcode[payload.op])
          }`,
        );
        break;
      }
    }
  }

  #onDispatch(
    payload: GatewayDispatchPayload<
      GatewayDispatchReceiveEventMap,
      keyof GatewayDispatchReceiveEventMap
    >,
  ) {
    this.#seq = payload.s;

    switch (payload.t) {
      case "READY": {
        this.#logger.received("Ready");
        this.#sessionID = payload.d.session_id;
        this.#resumeURL = payload.d.resume_gateway_url;
        console.log(payload.d);
        break;
      }
      default: {
        this.#logger.moduleInfo(
          `${color.yellow("Event")} ${color.green(payload.t)}`,
        );
        break;
      }
    }
  }

  sendIdentify() {
    const { token, intents, sharding, largeThreshold, compression, presence } =
      this.options;

    const data: GatewayIdentifyPayload = {
      op: GatewayOpcode.IDENTIFY,
      d: {
        token,
        intents,
        presence,
        shard: [sharding.shardNum, sharding.numShards],
        properties: {
          os: Deno.build.os,
          browser: "Noct",
          device: "Noct",
        },
        compress: compression === "zlib-stream",
        large_threshold: largeThreshold,
      },
    };

    this.send(data);

    this.#logger.sent("Identify");
  }

  sendResume() {
    const data: GatewayResumePayload = {
      op: GatewayOpcode.RESUME,
      d: {
        token: this.options.token,
        session_id: this.#sessionID,
        seq: this.#seq,
      },
    };

    this.send(data);

    this.#logger.sent("Resume");
  }

  sendHeartbeat() {
    const data: GatewayHeartbeatPayload = {
      op: GatewayOpcode.HEARTBEAT,
      d: this.#seq || null,
    };

    this.send(data);

    this.#logger.sent("Heartbeat");
  }

  get state() {
    return this.#state;
  }

  get latency() {
    return this.#hb.latency;
  }
}
