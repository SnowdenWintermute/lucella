import request from "supertest";
import { ErrorMessages, InputFields, UsersRoutePaths } from "@lucella/common";
import createExpressApp from "../../createExpressApp";
import UserRepo from "../../database/repos/users";
import PGContext from "../../utils/PGContext";
import { TEST_USER_EMAIL, TEST_USER_NAME, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";
import { responseBodyIncludesCustomErrorField, responseBodyIncludesCustomErrorMessage } from "../../utils/test-utils";

describe("registerNewAccountHandler", () => {
  let context: PGContext | undefined;
  beforeAll(async () => {
    context = await PGContext.build();
  });

  afterAll(async () => {
    if (context) await context.cleanup();
  });

  it("can create a user and cannot create another account with the same name", async () => {
    const startingCount = await UserRepo.count();
    const app = createExpressApp();
    const response = await request(app).post(`/api${UsersRoutePaths.ROOT}`).send({
      name: TEST_USER_NAME,
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
      passwordConfirm: TEST_USER_PASSWORD,
    });

    expect(response.body.user).not.toHaveProperty("password");
    expect(response.body.user).toHaveProperty("createdAt");
    expect(response.body.user).toHaveProperty("updatedAt");
    expect(response.body.user.name).toBe(TEST_USER_NAME);
    expect(response.body.user.email).toBe(TEST_USER_EMAIL);
    expect(response.status).toBe(201);

    const finishCount = await UserRepo.count();
    expect(finishCount - startingCount).toEqual(1);
    const responseForSecondCreation = await request(app).post(`/api${UsersRoutePaths.ROOT}`).send({
      name: TEST_USER_NAME,
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
      passwordConfirm: TEST_USER_PASSWORD,
    });

    expect(responseBodyIncludesCustomErrorMessage(responseForSecondCreation, ErrorMessages.AUTH.EMAIL_IN_USE_OR_UNAVAILABLE)).toBeTruthy();
    expect(responseForSecondCreation.status).toBe(403);
  });

  it("gets errors for missing email or password", async () => {
    const startingCount = await UserRepo.count();
    const app = createExpressApp();

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
    const app = createExpressApp();

    const response = await request(app).post(`/api${UsersRoutePaths.ROOT}`).send({
      name: "",
      email: TEST_USER_EMAIL,
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