import { Application } from "express";
import request from "supertest";
import {
  ErrorMessages,
  perIpSlidingWindowTime,
  perIpFixedWindowCounterLimit,
  perIpFixedWindowCounterTime,
  perIpSlidingWindowLimit,
  UsersRoutePaths,
} from "../../../common";
import signTokenAndCreateSession from "../controllers/utils/signTokenAndCreateSession";
import UserRepo from "../database/repos/users";
import PGContext from "../utils/PGContext";
import { wrappedRedis } from "../utils/RedisContext";
import { responseBodyIncludesCustomErrorMessage } from "../utils/test-utils";
import { TEST_USER_EMAIL } from "../utils/test-utils/consts";
import setupExpressRedisAndPgContextAndOneTestUser from "../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";

describe("rate limiter", () => {
  let context: PGContext | undefined;
  let app: Application | undefined;
  // save the real Date.now() function because we are going to globally overwrite it temporarily to "time travel"
  const realDateNow = Date.now.bind(global.Date);

  function setDateNowReturnValue(milliseconds: number) {
    global.Date.now = jest.fn(() => milliseconds);
    return milliseconds;
  }

  beforeAll(async () => {
    const { pgContext, expressApp } = await setupExpressRedisAndPgContextAndOneTestUser();
    context = pgContext;
    app = expressApp;
  });

  beforeEach(async () => {
    const removed = await wrappedRedis.context!.removeAllKeys();
    console.log("redis keys removed before test: ", removed[1]);
    // reset Date.now() to it's original value and return to our home timeline
    global.Date.now = realDateNow;
  });

  afterAll(async () => {
    if (context) await context.cleanup();
    const removed = await wrappedRedis.context!.cleanup();
    console.log("redis keys removed in test cleanup: ", removed[1]);
  });

  jest.setTimeout(20000);
  it("limits the number of combined requests on all routes in a small fixed window", async () => {
    const user = await UserRepo.findOne("email", TEST_USER_EMAIL);
    const { accessToken } = await signTokenAndCreateSession(user);

    let currentTime = realDateNow();

    const allowedReqPromises = [];
    // call a rate limited route until just under/to the fixed window limit
    for (let i = perIpFixedWindowCounterLimit; i > 0; i -= 1)
      allowedReqPromises.push(
        request(app)
          .get(`/api${UsersRoutePaths.ROOT}`)
          .set("Cookie", [`access_token=${accessToken}`])
      );

    const values = await Promise.all(allowedReqPromises);
    values.forEach((response) => {
      expect(response.status).toBe(200);
    });
    // this request should be over the limit for the fixed window,
    // even though it is a different route path it is behind the same rate limiting middleware
    const response = await request(app)
      .put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ACCOUNT_DELETION}`)
      .set("Cookie", [`access_token=${accessToken}`]);
    expect(response.status).toBe(429);
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.RATE_LIMITER.REQUESTING_TOO_QUICKLY)).toBeTruthy();

    // jump forward in time until fixed window counter time is over and the req should now work again
    currentTime = setDateNowReturnValue(currentTime + perIpFixedWindowCounterTime);

    const responseThatShouldNotBeLimited = await request(app)
      .get(`/api${UsersRoutePaths.ROOT}`)
      .set("Cookie", [`access_token=${accessToken}`]);
    expect(responseThatShouldNotBeLimited.status).toBe(200);
  });

  it("limits the number of combined requests on all routes in a large sliding window", async () => {
    const user = await UserRepo.findOne("email", TEST_USER_EMAIL);
    const { accessToken } = await signTokenAndCreateSession(user);

    let numReqsInThisSlidingWindow = 0;
    // const timeOfFirstRequest = setDateNowReturnValue(0);
    const timeOfFirstRequest = setDateNowReturnValue(realDateNow());
    let currentTime = timeOfFirstRequest;

    // do a series of time jumps to reach (but not exceed) the sliding window limit without tripping the fixed window counters
    while (numReqsInThisSlidingWindow < perIpSlidingWindowLimit) {
      let numberOfRequestsToSend: number;
      // important if the fixed window counters limit doesn't divide evenly into the sliding window limit
      if (numReqsInThisSlidingWindow + perIpFixedWindowCounterLimit <= perIpSlidingWindowLimit) numberOfRequestsToSend = perIpFixedWindowCounterLimit;
      else numberOfRequestsToSend = perIpSlidingWindowLimit - numReqsInThisSlidingWindow;

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

      currentTime = setDateNowReturnValue(currentTime + perIpFixedWindowCounterTime);
      numReqsInThisSlidingWindow += numberOfRequestsToSend;
    }

    console.log(`${numReqsInThisSlidingWindow}/${perIpSlidingWindowLimit} allowed requests in this sliding window`);

    // this next request should now be over the sliding window limit
    const slidingWindowLimitedResponse = await request(app)
      .get(`/api${UsersRoutePaths.ROOT}`)
      .set("Cookie", [`access_token=${accessToken}`]);
    numReqsInThisSlidingWindow += 1;

    expect(slidingWindowLimitedResponse.status).toBe(429);
    expect(
      responseBodyIncludesCustomErrorMessage(slidingWindowLimitedResponse, ErrorMessages.RATE_LIMITER.TOO_MANY_REQUESTS) ||
        responseBodyIncludesCustomErrorMessage(slidingWindowLimitedResponse, ErrorMessages.RATE_LIMITER.REQUESTING_TOO_QUICKLY)
    ).toBeTruthy();

    // wait for the sliding window's enforcement window plus one fixed window length becasue we enforce
    // for one extra fixed window's length if the current timestamp isn't divisible by the fixed window interval
    // currentTime = setDateNowReturnValue(timeOfFirstRequest + perIpSlidingWindowTime + perIpFixedWindowCounterTime - 1);
    currentTime = setDateNowReturnValue(timeOfFirstRequest + perIpSlidingWindowTime + perIpFixedWindowCounterTime);
    console.log("currentTime: ", currentTime, perIpSlidingWindowTime + perIpFixedWindowCounterTime);
    const responseAfterWaiting = await request(app)
      .get(`/api${UsersRoutePaths.ROOT}`)
      .set("Cookie", [`access_token=${accessToken}`]);
    numReqsInThisSlidingWindow += 1;
    expect(responseAfterWaiting.status).toBe(200);
  });
});
