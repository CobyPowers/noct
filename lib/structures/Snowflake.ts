import { Snowflake as ISnowflake } from '../types/global.ts';

export default class Snowflake {
  id: number;

  constructor(id: ISnowflake | number) {
    this.id = Number.isInteger(id) 
      ? <number>id 
      : parseInt(<string>id);
  }

  getTimestamp(): number {
    return (this.id / 4194304) + 1420070400000;
  }

  getTimestampDate(): Date {
    return new Date(this.getTimestamp());
  }

  getWorkerID(): number {
    return (this.id / 131072) & 0x3E0000;
  }

  getProcessID(): number {
    return (this.id / 4096) & 0x1F000;
  }

  getIncrement(): number {
    return this.id & 0xFFF;
  }
}