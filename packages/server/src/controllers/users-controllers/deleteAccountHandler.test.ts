import { Application } from "express";
import request from "supertest";
import io from "socket.io-client";
import { IncomingMessage, Server, ServerResponse } from "node:http";
import { AuthRoutePaths, ERROR_MESSAGES, randBetween, UsersRoutePaths, GENERIC_SOCKET_EVENTS, CookieNames } from "../../../../common";
import PGContext from "../../utils/PGContext";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";
import { wrappedRedis } from "../../utils/RedisContext";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { responseBodyIncludesCustomErrorMessage } from "../../utils/test-utils";
import { lucella } from "../../lucella";
import { LucellaServer } from "../../LucellaServer";
import logTestUserIn from "../../utils/test-utils/logTestUserIn";

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
    expect(responseBodyIncludesCustomErrorMessage(response, ERROR_MESSAGES.AUTH.NOT_LOGGED_IN));
    expect(response.status).toBe(401);
  });

  it("doesn't let a user delete an account without providing their password", async () => {
    const { accessToken } = await logTestUserIn(TEST_USER_EMAIL);
    const response = await request(app)
      .put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ACCOUNT_DELETION}`)
      .set("Cookie", [`${CookieNames.ACCESS_TOKEN}=${accessToken}`]);
    expect(responseBodyIncludesCustomErrorMessage(response, ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS)).toBeTruthy();
    expect(response.status).toBe(401);
  });

  it("flags account as deleted, logs out user and doesn't let them log in with the deleted account", (done) => {
    async function thisTest() {
      const { user, accessToken } = await logTestUserIn(TEST_USER_EMAIL);

      const socket = await io(`http://localhost:${port}`, {
        transports: ["websocket"],
        extraHeaders: { cookie: `${CookieNames.ACCESS_TOKEN}=${accessToken};` },
      });

      socket.on(GENERIC_SOCKET_EVENTS.CONNECT, async () => {
        // ensure they are connected so we know deleting account actually disconnects them
        expect(lucella.server?.io.sockets.sockets.get(socket.id)!.id).toBe(socket.id);
        // user deletes their account
        const response = await request(app)
          .put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ACCOUNT_DELETION}`)
          .set("Cookie", [`${CookieNames.ACCESS_TOKEN}=${accessToken}`])
          .send({ password: TEST_USER_PASSWORD });
        // logs user out
        expect(response.headers["set-cookie"][0].includes(`${CookieNames.ACCESS_TOKEN}=;`)).toBeTruthy();
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
        expect(responseBodyIncludesCustomErrorMessage(loginResponse, ERROR_MESSAGES.AUTH.EMAIL_DOES_NOT_EXIST)).toBeTruthy();

        done();
      });
    }
    thisTest();
  });
});
