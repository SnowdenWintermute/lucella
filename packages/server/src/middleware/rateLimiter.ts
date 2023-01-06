/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
import { NextFunction, Request, Response } from "express";
import { ONE_MINUTE, ONE_SECOND } from "../../../common";
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
    const now = +new Date();
    const currentCounterIntervalTimestamp = now - (now % counterFixedWindowMs);

    async function updateRateCountersAndDetermineLimit(key: string) {
      const keyWithRouteName = key + routeName;
      const requestsInCurrentCounter = await context!.hIncrBy(keyWithRouteName, currentCounterIntervalTimestamp.toString(), 1);
      await context!.expire(keyWithRouteName, slidingWindowMs / ONE_SECOND);
      const slidingWindowCounters = await context!.hGetAll(keyWithRouteName);
      // determine if the fixed window counter limit has been reached
      if (requestsInCurrentCounter > counterLimit) {
        console.log(`too many requests in the last ${counterFixedWindowMs / ONE_SECOND} seconds`);
        return next([new CustomError("Too many reqs", 429)]);
      }
      // otherwise count up all the requests in the sliding window

      console.log(`slidingWindowCounters for ${keyWithRouteName}: `);
      let totalReqsInWindow = 0;
      const entries = Object.entries(slidingWindowCounters);
      entries.forEach(([key, value]) => {
        console.log(key, value);
        const thisCounterTimestamp = parseInt(key, 10);
        // add time of one counterInterval whenever the current timestamp isn't divisible by the sliding window interval otherwise
        // it is possible to exceed the sliding window rate limit
        const window = now % counterFixedWindowMs === 0 ? slidingWindowMs : slidingWindowMs + counterFixedWindowMs;
        if (now - thisCounterTimestamp > window) context!.hDel(keyWithRouteName, key);
        else {
          const reqsInThisCounter = parseInt(value, 10);
          totalReqsInWindow += reqsInThisCounter;
          // determine if request should be allowed or denied
          if (totalReqsInWindow > windowLimit) {
            console.log(`too many requests in the last ${slidingWindowMs / ONE_MINUTE} minutes`);
            next([new CustomError("Too many reqs", 429)]);
          }
        }
      });

      console.log(`Total Reqs in last ${slidingWindowMs / 60000} minutes: ${totalReqsInWindow}`);
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
