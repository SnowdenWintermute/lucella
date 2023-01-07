/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
import { NextFunction, Request, Response } from "express";
import { ErrorMessages, ONE_MINUTE, ONE_SECOND } from "../../../common";
import CustomError from "../classes/CustomError";
import { wrappedRedis } from "../utils/RedisContext";

export enum RateLimiterModes {
  USER,
  IP,
}

export default function createRateLimiterMiddleware(
  mode: RateLimiterModes,
  routeName = "",
  slidingWindowMs = ONE_MINUTE * 60,
  windowLimit = 100,
  counterFixedWindowMs = ONE_MINUTE,
  counterLimit = 15
) {
  // a sliding window of fixed window request counters
  return async function rateLimiter(req: Request, res: Response, next: NextFunction) {
    const { context } = wrappedRedis;
    // get the current fixed window counter timestamp
    const now = Date.now();
    const currentCounterIntervalTimestamp = now - (now % counterFixedWindowMs);

    async function updateRateCountersAndDetermineLimit(key: string) {
      const keyWithRouteName = key + routeName;
      const requestsInCurrentCounter = await context!.hIncrBy(keyWithRouteName, currentCounterIntervalTimestamp.toString(), 1);
      await context!.expire(keyWithRouteName, slidingWindowMs / ONE_SECOND);
      // determine if the fixed window counter limit has been reached
      if (requestsInCurrentCounter > counterLimit) {
        console.log(`too many requests in the last ${counterFixedWindowMs / ONE_SECOND} seconds`);
        return next([new CustomError(ErrorMessages.RATE_LIMITER.REQUESTING_TOO_QUICKLY, 429)]);
      }

      // otherwise count up all the requests in the sliding window
      const slidingWindowCounters = await context!.hGetAll(keyWithRouteName);
      let totalReqsInWindow = 0;
      // redis does not guarantee the order of hash fields so we sort them by [0] index (the key/timestamp) so we can stop the
      // loop when the limit is reached while ensuring we start counting from the oldest keys in the window and remove them
      const entries = Object.entries(slidingWindowCounters).sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10));

      // restrict window by one counterInterval whenever the current timestamp isn't divisible by the
      // fixed window interval otherwise it is possible to exceed the sliding window rate limit by the ammout of one counter's worth
      const window = now % counterFixedWindowMs === 0 ? slidingWindowMs : slidingWindowMs + counterFixedWindowMs;
      console.log("window: ", window / ONE_SECOND, now % counterFixedWindowMs);
      for (let i = 0; i < entries.length; i += 1) {
        const [key, value] = entries[i];
        const thisCounterTimestamp = parseInt(key, 10);
        if (now - window > thisCounterTimestamp) {
          console.log("deleting old counter: ", key);
          context!.hDel(keyWithRouteName, key);
        } else {
          const reqsInThisCounter = parseInt(value, 10);
          totalReqsInWindow += reqsInThisCounter;
          // determine if request should be allowed or denied
          if (totalReqsInWindow > windowLimit) {
            console.log(`denied request at ${totalReqsInWindow} on iteration ${i + 1}`);
            return next([new CustomError(ErrorMessages.RATE_LIMITER.TOO_MANY_REQUESTS, 429)]);
          }
        }
      }
    }

    if (mode === RateLimiterModes.USER) {
      const { user } = res.locals;
      if (!user) return console.error("tried to rate limit by user email but no user was passed");
      await updateRateCountersAndDetermineLimit(user.email);
    }
    if (mode === RateLimiterModes.IP) {
      const { ip } = req;
      await updateRateCountersAndDetermineLimit(ip);
    }

    next();
  };
}
