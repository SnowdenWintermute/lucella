import { Application } from "express";
import request from "supertest";
import UserRepo from "../../database/repos/users";
import { AuthRoutePaths, ErrorMessages, UserStatuses } from "../../../../common";
import PGContext from "../../utils/PGContext";
import { TEST_USER_EMAIL, TEST_USER_NAME } from "../../utils/test-utils/consts";
import signTokenAndCreateSession from "./utils/signTokenAndCreateSession";
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

  it("doesn't send user info in /auth/me after logout", async () => {
    const user = await UserRepo.findOne("email", TEST_USER_EMAIL);
    const { accessToken } = await signTokenAndCreateSession(user);

    const getMeResponse = await request(app)
      .get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.ME}`)
      .set("Cookie", [`access_token=${accessToken}`]);
    expect(getMeResponse.body.user).not.toHaveProperty("password");
    expect(getMeResponse.body.user.name).toBe(TEST_USER_NAME);
    expect(getMeResponse.body.user.email).toBe(TEST_USER_EMAIL);
    expect(getMeResponse.body.user.status).toBe(UserStatuses.ACTIVE);

    const logoutResponse = await request(app)
      .get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.LOGOUT}`)
      .set("Cookie", [`access_token=${accessToken}`]);
    expect(logoutResponse.status).toBe(200);

    const getMeAfterLogoutResponse = await request(app)
      .get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.ME}`)
      .set("Cookie", [`access_token=${accessToken}`]);
    expect(getMeAfterLogoutResponse.body).not.toHaveProperty("user");
    expect(responseBodyIncludesCustomErrorMessage(getMeAfterLogoutResponse, ErrorMessages.AUTH.EXPIRED_SESSION)).toBeTruthy();
  });

  it("still works if user token is already expired", async () => {
    const user = await UserRepo.findOne("email", TEST_USER_EMAIL);
    const { accessToken } = await signTokenAndCreateSession(user);
    wrappedRedis.context!.removeAllKeys();
    const logoutResponse = await request(app)
      .get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.LOGOUT}`)
      .set("Cookie", [`access_token=${accessToken}`]);
    expect(logoutResponse.status).toBe(200);
  });
});
