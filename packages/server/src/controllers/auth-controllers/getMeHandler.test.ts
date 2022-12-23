import { AuthRoutePaths, CustomErrorDetails, ErrorMessages, userStatuses } from "../../../../common";
import request from "supertest";
import PGContext from "../../utils/PGContext";
import { TEST_USER_EMAIL, TEST_USER_NAME } from "../../utils/test-utils/consts";
import { Application } from "express";
import UserRepo from "../../database/repos/users";
import signTokenAndCreateSession from "./utils/signTokenAndCreateSession";
import { signJwt } from "./utils/jwt";
import { User } from "../../models/User";
import { wrappedRedis } from "../../utils/RedisContext";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { responseBodyIncludesCustomErrorMessage } from "../../utils/test-utils";

describe("getMeHandler", () => {
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

  it("gets user information in response", async () => {
    const user = await UserRepo.findOne("email", TEST_USER_EMAIL);
    const { access_token, refresh_token } = await signTokenAndCreateSession(user);

    const response = await request(app)
      .get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.ME}`)
      .set("Cookie", [`access_token=${access_token}`]);

    expect(response.status).toBe(200);
    expect(response.body.user).not.toHaveProperty("password");
    expect(response.body.user.name).toBe(TEST_USER_NAME);
    expect(response.body.user.email).toBe(TEST_USER_EMAIL);
    expect(response.body.user.status).toBe(userStatuses.ACTIVE);
  });

  it("should return error if no token provided in cookies", async () => {
    const response = await request(app).get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.ME}`);

    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.AUTH.NOT_LOGGED_IN)).toBeTruthy();
    expect(response.status).toBe(401);
  });

  it("should return invalid token error", async () => {
    const response = await request(app)
      .get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.ME}`)
      .set("Cookie", [`access_token=some invalid token`]);
    expect(response.status).toBe(401);
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.AUTH.INVALID_OR_EXPIRED_TOKEN)).toBeTruthy();
  });

  it("should tell a user if their session has expired", async () => {
    // it will show expried if they provide a vaild token but no session is stored in redis
    const access_token = signJwt({ sub: 1 }, process.env.ACCESS_TOKEN_PRIVATE_KEY!, {
      expiresIn: `1000m`,
    });
    const response = await request(app)
      .get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.ME}`)
      .set("Cookie", [`access_token=${access_token}`]);
    expect(response.status).toBe(401);
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.AUTH.EXPIRED_SESSION)).toBeTruthy();
  });

  it("should tell a user if they don't exist (valid token but no user by that id returned in deserialize user)", async () => {
    // this would mean they have a session but were removed from the database, which would be really weird
    const testUser: User = { id: 2, name: "", email: "", role: "", status: "" };
    const { access_token } = await signTokenAndCreateSession(testUser);
    const response = await request(app)
      .get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.ME}`)
      .set("Cookie", [`access_token=${access_token}`]);
    expect(response.status).toBe(401);
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.AUTH.NO_USER_EXISTS)).toBeTruthy();
  });
});
