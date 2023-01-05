import request from "supertest";
import { Application } from "express";
import nodemailer from "nodemailer";
import { sendEmail } from "../utils/sendEmail";
import { AuthRoutePaths, ErrorMessages } from "../../../../common";
import PGContext from "../../utils/PGContext";
import { TEST_USER_EMAIL } from "../../utils/test-utils/consts";
import { wrappedRedis } from "../../utils/RedisContext";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { responseBodyIncludesCustomErrorMessage } from "../../utils/test-utils";

jest.mock("../utils/sendEmail");

describe("passwordResetEmailRequestHandler", () => {
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

  it("calls sendEmail", async () => {
    const response = await request(app)
      .post(`/api${AuthRoutePaths.ROOT + AuthRoutePaths.REQUEST_PASSWORD_RESET_EMAIL}`)
      .send({
        email: TEST_USER_EMAIL,
      });

    expect(response.status).toBe(200);
    expect(sendEmail).toHaveBeenCalled();
  });

  it("sends appropriate error when no email provided", async () => {
    const response = await request(app).post(`/api${AuthRoutePaths.ROOT + AuthRoutePaths.REQUEST_PASSWORD_RESET_EMAIL}`);
    expect(response.status).toBe(404);
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.AUTH.EMAIL_DOES_NOT_EXIST)).toBeTruthy();
  });
});
