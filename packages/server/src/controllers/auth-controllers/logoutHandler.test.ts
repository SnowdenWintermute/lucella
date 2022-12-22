import { AuthRoutePaths, ErrorMessages, userStatuses } from "../../../../common";
import request from "supertest";
import createExpressApp from "../../createExpressApp";
import PGContext from "../../utils/PGContext";
import { TEST_USER_EMAIL, TEST_USER_NAME, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";
import redisClient, { connectRedis } from "../../utils/connectRedis";
import { Application } from "express";
import UserRepo from "../../database/repos/users";
import signTokenAndCreateSession from "./utils/signTokenAndCreateSession";
import { signJwt } from "./utils/jwt";
import { User } from "../../models/User";
import { RedisContext, wrappedRedis } from "../../utils/RedisContext";

describe("loginHandler", () => {
  let context: PGContext | undefined;
  let app: Application | undefined;
  beforeAll(async () => {
    context = await PGContext.build();
    app = createExpressApp();
    wrappedRedis.context = RedisContext.build(true);
    await wrappedRedis.context!.connect();
    await request(app)
      .post(`/api${AuthRoutePaths.BASE + AuthRoutePaths.REGISTER}`)
      .send({
        name: TEST_USER_NAME,
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
        password2: TEST_USER_PASSWORD,
      });
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
    const { access_token, refresh_token } = await signTokenAndCreateSession(user);

    const getMeResponse = await request(app)
      .get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.ME}`)
      .set("Cookie", [`access_token=${access_token}`]);
    expect(getMeResponse.body.user).not.toHaveProperty("password");
    expect(getMeResponse.body.user.name).toBe(TEST_USER_NAME);
    expect(getMeResponse.body.user.email).toBe(TEST_USER_EMAIL);
    expect(getMeResponse.body.user.status).toBe(userStatuses.ACTIVE);

    const logoutResponse = await request(app)
      .get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.LOGOUT}`)
      .set("Cookie", [`access_token=${access_token}`]);
    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body.status).toBe("success");

    const getMeAfterLogoutResponse = await request(app)
      .get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.ME}`)
      .set("Cookie", [`access_token=${access_token}`]);
    expect(getMeAfterLogoutResponse.body).not.toHaveProperty("user");
    expect(getMeAfterLogoutResponse.body.messages.includes(ErrorMessages.AUTH.EXPIRED_SESSION)).toBeTruthy();
  });

  it("still works if user token is already expired", async () => {
    const user = await UserRepo.findOne("email", TEST_USER_EMAIL);
    const { access_token, refresh_token } = await signTokenAndCreateSession(user);
    wrappedRedis.context!.removeAllKeys();
    const logoutResponse = await request(app)
      .get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.LOGOUT}`)
      .set("Cookie", [`access_token=${access_token}`]);
    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body.status).toBe("success");
  });
});
