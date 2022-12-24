import PGContext from "../../utils/PGContext";
import { Application } from "express";
import request from "supertest";
import { wrappedRedis } from "../../utils/RedisContext";
import { AuthRoutePaths, ErrorMessages, InputFields } from "../../../../common";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { responseBodyIncludesCustomErrorField, responseBodyIncludesCustomErrorMessage } from "../../utils/test-utils";
import { TEST_USER_ALTERNATE_PASSWORD, TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";
import { signJwt } from "./utils/jwt";

describe("changePasswordHandler", () => {
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

  it(`successfully updates password when given a valid token and matching new passwords,
  and user can't log in with old password but can with new password`, async () => {
    const payload = { user: { id: "1" } };
    const password_reset_token = signJwt(payload, process.env.PASSWORD_RESET_TOKEN_PRIVATE_KEY!, {
      expiresIn: `${parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN!) / 1000 / 60}m`,
    });

    const response = await request(app)
      .put(`/api${AuthRoutePaths.BASE + AuthRoutePaths.CHANGE_PASSWORD}`)
      .send({
        password: TEST_USER_ALTERNATE_PASSWORD,
        passwordConfirm: TEST_USER_ALTERNATE_PASSWORD,
        token: password_reset_token,
      });

    expect(response.status).toBe(204);

    const loginWithOldPasswordResponse = await request(app)
      .post(`/api${AuthRoutePaths.BASE + AuthRoutePaths.LOGIN}`)
      .send({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

    expect(loginWithOldPasswordResponse.status).toBe(401);
    expect(responseBodyIncludesCustomErrorMessage(loginWithOldPasswordResponse, ErrorMessages.AUTH.INVALID_CREDENTIALS)).toBeTruthy();

    const loginResponse = await request(app)
      .post(`/api${AuthRoutePaths.BASE + AuthRoutePaths.LOGIN}`)
      .send({
        email: TEST_USER_EMAIL,
        password: TEST_USER_ALTERNATE_PASSWORD,
      });
    expect(loginResponse.headers["set-cookie"][0].includes("access_token")).toBeTruthy();
  });

  it("sends error for non-matching passwords and password too short", async () => {
    const response = await request(app)
      .put(`/api${AuthRoutePaths.BASE + AuthRoutePaths.CHANGE_PASSWORD}`)
      .send({
        password: "aoeu",
        passwordConfirm: "asdf",
      });
    console.log(response.body);
    expect(response.status).toBe(400);
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.VALIDATION.AUTH.PASSWORD_MIN_LENGTH)).toBeTruthy();
    expect(responseBodyIncludesCustomErrorField(response, InputFields.AUTH.PASSWORD)).toBeTruthy();
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.VALIDATION.AUTH.PASSWORDS_DONT_MATCH)).toBeTruthy();
    expect(responseBodyIncludesCustomErrorField(response, InputFields.AUTH.PASSWORD_CONFIRM)).toBeTruthy();
  });

  it("sends error for invalid token", async () => {
    const response = await request(app)
      .put(`/api${AuthRoutePaths.BASE + AuthRoutePaths.CHANGE_PASSWORD}`)
      .send({
        password: TEST_USER_ALTERNATE_PASSWORD,
        passwordConfirm: TEST_USER_ALTERNATE_PASSWORD,
      });

    expect(response.status).toBe(401);
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.AUTH.INVALID_OR_EXPIRED_TOKEN)).toBeTruthy();
  });

  it("sends error for non-existent email/user", async () => {
    const payload = { user: { id: "1234" } };
    const password_reset_token = signJwt(payload, process.env.PASSWORD_RESET_TOKEN_PRIVATE_KEY!, {
      expiresIn: `${parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN!) / 1000 / 60}m`,
    });

    const response = await request(app)
      .put(`/api${AuthRoutePaths.BASE + AuthRoutePaths.CHANGE_PASSWORD}`)
      .send({
        password: TEST_USER_ALTERNATE_PASSWORD,
        passwordConfirm: TEST_USER_ALTERNATE_PASSWORD,
        token: password_reset_token,
      });

    expect(response.status).toBe(401);
    console.log(response.body);
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.AUTH.NO_USER_EXISTS)).toBeTruthy();
  });
});
