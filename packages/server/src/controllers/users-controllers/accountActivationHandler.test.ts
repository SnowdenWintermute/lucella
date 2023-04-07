import { Application } from "express";
import request from "supertest";
import bcrypt from "bcryptjs";
import { ERROR_MESSAGES, UsersRoutePaths } from "../../../../common";
import UserRepo from "../../database/repos/users";
import PGContext from "../../utils/PGContext";
import { TEST_USER_EMAIL_ALTERNATE, TEST_USER_NAME_ALTERNATE, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";
import { responseBodyIncludesCustomErrorMessage } from "../../utils/test-utils";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { wrappedRedis } from "../../utils/RedisContext";
import { ACCOUNT_CREATION_SESSION_PREFIX } from "../../consts";
import { signJwtAsymmetric } from "../utils/jwt";

describe("accountActivationHandler", () => {
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

  it(`upon visiting /account-activation with proper token while a valid session is active creates user account
    and doesn't allow reuse of the same token/session`, async () => {
    const startingCount = await UserRepo.count();

    // create appropriate jwt for link
    const token = signJwtAsymmetric({ email: TEST_USER_EMAIL_ALTERNATE }, process.env.ACCOUNT_ACTIVATION_TOKEN_PRIVATE_KEY!, {
      expiresIn: process.env.ACCOUNT_ACTIVATION_SESSION_EXPIRATION!,
    });
    // setup account activation session
    const hashedPassword = await bcrypt.hash(TEST_USER_PASSWORD, 12);
    wrappedRedis.context!.set(
      `${ACCOUNT_CREATION_SESSION_PREFIX}${TEST_USER_EMAIL_ALTERNATE}`,
      JSON.stringify({ name: TEST_USER_NAME_ALTERNATE, email: TEST_USER_EMAIL_ALTERNATE, password: hashedPassword }),
      {
        EX: parseInt(process.env.ACCOUNT_ACTIVATION_SESSION_EXPIRATION!, 10),
      }
    );

    const response = await request(app).post(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ACCOUNT_ACTIVATION}`).send({ token });

    expect(response.body.user).not.toHaveProperty("password");
    expect(response.body.user).toHaveProperty("createdAt");
    expect(response.body.user).toHaveProperty("updatedAt");
    expect(response.body.user.name).toBe(TEST_USER_NAME_ALTERNATE);
    expect(response.body.user.email).toBe(TEST_USER_EMAIL_ALTERNATE);

    const finishCount = await UserRepo.count();
    expect(finishCount - startingCount).toEqual(1);
    const responseForSecondCreation = await request(app).post(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ACCOUNT_ACTIVATION}`).send({ token });
    expect(responseForSecondCreation.status).toBe(401);
    expect(responseBodyIncludesCustomErrorMessage(responseForSecondCreation, ERROR_MESSAGES.AUTH.USED_OR_EXPIRED_ACCOUNT_CREATION_SESSION)).toBeTruthy();
  });

  it("doesn't allow creation of an account without a valid token", async () => {
    const token = "invalid token";
    const response = await request(app).post(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ACCOUNT_ACTIVATION}`).send({ token });
    expect(response.status).toBe(401);
    expect(responseBodyIncludesCustomErrorMessage(response, ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN)).toBeTruthy();
  });
});
