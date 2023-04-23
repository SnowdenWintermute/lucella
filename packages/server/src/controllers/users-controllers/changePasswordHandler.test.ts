import { Application } from "express";
import request from "supertest";
import PGContext from "../../utils/PGContext";
import { wrappedRedis } from "../../utils/RedisContext";
import { AuthRoutePaths, CookieNames, ERROR_MESSAGES, failedLoginCountTolerance, InputFields, UsersRoutePaths, UserStatuses } from "../../../../common";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { responseBodyIncludesCustomErrorField, responseBodyIncludesCustomErrorMessage } from "../../utils/test-utils";
import { TEST_USER_ALTERNATE_PASSWORD, TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";
import { signJwtSymmetric } from "../utils/jwt";
import UsersRepo from "../../database/repos/users";
import signTokenAndCreateSession from "../utils/signTokenAndCreateSession";

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

  jest.setTimeout(20000);

  it(`successfully updates password when given a valid token, email and matching new passwords,
  even if the account is locked out, user session is deleted
  and user can't log in with old password but can with new password
  and user cannot reuse the same token to change password again`, async () => {
    const payload = { user: { email: TEST_USER_EMAIL } };
    const user = await UsersRepo.findById(1);
    if (!user) return;
    // lock user out (if they failed password attempts they would need to reset password to unlock)
    user.status = UserStatuses.LOCKED_OUT;
    await UsersRepo.update(user);
    // bypass login and give the token to authorize the user to update their password, just for this test
    const { accessToken } = await signTokenAndCreateSession(user);
    const passwordResetToken = signJwtSymmetric(payload, user.password, {
      expiresIn: `${parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN!, 10) / 1000 / 60}m`,
    });

    const response = await request(app).put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.PASSWORD}`).send({
      email: TEST_USER_EMAIL,
      password: TEST_USER_ALTERNATE_PASSWORD,
      passwordConfirm: TEST_USER_ALTERNATE_PASSWORD,
      token: passwordResetToken,
    });

    expect(response.status).toBe(204);

    // user should be logged out now and unable to perform auth protected actions such as account deletion
    const deleteAccountResponse = await request(app)
      .delete(`/api${UsersRoutePaths.ROOT}`)
      .set("Cookie", [`${CookieNames.ACCESS_TOKEN}=${accessToken}`]);
    expect(responseBodyIncludesCustomErrorMessage(deleteAccountResponse, ERROR_MESSAGES.AUTH.NOT_LOGGED_IN));

    const loginWithOldPasswordResponse = await request(app).post(`/api${AuthRoutePaths.ROOT}`).send({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });

    expect(loginWithOldPasswordResponse.status).toBe(401);
    expect(
      responseBodyIncludesCustomErrorMessage(
        loginWithOldPasswordResponse,
        ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS_WITH_ATTEMPTS_REMAINING(failedLoginCountTolerance - 1)
      )
    ).toBeTruthy();
    // should be able to log in with new password
    const loginResponse = await request(app).post(`/api${AuthRoutePaths.ROOT}`).send({
      email: TEST_USER_EMAIL,
      password: TEST_USER_ALTERNATE_PASSWORD,
    });
    expect(loginResponse.headers["set-cookie"][0].includes(CookieNames.ACCESS_TOKEN)).toBeTruthy();

    const secondAttempWithSameToken = await request(app).put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.PASSWORD}`).send({
      email: TEST_USER_EMAIL,
      password: TEST_USER_ALTERNATE_PASSWORD,
      passwordConfirm: TEST_USER_ALTERNATE_PASSWORD,
      token: passwordResetToken,
    });

    expect(responseBodyIncludesCustomErrorMessage(secondAttempWithSameToken, ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN));
  });

  it("sends error for non-matching passwords and password too short", async () => {
    const response = await request(app).put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.PASSWORD}`).send({
      email: TEST_USER_EMAIL,
      password: "aoeu",
      passwordConfirm: "asdf",
    });

    expect(response.status).toBe(400);
    expect(responseBodyIncludesCustomErrorMessage(response, ERROR_MESSAGES.VALIDATION.AUTH.PASSWORD_MIN_LENGTH)).toBeTruthy();
    expect(responseBodyIncludesCustomErrorField(response, InputFields.AUTH.PASSWORD)).toBeTruthy();
    expect(responseBodyIncludesCustomErrorMessage(response, ERROR_MESSAGES.VALIDATION.AUTH.PASSWORDS_DONT_MATCH)).toBeTruthy();
    expect(responseBodyIncludesCustomErrorField(response, InputFields.AUTH.PASSWORD_CONFIRM)).toBeTruthy();
  });

  it("sends error for invalid token", async () => {
    const response = await request(app).put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.PASSWORD}`).send({
      email: TEST_USER_EMAIL,
      password: TEST_USER_ALTERNATE_PASSWORD,
      passwordConfirm: TEST_USER_ALTERNATE_PASSWORD,
    });

    expect(response.status).toBe(401);
    expect(responseBodyIncludesCustomErrorMessage(response, ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN)).toBeTruthy();
  });

  it("sends error for non-existent email/user", async () => {
    const payload = { user: { email: "something invalid" } };
    const user = await UsersRepo.findById(1);
    if (!user) return;
    const passwordResetToken = signJwtSymmetric(payload, user.password, {
      expiresIn: `${parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN!, 10) / 1000 / 60}m`,
    });

    const response = await request(app).put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.PASSWORD}`).send({
      email: TEST_USER_EMAIL,
      password: TEST_USER_ALTERNATE_PASSWORD,
      passwordConfirm: TEST_USER_ALTERNATE_PASSWORD,
      token: passwordResetToken,
    });

    expect(response.status).toBe(401);
    expect(responseBodyIncludesCustomErrorMessage(response, ERROR_MESSAGES.AUTH.PASSWORD_RESET_EMAIL_DOES_NOT_MATCH_TOKEN)).toBeTruthy();
  });
});
