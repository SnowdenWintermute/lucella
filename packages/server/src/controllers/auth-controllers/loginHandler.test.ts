import { AuthRoutePaths, ErrorMessages } from "../../../../common";
import request from "supertest";
import createExpressApp from "../../createExpressApp";
import PGContext from "../../utils/PGContext";
import { TEST_USER_EMAIL, TEST_USER_NAME, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";
import redisClient from "../../utils/connectRedis";
import { Application } from "express";

describe("loginHandler", () => {
  let context: PGContext | undefined;
  let app: Application | undefined;
  beforeAll(async () => {
    context = await PGContext.build();
    app = createExpressApp();
    await request(app)
      .post(`/api${AuthRoutePaths.BASE + AuthRoutePaths.REGISTER}`)
      .send({
        name: TEST_USER_NAME,
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
        password2: TEST_USER_PASSWORD,
      });
  });

  afterAll(async () => {
    if (context) await context.cleanup();
    if (redisClient.isOpen) redisClient.disconnect();
  });

  it("receives auth cookies in the set-cookie header upon login", async () => {
    await request(app)
      .post(`/api${AuthRoutePaths.BASE + AuthRoutePaths.LOGIN}`)
      .send({
        name: TEST_USER_NAME,
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      })
      .expect((res) => {
        expect(res.headers["set-cookie"][0].includes("access_token")).toBeTruthy();
      });
  });

  it("gets appropriate error for missing email and password", async () => {
    await request(app)
      .post(`/api${AuthRoutePaths.BASE + AuthRoutePaths.LOGIN}`)
      .send({
        email: "",
        password: "",
      })
      .expect((res) => {
        expect(res.body.messages.includes(ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL)).toBeTruthy();
        expect(res.body.messages.includes(ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD)).toBeTruthy();
        expect(res.status).toBe(401);
      });
  });

  it("gets appropriate error for incorrect password", async () => {
    await request(app)
      .post(`/api${AuthRoutePaths.BASE + AuthRoutePaths.LOGIN}`)
      .send({
        email: TEST_USER_EMAIL,
        password: "the wrong password",
      })
      .expect((res) => {
        expect(res.body.messages.includes(ErrorMessages.AUTH.INVALID_CREDENTIALS)).toBeTruthy();
        expect(res.status).toBe(401);
      });
  });

  it("gets appropriate error for incorrect email", async () => {
    await request(app)
      .post(`/api${AuthRoutePaths.BASE + AuthRoutePaths.LOGIN}`)
      .send({
        email: "some other email",
        password: TEST_USER_PASSWORD,
      })
      .expect((res) => {
        expect(res.body.messages.includes(ErrorMessages.AUTH.INVALID_CREDENTIALS)).toBeTruthy();
        expect(res.status).toBe(401);
      });
  });
});
