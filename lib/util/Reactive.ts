import { Deferred, deferred } from "../../deps.ts";

export default class Reactive<T> {
  #value: T;
  #waiters: Map<Deferred<void>, T>;

  constructor(defaultValue: T) {
    this.#value = defaultValue;
    this.#waiters = new Map();
  }

  async waitUntil(value: T): Promise<void> {
    const waiter = deferred<void>();
    this.#waiters.set(waiter, value);
    
    await Promise.all([waiter]);
  }

  update(value: T): T {
    this.#value = value;

    for (const [k, v] of this.#waiters.entries()) {
      if (v === value)
        k.resolve();
    }

    return value;
  }

  get value(): T {
    return this.#value;
  }
}