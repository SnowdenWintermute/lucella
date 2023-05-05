/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-shadow */

import { NextFunction, Request, Response } from "express";
import {
  ERROR_MESSAGES,
  ONE_MINUTE,
  ONE_SECOND,
  passwordResetEmailFixedWindowCounterLimit,
  passwordResetEmailFixedWindowCounterTime,
  passwordResetEmailSlidingWindowLimit,
  perIpFixedWindowCounterLimit,
  perIpFixedWindowCounterTime,
  perIpSlidingWindowLimit,
  perIpSlidingWindowTime,
  registrationFixedWindowCounterLimit,
  registrationFixedWindowCounterTime,
  registrationSlidingWindowLimit,
} from "../../../common";
import CustomError from "../classes/CustomError";
import { wrappedRedis } from "../utils/RedisContext";

export enum RateLimiterModes {
  USER,
  IP,
  GLOBAL,
}

export const rateLimiterDisabler = { rateLimiterDisabledForTesting: false };

export default function createRateLimiterMiddleware(
  mode: RateLimiterModes,
  label = "",
  slidingWindowMs = ONE_MINUTE * 60,
  windowLimit = 100,
  counterFixedWindowMs = ONE_MINUTE,
  counterLimit = 30,
  onCounterLimitReached = (next: NextFunction) => next([new CustomError(ERROR_MESSAGES.RATE_LIMITER.REQUESTING_TOO_QUICKLY, 429)]),
  onSlidingWindowLimitReached = (next: NextFunction) => next([new CustomError(ERROR_MESSAGES.RATE_LIMITER.TOO_MANY_REQUESTS, 429)])
) {
  // a sliding window of fixed window request counters
  return async function rateLimiter(req: Request, res: Response, next: NextFunction) {
    if (rateLimiterDisabler.rateLimiterDisabledForTesting) {
      console.log("rate limiter disabled"); // can be toggled by cypress task
      return next();
    }
    const { context } = wrappedRedis;
    // get the current fixed window counter timestamp
    const now = Date.now();
    const currentCounterIntervalTimestamp = now - (now % counterFixedWindowMs);

    async function updateRateCountersAndDetermineLimiting(key: string) {
      const keyWithLabel = key + label;
      const requestsInCurrentCounter = await context!.hIncrBy(keyWithLabel, currentCounterIntervalTimestamp.toString(), 1);
      await context!.expire(keyWithLabel, slidingWindowMs / ONE_SECOND);
      // determine if the fixed window counter limit has been reached
      if (requestsInCurrentCounter > counterLimit) {
        console.log(`too many requests in the last ${counterFixedWindowMs / ONE_SECOND} seconds`);
        return onCounterLimitReached(next);
      }

      // otherwise count up all the requests in the sliding window
      const slidingWindowCounters = await context!.hGetAll(keyWithLabel);
      let totalReqsInWindow = 0;
      // redis does not guarantee the order of hash fields so we sort them by [0] index (the key/timestamp) so we can stop the
      // loop when the limit is reached while ensuring we start counting from the oldest keys in the window and remove them
      const entries = Object.entries(slidingWindowCounters).sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10));

      // restrict window by one counterInterval whenever the current timestamp isn't divisible by the
      // fixed window interval otherwise it is possible to exceed the sliding window rate limit by the ammout of one counter's worth
      const window = now % counterFixedWindowMs === 0 ? slidingWindowMs : slidingWindowMs + counterFixedWindowMs;
      for (let i = 0; i < entries.length; i += 1) {
        const [key, value] = entries[i];
        const thisCounterTimestamp = parseInt(key, 10);
        if (now - window >= thisCounterTimestamp) context!.hDel(keyWithLabel, key);
        else {
          const reqsInThisCounter = parseInt(value, 10);
          totalReqsInWindow += reqsInThisCounter;
          // determine if request should be allowed or denied
          if (totalReqsInWindow > windowLimit) return onSlidingWindowLimitReached(next);
        }
      }
    }

    if (mode === RateLimiterModes.USER) {
      const { user } = res.locals;
      if (!user) return console.error("tried to rate limit by user email but no user was passed");
      await updateRateCountersAndDetermineLimiting(user.email);
    }
    if (mode === RateLimiterModes.IP) {
      const ip = req.ip ? req.ip : req.socket.remoteAddress;
      if (ip) await updateRateCountersAndDetermineLimiting(ip);
      else console.error("CUSTOM ERROR: No Ip found in ip rate limiter");
    }
    if (mode === RateLimiterModes.GLOBAL) {
      await updateRateCountersAndDetermineLimiting("GLOBAL_REQUESTS");
    }

    next();
  };
}

export const ipRateLimiter = createRateLimiterMiddleware(
  RateLimiterModes.IP,
  "",
  perIpSlidingWindowTime, // 30m
  perIpSlidingWindowLimit, // 50
  perIpFixedWindowCounterTime, // 30s
  perIpFixedWindowCounterLimit // 10
);

export const registrationIpRateLimiter = createRateLimiterMiddleware(
  RateLimiterModes.IP,
  "REGISTRATION",
  perIpSlidingWindowTime,
  registrationSlidingWindowLimit,
  registrationFixedWindowCounterTime,
  registrationFixedWindowCounterLimit
);

export const passwordResetEmailRequestIpRateLimiter = createRateLimiterMiddleware(
  RateLimiterModes.IP,
  "PASSWORD_RESET",
  perIpSlidingWindowTime,
  passwordResetEmailSlidingWindowLimit,
  passwordResetEmailFixedWindowCounterTime,
  passwordResetEmailFixedWindowCounterLimit
);
