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

describe("getMeHandler", () => {
  let context: PGContext | undefined;
  let app: Application | undefined;
  beforeAll(async () => {
    context = await PGContext.build();
    app = createExpressApp();
    wrappedRedis.context = RedisContext.build(true);
    await wrappedRedis.context.connect();
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

  it("gets user information in response", async () => {
    const user = await UserRepo.findOne("email", TEST_USER_EMAIL);
    const { access_token, refresh_token } = await signTokenAndCreateSession(user);

    const response = await request(app)
      .get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.ME}`)
      .set("Cookie", [`access_token=${access_token}`]);
    console.log(response.body);
    expect(response.body.user).not.toHaveProperty("password");
    expect(response.body.user.name).toBe(TEST_USER_NAME);
    expect(response.body.user.email).toBe(TEST_USER_EMAIL);
    expect(response.body.user.status).toBe(userStatuses.ACTIVE);
  });

  it("should return error if no token provided in cookies", async () => {
    await request(app)
      .get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.ME}`)
      .expect((res) => {
        expect(res.body.messages.includes(ErrorMessages.AUTH.NOT_LOGGED_IN)).toBeTruthy();
        expect(res.status).toBe(401);
      });
  });

  it("should return invalid token error", async () => {
    const response = await request(app)
      .get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.ME}`)
      .set("Cookie", [`access_token=some invalid token`]);
    expect(response.status).toBe(401);
    expect(response.body.messages.includes(ErrorMessages.AUTH.INVALID_TOKEN)).toBeTruthy();
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
    expect(response.body.messages.includes(ErrorMessages.AUTH.EXPIRED_SESSION)).toBeTruthy();
  });

  it("should tell a user if they don't exist (valid token but no user by that id returned in deserialize user)", async () => {
    // this would mean they have a session but were removed from the database, which would be really weird
    const testUser: User = { id: 2, name: "", email: "", role: "", status: "" };
    const { access_token } = await signTokenAndCreateSession(testUser);
    const response = await request(app)
      .get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.ME}`)
      .set("Cookie", [`access_token=${access_token}`]);
    expect(response.status).toBe(401);
    expect(response.body.messages.includes(ErrorMessages.AUTH.NO_USER_EXISTS)).toBeTruthy();
  });
});
