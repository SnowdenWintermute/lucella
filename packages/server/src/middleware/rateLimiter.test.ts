import { Application } from "express";
import request from "supertest";
import {
  ErrorMessages,
  ONE_SECOND,
  perIpEnforcementWindowTime,
  perIpFixedWindowCounterLimit,
  perIpFixedWindowCounterTime,
  perIpSlidingWindwRateLimit,
  UsersRoutePaths,
} from "../../../common";
import signTokenAndCreateSession from "../controllers/utils/signTokenAndCreateSession";
import UserRepo from "../database/repos/users";
import PGContext from "../utils/PGContext";
import { wrappedRedis } from "../utils/RedisContext";
import { responseBodyIncludesCustomErrorMessage } from "../utils/test-utils";
import { TEST_USER_EMAIL } from "../utils/test-utils/consts";
import setupExpressRedisAndPgContextAndOneTestUser from "../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";

describe("getMeHandler", () => {
  let context: PGContext | undefined;
  let app: Application | undefined;
  beforeAll(async () => {
    const { pgContext, expressApp } = await setupExpressRedisAndPgContextAndOneTestUser();
    context = pgContext;
    app = expressApp;
  });

  beforeEach(async () => {
    const removed = await wrappedRedis.context!.removeAllKeys();
    console.log("redis keys removed before test: ", removed[1]);
  });

  afterAll(async () => {
    if (context) await context.cleanup();
    const removed = await wrappedRedis.context!.cleanup();
    console.log("redis keys removed in test cleanup: ", removed[1]);
  });

  // save the real Date.now() function because we are going to globally overwrite it temporarily to "time travel"
  const realDateNow = Date.now.bind(global.Date);

  function sendDateNowFurtherAhead(milliseconds: number) {
    global.Date.now = jest.fn(() => realDateNow() + milliseconds);
    console.log(
      `Date.now currently ahead by: ${milliseconds}, ${
        (milliseconds - (milliseconds % perIpEnforcementWindowTime)) / perIpEnforcementWindowTime
      } perIpEnforcementWindowTime and ${(milliseconds % perIpEnforcementWindowTime) / perIpFixedWindowCounterTime} perIpFixedWindowCounterTime`
    );
    return milliseconds;
  }

  it("limits the number of combined requests on all routes behind this middleware by ip address", async () => {
    const user = await UserRepo.findOne("email", TEST_USER_EMAIL);
    const { accessToken } = await signTokenAndCreateSession(user);

    let numReqsInThisSlidingWindow = 0;
    let millisecondsIntoTheFutureTravelled = 0;

    const allowedReqPromises = [];

    // call a rate limited route until just under/to the fixed window limit
    for (let i = perIpFixedWindowCounterLimit; i > 0; i -= 1) {
      allowedReqPromises.push(
        request(app)
          .get(`/api${UsersRoutePaths.ROOT}`)
          .set("Cookie", [`access_token=${accessToken}`])
      );
    }
    const values = await Promise.all(allowedReqPromises);
    values.forEach((response) => {
      expect(response.status).toBe(200);
      numReqsInThisSlidingWindow += 1;
    });
    // this request should be over the limit for the fixed window,
    // even though it is a different route path it is behind the same rate limiting middleware
    const response = await request(app)
      .put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ACCOUNT_DELETION}`)
      .set("Cookie", [`access_token=${accessToken}`]);
    numReqsInThisSlidingWindow += 1;

    console.log(response.body);
    expect(response.status).toBe(429);
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.RATE_LIMITER.REQUESTING_TOO_QUICKLY)).toBeTruthy();

    // jump forward in time until fixed window counter time is over and the req should now work again
    millisecondsIntoTheFutureTravelled = sendDateNowFurtherAhead(perIpFixedWindowCounterTime);

    const responseThatShouldNotBeLimited = await request(app)
      .get(`/api${UsersRoutePaths.ROOT}`)
      .set("Cookie", [`access_token=${accessToken}`]);
    numReqsInThisSlidingWindow += 1;
    expect(responseThatShouldNotBeLimited.status).toBe(200);

    // now do a series of time jumps to reach (but not exceed) the sliding window limit without tripping the fixed window counters
    console.log("number of reqs before starting: ", numReqsInThisSlidingWindow);
    const timeTravelledAtStartOfSlidingWindowLimitTest = millisecondsIntoTheFutureTravelled;
    while (numReqsInThisSlidingWindow < perIpSlidingWindwRateLimit) {
      millisecondsIntoTheFutureTravelled = sendDateNowFurtherAhead(perIpFixedWindowCounterTime + millisecondsIntoTheFutureTravelled);

      let numberOfRequestsToSend: number;
      // important if the fixed window counters limit doesn't divide evenly into the sliding window limit
      if (numReqsInThisSlidingWindow + perIpFixedWindowCounterLimit <= perIpSlidingWindwRateLimit) numberOfRequestsToSend = perIpFixedWindowCounterLimit;
      else numberOfRequestsToSend = perIpSlidingWindwRateLimit - numReqsInThisSlidingWindow;

      const currentBatchOfRequestPromises = [];
      for (let i = numberOfRequestsToSend; i > 0; i -= 1) {
        currentBatchOfRequestPromises.push(
          request(app)
            .get(`/api${UsersRoutePaths.ROOT}`)
            .set("Cookie", [`access_token=${accessToken}`])
        );
      }
      // eslint-disable-next-line no-await-in-loop
      const currentBatchResponses = await Promise.all(currentBatchOfRequestPromises);
      currentBatchResponses.forEach((currResponse) => {
        expect(currResponse.status).toBe(200);
      });
      numReqsInThisSlidingWindow += numberOfRequestsToSend;
    }

    console.log("currNumReqs: ", numReqsInThisSlidingWindow);

    // this next request should now be over the sliding window limit
    const slidingWindowLimitedResponse = await request(app)
      .get(`/api${UsersRoutePaths.ROOT}`)
      .set("Cookie", [`access_token=${accessToken}`]);
    numReqsInThisSlidingWindow += 1;
    expect(slidingWindowLimitedResponse.status).toBe(429);
    expect(responseBodyIncludesCustomErrorMessage(slidingWindowLimitedResponse, ErrorMessages.RATE_LIMITER.TOO_MANY_REQUESTS)).toBeTruthy();

    // wait for the sliding window's enforcement window plus one fixed window length becasue we enforce
    // for one extra fixed window's length if the current timestamp isn't divisible by the fixed window interval
    console.log("timeTravelledAtStartOfSlidingWindowLimitTest: ", timeTravelledAtStartOfSlidingWindowLimitTest / ONE_SECOND);
    console.log("distance to next window: ", (perIpEnforcementWindowTime + timeTravelledAtStartOfSlidingWindowLimitTest) / ONE_SECOND);
    millisecondsIntoTheFutureTravelled = sendDateNowFurtherAhead(perIpEnforcementWindowTime + timeTravelledAtStartOfSlidingWindowLimitTest - 4000);

    const responseAfterWaiting = await request(app)
      .get(`/api${UsersRoutePaths.ROOT}`)
      .set("Cookie", [`access_token=${accessToken}`]);
    numReqsInThisSlidingWindow += 1;
    console.log(responseAfterWaiting.body);
    expect(responseAfterWaiting.status).toBe(200);

    // reset Date.now() to it's original value and return to our home timeline
    global.Date.now = realDateNow;
  });
});
