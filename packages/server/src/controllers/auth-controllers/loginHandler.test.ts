import { AuthRoutePaths, CustomErrorDetails, ErrorMessages } from "../../../../common";
import request from "supertest";
import PGContext from "../../utils/PGContext";
import { TEST_USER_EMAIL, TEST_USER_NAME, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";
import { Application } from "express";
import { wrappedRedis } from "../../utils/RedisContext";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { responseBodyIncludesCustomErrorMessage } from "../../utils/test-utils";

describe("loginHandler", () => {
  let context: PGContext | undefined;
  let app: Application | undefined;
  beforeAll(async () => {
    const { pgContext, expressApp } = await setupExpressRedisAndPgContextAndOneTestUser();
    context = pgContext;
    app = expressApp;
  });

  beforeEach(async () => {
    await wrappedRedis.context!.removeAllKeys();
  });

  afterAll(async () => {
    if (context) await context.cleanup();
    await wrappedRedis.context!.cleanup();
  });

  it("receives auth cookies in the set-cookie header upon login", async () => {
    const response = await request(app)
      .post(`/api${AuthRoutePaths.BASE + AuthRoutePaths.LOGIN}`)
      .send({
        name: TEST_USER_NAME,
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

    expect(response.headers["set-cookie"][0].includes("access_token")).toBeTruthy();
  });

  it("gets appropriate error for missing email and password", async () => {
    const response = await request(app)
      .post(`/api${AuthRoutePaths.BASE + AuthRoutePaths.LOGIN}`)
      .send({
        email: "",
        password: "",
      });

    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL)).toBeTruthy();
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD)).toBeTruthy();
    expect(response.status).toBe(401);
  });

  it("gets appropriate error for incorrect password", async () => {
    const response = await request(app)
      .post(`/api${AuthRoutePaths.BASE + AuthRoutePaths.LOGIN}`)
      .send({
        email: TEST_USER_EMAIL,
        password: "the wrong password",
      });

    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.AUTH.INVALID_CREDENTIALS)).toBeTruthy();
    expect(response.status).toBe(401);
  });

  it("gets appropriate error for incorrect email", async () => {
    const response = await request(app)
      .post(`/api${AuthRoutePaths.BASE + AuthRoutePaths.LOGIN}`)
      .send({
        email: "some other email",
        password: TEST_USER_PASSWORD,
      });

    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.AUTH.INVALID_CREDENTIALS)).toBeTruthy();
    expect(response.status).toBe(401);
  });
});
