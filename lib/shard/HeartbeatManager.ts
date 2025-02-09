import { ShardState } from "../types/shard.ts";
import Shard from "./Shard.ts";

export default class HeartbeatManager {
  #shard: Shard;

  #loop: number = 0; // main heartbeat tick loop
  #setupLoop: number = 0; // initial heartbeat tick loop with jitter

  #acked: boolean = false;
  #interval: number = 0;
  #tickTime: number = 0;
  #ackTime: number = 0;

  constructor(shard: Shard) {
    this.#shard = shard;
  }

  tick(initial: boolean = false) {
    if (this.#shard.state !== ShardState.STARTED) {
      return this.stop();
    }

    if (!initial && this.#acked === false) {
      this.#shard.stop();
      return this.stop();
    }

    this.#shard.sendHeartbeat();

    this.#tickTime = Date.now();
    this.#acked = false;
  }

  #setup(interval: number) {
    this.#setupLoop = setTimeout(() => {
      this.tick(true);
      this.#loop = setInterval(() => this.tick(), interval);
    }, interval * Math.random());
  }

  ack() {
    this.#ackTime = Date.now();
    this.#acked = true;
  }

  start(interval: number) {
    this.#interval = interval;

    this.#setup(interval);
  }

  stop() {
    clearInterval(this.#loop);
    this.#loop = 0;

    clearTimeout(this.#setupLoop);
    this.#setupLoop = 0;

    this.#acked = false;
    this.#tickTime = 0;
    this.#ackTime = 0;
  }

  reset() {
    this.stop();

    this.#interval = 0;
  }

  get interval(): number {
    return this.interval;
  }

  get latency(): number {
    return this.#ackTime - this.#tickTime || NaN;
  }
}
