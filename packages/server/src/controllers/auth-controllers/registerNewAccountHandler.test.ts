import request from "supertest";
import createExpressApp from "../../createExpressApp";
import UserRepo from "../../database/repos/users";
import PGContext from "../../utils/PGContext";

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
      .post("/api/auth/register")
      .send({
        name: "testuser",
        email: "test@test.test",
        password: "aoeuaoeu",
        password2: "aoeuaoeu",
      })
      .expect(201);

    const finishCount = await UserRepo.count();
    expect(finishCount - startingCount).toEqual(1);
  });
});
