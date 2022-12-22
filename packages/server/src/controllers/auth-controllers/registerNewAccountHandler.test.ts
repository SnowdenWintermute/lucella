import { AuthRoutePaths, ErrorMessages } from "../../../../common";
import request from "supertest";
import createExpressApp from "../../createExpressApp";
import UserRepo from "../../database/repos/users";
import PGContext from "../../utils/PGContext";
import { TEST_USER_EMAIL, TEST_USER_NAME, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";

describe("registerNewAccountHandler", () => {
  let context: PGContext | undefined;
  beforeAll(async () => {
    context = await PGContext.build();
  });

  afterAll(async () => {
    if (context) await context.cleanup();
  });

  it("can create a user", async () => {
    const startingCount = await UserRepo.count();
    const app = createExpressApp();
    await request(app)
      .post(`/api${AuthRoutePaths.BASE + AuthRoutePaths.REGISTER}`)
      .send({
        name: TEST_USER_NAME,
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
        password2: TEST_USER_PASSWORD,
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty("password");
        expect(res.body).toHaveProperty("createdAt");
        expect(res.body).toHaveProperty("updatedAt");
        expect(res.body.name).toBe(TEST_USER_NAME);
        expect(res.body.email).toBe(TEST_USER_EMAIL);
        expect(res.status).toBe(201);
      });

    const finishCount = await UserRepo.count();
    expect(finishCount - startingCount).toEqual(1);
  });

  it("gets errors for missing email or password", async () => {
    const startingCount = await UserRepo.count();
    const app = createExpressApp();

    await request(app)
      .post(`/api${AuthRoutePaths.BASE + AuthRoutePaths.REGISTER}`)
      .send({
        name: "",
        email: "",
        password: "",
        password2: "",
      })
      .expect((res) => {
        expect(res.body.error);
        expect(res.body.messages.includes(ErrorMessages.VALIDATION.AUTH.INVALID_EMAIL)).toBeTruthy();
        expect(res.body.messages.includes(ErrorMessages.VALIDATION.AUTH.PASSWORD_MIN_LENGTH)).toBeTruthy();
      })
      .expect(400);

    const finishCount = await UserRepo.count();
    expect(finishCount - startingCount).toEqual(0);
  });

  it("gets errors for missing email or password", async () => {
    const startingCount = await UserRepo.count();
    const app = createExpressApp();

    await request(app)
      .post(`/api${AuthRoutePaths.BASE + AuthRoutePaths.REGISTER}`)
      .send({
        name: "",
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
        password2: "",
      })
      .expect((res) => {
        expect(res.body.error);
        expect(res.body.messages.includes(ErrorMessages.VALIDATION.AUTH.NAME_MIN_LENGTH)).toBeTruthy();
        expect(res.body.messages.includes(ErrorMessages.VALIDATION.AUTH.PASSWORDS_DONT_MATCH)).toBeTruthy();
      })
      .expect(400);

    const finishCount = await UserRepo.count();
    expect(finishCount - startingCount).toEqual(0);
  });
});
