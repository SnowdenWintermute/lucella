import { Application } from "express";
import request from "supertest";
import bcrypt from "bcryptjs";
import { ErrorMessages, InputFields, UsersRoutePaths } from "../../../../common";
import UserRepo from "../../database/repos/users";
import PGContext from "../../utils/PGContext";
import { TEST_USER_EMAIL_ALTERNATE, TEST_USER_NAME_ALTERNATE, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";
import { responseBodyIncludesCustomErrorField, responseBodyIncludesCustomErrorMessage } from "../../utils/test-utils";
import { sendEmail } from "../utils/sendEmail";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { wrappedRedis } from "../../utils/RedisContext";
import { ACCOUNT_CREATION_SESSION_PREFIX } from "../../consts";

jest.mock("../utils/sendEmail");

describe("registerNewAccountHandler", () => {
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

  it("upon receiving valid input sends an account creation verification email and creates an account creation attempt session", async () => {
    // const startingCount = await UserRepo.count();
    const response = await request(app).post(`/api${UsersRoutePaths.ROOT}`).send({
      name: TEST_USER_NAME_ALTERNATE,
      email: TEST_USER_EMAIL_ALTERNATE,
      password: TEST_USER_PASSWORD,
      passwordConfirm: TEST_USER_PASSWORD,
    });

    expect(sendEmail).toHaveBeenCalled();
    expect(response.status).toBe(200);
    // this session is needed to ensure the email link can not be used after a certain time has passed
    const regitrationAttemptSession = await wrappedRedis.context!.get(`${ACCOUNT_CREATION_SESSION_PREFIX}${TEST_USER_EMAIL_ALTERNATE}`);
    const parsedSession = JSON.parse(regitrationAttemptSession!);
    expect(parsedSession.name).toBe(TEST_USER_NAME_ALTERNATE);
    expect(parsedSession.email).toBe(TEST_USER_EMAIL_ALTERNATE);
    const hashedPasswordMatchesUserPassword = await bcrypt.compare(TEST_USER_PASSWORD, parsedSession.password);
    expect(hashedPasswordMatchesUserPassword).toBeTruthy();
  });

  it("gets errors for missing email or password", async () => {
    const startingCount = await UserRepo.count();

    const response = await request(app).post(`/api${UsersRoutePaths.ROOT}`).send({
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.error);
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.VALIDATION.AUTH.INVALID_EMAIL)).toBeTruthy();
    expect(responseBodyIncludesCustomErrorField(response, InputFields.AUTH.EMAIL)).toBeTruthy();
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.VALIDATION.AUTH.PASSWORD_MIN_LENGTH)).toBeTruthy();
    expect(responseBodyIncludesCustomErrorField(response, InputFields.AUTH.PASSWORD)).toBeTruthy();

    const finishCount = await UserRepo.count();
    expect(finishCount - startingCount).toEqual(0);
  });

  it("gets errors for name length and non matching", async () => {
    const startingCount = await UserRepo.count();

    const response = await request(app).post(`/api${UsersRoutePaths.ROOT}`).send({
      name: "",
      email: TEST_USER_EMAIL_ALTERNATE,
      password: TEST_USER_PASSWORD,
      passwordConfirm: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.error);
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.VALIDATION.AUTH.NAME_MIN_LENGTH)).toBeTruthy();
    expect(responseBodyIncludesCustomErrorField(response, InputFields.AUTH.NAME)).toBeTruthy();

    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.VALIDATION.AUTH.PASSWORDS_DONT_MATCH)).toBeTruthy();
    expect(responseBodyIncludesCustomErrorField(response, InputFields.AUTH.PASSWORD_CONFIRM)).toBeTruthy();

    const finishCount = await UserRepo.count();
    expect(finishCount - startingCount).toEqual(0);
  });
});
