import { Application } from "express";
import request from "supertest";
import { AuthRoutePaths, ErrorMessages, InputFields } from "../../../../common";
import PGContext from "../../utils/PGContext";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";
import { wrappedRedis } from "../../utils/RedisContext";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { responseBodyIncludesCustomErrorField, responseBodyIncludesCustomErrorMessage } from "../../utils/test-utils";

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
    const response = await request(app).post(`/api${AuthRoutePaths.ROOT}`).send({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });
    console.log(response.body);
    expect(response.headers["set-cookie"][0].includes("access_token")).toBeTruthy();
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

  it("gets appropriate error for incorrect password", async () => {
    const response = await request(app).post(`/api${AuthRoutePaths.ROOT}`).send({
      email: TEST_USER_EMAIL,
      password: "the wrong password",
    });

    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.AUTH.INVALID_CREDENTIALS)).toBeTruthy();
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
