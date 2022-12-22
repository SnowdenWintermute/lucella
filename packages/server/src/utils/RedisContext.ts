import { createClient, RedisClientType, SetOptions } from "redis";
import { randomBytes } from "crypto";

export class RedisContext {
  keyPrefix: string;
  redisClient: RedisClientType;

  static build(withPrefix?: boolean) {
    const keyPrefix = randomBytes(4).toString("hex");
    return new RedisContext(
      createClient({
        url: process.env.REDIS_URL,
      }),
      withPrefix ? keyPrefix : ""
    );
  }

  constructor(redisClient: RedisClientType, keyPrefix: string) {
    this.redisClient = redisClient;
    this.keyPrefix = keyPrefix;
    this.redisClient.on("error", (err) => console.log(err));
  }

  async connect() {
    await this.redisClient.connect();
    console.log(`redis client with ${this.keyPrefix ? `context ${this.keyPrefix}` : "vanilla context"} connected`);
  }
  async disconnect() {
    await this.redisClient.disconnect();
    console.log(`redis client with ${this.keyPrefix ? `context ${this.keyPrefix}` : "vanilla context"} disconnected`);
  }
  async set(key: string, value: any, options?: SetOptions | undefined) {
    await this.redisClient.set(this.keyPrefix + key, value, options);
  }
  async get(key: string) {
    return await this.redisClient.get(this.keyPrefix + key);
  }
  async del(key: string) {
    await this.redisClient.del(this.keyPrefix + key);
  }
  async getKeysByPrefix() {
    let currentCursor: number | undefined;
    let keysToReturn: string[] = [];
    while (currentCursor !== 0) {
      const { cursor, keys } = await this.redisClient.scan(currentCursor || 0, { MATCH: this.keyPrefix + "*", COUNT: 10 });
      keysToReturn = [...keysToReturn, ...keys];
      currentCursor = cursor;
    }
    return keysToReturn;
  }
  async unlink(keys: string[]) {
    if (keys.length) return await this.redisClient.unlink(keys);
  }
  async removeAllKeys() {
    const keysToRemove = await this.getKeysByPrefix();
    const numKeysRemoved = await this.unlink(keysToRemove);
  }
  async cleanup() {
    await this.removeAllKeys();
    await this.disconnect();
  }
}

export const wrappedRedis: { [client: string]: RedisContext | undefined } = {
  context: undefined,
};
