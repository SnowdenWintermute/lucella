import { Application } from "express";
import request from "supertest";
import io from "socket.io-client";
import { IncomingMessage, Server, ServerResponse } from "node:http";
import { AuthRoutePaths, ErrorMessages, randBetween, UsersRoutePaths } from "../../../../common";
import PGContext from "../../utils/PGContext";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";
import UserRepo from "../../database/repos/users";
import signTokenAndCreateSession from "../utils/signTokenAndCreateSession";
import { wrappedRedis } from "../../utils/RedisContext";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { responseBodyIncludesCustomErrorMessage } from "../../utils/test-utils";
import { lucella } from "../../lucella";
import { LucellaServer } from "../../classes/LucellaServer";

describe("deleteAccountHandler", () => {
  let context: PGContext | undefined;
  let app: Application | undefined;
  let httpServer: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;
  const port = Math.round(randBetween(8081, 65535));
  beforeAll(async () => {
    const { pgContext, expressApp } = await setupExpressRedisAndPgContextAndOneTestUser();
    context = pgContext;
    app = expressApp;

    httpServer = app.listen(port, () => {
      lucella.server = new LucellaServer(httpServer);
      console.log(`test server on ${port}`);
    });
  });

  beforeEach(async () => {
    await wrappedRedis.context!.removeAllKeys();
  });

  afterAll(async () => {
    if (context) await context.cleanup();
    await wrappedRedis.context!.cleanup();
    lucella.server?.io.close();
    httpServer?.close();
  });

  it("doesn't let a user delete an account they are not logged into", async () => {
    const response = await request(app).put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ACCOUNT_DELETION}`);
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.AUTH.NOT_LOGGED_IN));
    expect(response.status).toBe(401);
  });

  it("doesn't let a user delete an account without providing their password", async () => {
    const user = await UserRepo.findOne("email", TEST_USER_EMAIL);
    const { accessToken } = await signTokenAndCreateSession(user);
    const response = await request(app)
      .put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ACCOUNT_DELETION}`)
      .set("Cookie", [`access_token=${accessToken}`]);
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.AUTH.INVALID_CREDENTIALS));
    expect(response.status).toBe(401);
  });

  it("flags account as deleted, logs out user and doesn't let them log in with the deleted account", (done) => {
    async function thisTest() {
      const user = await UserRepo.findOne("email", TEST_USER_EMAIL);
      const { accessToken } = await signTokenAndCreateSession(user);

      const socket = await io(`http://localhost:${port}`, {
        transports: ["websocket"],
        extraHeaders: { cookie: `access_token=${accessToken};` },
      });

      socket.on("connect", async () => {
        // ensure they are connected so we know deleting account actually disconnects them
        expect(lucella.server?.io.sockets.sockets.get(socket.id)!.id).toBe(socket.id);
        const response = await request(app)
          .put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ACCOUNT_DELETION}`)
          .set("Cookie", [`access_token=${accessToken}`])
          .send({ password: TEST_USER_PASSWORD });
        // logs user out
        expect(response.headers["set-cookie"][0].includes("access_token=;")).toBeTruthy();
        expect(response.status).toBe(204);
        // sockets are disconnected
        expect(lucella.server?.io.sockets.sockets.get(socket.id)).toBeUndefined();
        expect(Object.keys(lucella.server!.connectedSockets!).length).toBe(0);
        expect(lucella.server?.connectedUsers[user.name]).toBeUndefined();
        // can't log in after acconut deletion
        const loginResponse = await request(app).post(`/api${AuthRoutePaths.ROOT}`).send({
          email: TEST_USER_EMAIL,
          password: TEST_USER_PASSWORD,
        });

        expect(loginResponse.status).toBe(401);
        expect(loginResponse.headers["set-cookie"]).toBeUndefined();
        expect(responseBodyIncludesCustomErrorMessage(loginResponse, ErrorMessages.AUTH.EMAIL_DOES_NOT_EXIST)).toBeTruthy();

        done();
      });
    }
    thisTest();
  });
});
