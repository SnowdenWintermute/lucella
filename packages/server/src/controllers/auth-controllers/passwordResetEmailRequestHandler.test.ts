import { AuthRoutePaths, ErrorMessages } from "../../../../common";
import request from "supertest";
import createExpressApp from "../../createExpressApp";
import PGContext from "../../utils/PGContext";
import { TEST_USER_EMAIL, TEST_USER_NAME, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";
import redisClient from "../../utils/connectRedis";
import { Application, Request, Response } from "express";
import passwordResetEmailRequestHandler from "./passwordResetEmailRequestHandler";
import UserRepo from "../../database/repos/users";
import signTokenAndCreateSession from "./utils/signTokenAndCreateSession";
import { RedisContext, wrappedRedis } from "../../utils/RedisContext";

describe("passwordResetEmailRequestHandler", () => {
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
    console.log(await wrappedRedis.context!.redisClient.keys("*"));
    await wrappedRedis.context!.removeAllKeys();
  });

  afterAll(async () => {
    if (context) await context.cleanup();
    await wrappedRedis.context!.cleanup();
  });

  it("", () => {});
  // it("receives auth cookies in the set-cookie header upon login", async () => {
  //   const user = await UserRepo.findOne("email", TEST_USER_EMAIL);
  //   const { access_token, refresh_token } = await signTokenAndCreateSession(user);

  //   const response = await request(app)
  //     .get(`/api${AuthRoutePaths.BASE + AuthRoutePaths.REQUEST_PASSWORD_RESET_EMAIL}`)
  //     .set("Cookie", [`access_token=${access_token}`]);
  // });
});
