import { AuthRoutePaths, ErrorMessages, randBetween } from "../../../../common";
import request from "supertest";
import PGContext from "../../utils/PGContext";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";
import { Application } from "express";
import UserRepo from "../../database/repos/users";
import signTokenAndCreateSession from "./utils/signTokenAndCreateSession";
import { wrappedRedis } from "../../utils/RedisContext";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { responseBodyIncludesCustomErrorMessage } from "../../utils/test-utils";
import { lucella } from "../../lucella";
import { LucellaServer } from "../../classes/LucellaServer";
import io from "socket.io-client";
import { IncomingMessage, Server, ServerResponse } from "node:http";

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
      console.log("test server on " + port);
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
    const response = await request(app).delete(`/api${AuthRoutePaths.BASE + AuthRoutePaths.DELETE_ACCOUNT}`);
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.AUTH.NOT_LOGGED_IN));
    expect(response.status).toBe(401);
  });
  it("flags account as deleted, logs out user and doesn't let them log in with the deleted account", (done) => {
    async function thisTest() {
      const user = await UserRepo.findOne("email", TEST_USER_EMAIL);
      const { access_token } = await signTokenAndCreateSession(user);

      const socket = await io(`http://localhost:${port}`, {
        transports: ["websocket"],
        extraHeaders: { cookie: `access_token=${access_token};` },
      });

      socket.on("connect", async () => {
        // ensure they are connected so we know deleting account actually disconnects them
        expect(lucella.server?.io.sockets.sockets.get(socket.id)!.id).toBe(socket.id);
        const response = await request(app)
          .delete(`/api${AuthRoutePaths.BASE + AuthRoutePaths.DELETE_ACCOUNT}`)
          .set("Cookie", [`access_token=${access_token}`]);
        // logs user out
        expect(response.headers["set-cookie"][0].includes("access_token=;")).toBeTruthy();
        expect(response.status).toBe(204);
        // sockets are disconnected
        expect(lucella.server?.io.sockets.sockets.get(socket.id)).toBeUndefined();
        expect(lucella.server?.connectedUsers[user.name]).toBeUndefined();
        expect(Object.keys(lucella.server!.connectedSockets!).length).toBe(0);
        // can't log in after acconut deletion
        const loginResponse = await request(app)
          .post(`/api${AuthRoutePaths.BASE + AuthRoutePaths.LOGIN}`)
          .send({
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
