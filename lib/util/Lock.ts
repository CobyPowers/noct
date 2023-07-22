import { Deferred, deferred } from "../../deps.ts";

export default class Lock {
  #queue: Deferred<void>[] = [];

  async with(callback: () => void | Promise<void>): Promise<void> {
    await this.acquire();

    try {
      await (callback() ?? Promise.resolve());
    } finally {
      this.release();
    }
  }

  async acquire(): Promise<void> {
    const queue = [...this.#queue];

    this.#queue.push(deferred());

    if (queue.length)
      await Promise.all(queue);
  }

  async waitForAll(): Promise<void> {
    const queue = this.#queue;

    if (queue.length)
      await Promise.all(queue);
  }

  release(): void {
    const waiter = this.#queue.shift();

    if (waiter) {
      waiter.resolve();
    } else {
      throw new Error("The lock cannot be released if it was never acquired.");
    }
  }

  locked(): boolean {
    return !!this.#queue.length;
  }
}