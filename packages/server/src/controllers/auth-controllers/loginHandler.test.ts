import { Application } from "express";
import request from "supertest";
import { AuthRoutePaths, CookieNames, ErrorMessages, failedLoginCountTolerance, InputFields } from "../../../../common";
import PGContext from "../../utils/PGContext";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";
import { wrappedRedis } from "../../utils/RedisContext";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { responseBodyIncludesCustomErrorField, responseBodyIncludesCustomErrorMessage } from "../../utils/test-utils";

describe("loginHandler", () => {
  let context: PGContext | undefined;
  let app: Application | undefined;
  beforeAll(async () => {
    try {
      const { pgContext, expressApp } = await setupExpressRedisAndPgContextAndOneTestUser();

      context = pgContext;
      app = expressApp;
    } catch (error) {
      console.log(error);
    }
  });

  beforeEach(async () => {
    await wrappedRedis.context!.removeAllKeys();
  });

  afterAll(async () => {
    if (context) await context.cleanup();
    await wrappedRedis.context!.cleanup();
  });

  it("receives auth cookies in the set-cookie header upon login", async () => {
    const response = await request(app).post(`/api${AuthRoutePaths.ROOT}`).send({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });
    expect(response.headers["set-cookie"][0].includes(CookieNames.ACCESS_TOKEN)).toBeTruthy();
  });

  it("gets appropriate error for missing email and password", async () => {
    const response = await request(app).post(`/api${AuthRoutePaths.ROOT}`).send({
      email: "",
      password: "",
    });

    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL)).toBeTruthy();
    expect(responseBodyIncludesCustomErrorField(response, InputFields.AUTH.EMAIL)).toBeTruthy();
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD)).toBeTruthy();
    expect(responseBodyIncludesCustomErrorField(response, InputFields.AUTH.PASSWORD)).toBeTruthy();

    expect(response.status).toBe(400);
  });

  it("gets appropriate errors for incorrect password and can be locked out with too many attempts", async () => {
    // use up all attempts
    for (let i = 1; i < failedLoginCountTolerance + 1; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const response = await request(app).post(`/api${AuthRoutePaths.ROOT}`).send({
        email: TEST_USER_EMAIL,
        password: "the wrong password",
      });
      expect(
        responseBodyIncludesCustomErrorMessage(response, ErrorMessages.AUTH.INVALID_CREDENTIALS_WITH_ATTEMPTS_REMAINING(failedLoginCountTolerance - i))
      ).toBeTruthy();
      expect(response.status).toBe(401);
    }
    // should now be locked out
    const response = await request(app).post(`/api${AuthRoutePaths.ROOT}`).send({
      email: TEST_USER_EMAIL,
      password: "the wrong password",
    });
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.RATE_LIMITER.TOO_MANY_FAILED_LOGINS)).toBeTruthy();
    expect(response.status).toBe(401);
  });

  it("gets appropriate error for non existant email", async () => {
    const response = await request(app).post(`/api${AuthRoutePaths.ROOT}`).send({
      email: "a non existant email",
      password: TEST_USER_PASSWORD,
    });

    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.AUTH.EMAIL_DOES_NOT_EXIST)).toBeTruthy();
    expect(response.status).toBe(401);
  });
});
