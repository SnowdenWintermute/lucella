import { createClient, RedisClientType } from "redis";
import { randomBytes } from "crypto";

export default class RedisContext {
  keyPrefix: string;
  redisClient: RedisClientType;
  isOpen = false;
  static async build() {
    const keyPrefix = randomBytes(4).toString("hex");
    return new RedisContext(keyPrefix);
  }
  constructor(keyPrefix: string) {
    this.keyPrefix = keyPrefix;
  }
  connect() {
    this.redisClient ==
      createClient({
        url: process.env.REDIS_URL,
      });
    this.isOpen = true;
  }
  disconnect() {
    this.redisClient.disconnect();
    this.isOpen = false;
  }
  set(key: string, value: any) {
    this.redisClient.set(this.keyPrefix + key, value);
  }
  get(key: string) {
    this.redisClient.get(this.keyPrefix + key);
  }
  del(key: string) {
    this.redisClient.del(this.keyPrefix + key);
  }
  async getByPattern() {
    let currentCursor;
    let keysToReturn: string[] = [];
    while (currentCursor !== 0) {
      const { cursor, keys } = await this.redisClient.scan(0, { MATCH: this.keyPrefix });
      keysToReturn = [...keysToReturn, ...keys];
      currentCursor = cursor;
    }
    return keysToReturn;
  }
  async unlink(keys: string[]) {
    return await this.redisClient.unlink(keys);
  }
}
