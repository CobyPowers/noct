class Lock {
  queue: Promise<void>[] = [];

  with(callback: () => void | Promise<void>) {

  }

  acquire() {

  }

  release() {

  }
}

const test = (num: number): Promise<void> => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      console.log(`This is promise #${num}!`);
      res();
    }, Math.random() * 5000);
  });
}

for (let i = 1; i < 6; i++) {
  test(i);
}

const lock = new Lock();

const release = await lock.aquire();


release()