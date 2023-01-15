import { Application } from "express";
import request from "supertest";
import io from "socket.io-client";
import { IncomingMessage, Server, ServerResponse } from "node:http";
import bcrypt from "bcryptjs";
import {
  AuthRoutePaths,
  Ban,
  CookieNames,
  defaultChatChannelNames,
  ErrorMessages,
  ONE_MINUTE,
  randBetween,
  SocketEventsFromClient,
  SocketEventsFromServer,
  UserRole,
  UsersRoutePaths,
} from "../../../../common";
import PGContext from "../../utils/PGContext";
import { TEST_ADMIN_EMAIL, TEST_ADMIN_NAME, TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";
import UserRepo from "../../database/repos/users";
import signTokenAndCreateSession from "../utils/signTokenAndCreateSession";
import { wrappedRedis } from "../../utils/RedisContext";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { responseBodyIncludesCustomErrorMessage } from "../../utils/test-utils";
import { lucella } from "../../lucella";
import { LucellaServer } from "../../classes/LucellaServer";

describe("banUserAccountHandler", () => {
  let context: PGContext | undefined;
  let app: Application | undefined;
  let httpServer: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;
  const port = Math.round(randBetween(8081, 65535));
  beforeAll(async () => {
    const { pgContext, expressApp } = await setupExpressRedisAndPgContextAndOneTestUser();
    // create test admin
    const hashedPassword = await bcrypt.hash(TEST_USER_PASSWORD, 12);
    await UserRepo.insert(TEST_ADMIN_NAME, TEST_ADMIN_EMAIL, hashedPassword, UserRole.ADMIN);
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

  const realDateNow = Date.now.bind(global.Date);

  it("requires a user to be admin or moderator to ban an account", async () => {
    const user = await UserRepo.findOne("email", TEST_USER_EMAIL); // not a moderator/admin user
    const { accessToken } = await signTokenAndCreateSession(user);
    const response = await request(app)
      .put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ACCOUNT_BAN}`)
      .set("Cookie", [`access_token=${accessToken}`]);
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.AUTH.ROLE_RESTRICTED)).toBeTruthy();
    expect(response.status).toBe(403);
  });

  jest.setTimeout(7000);
  it(`lets an admin ban a user and that user is disconnected from socket server and can not log in afterward,
    then after waiting their ban duration the user can log in again`, (done) => {
    async function thisTest() {
      // this is who we will ban
      const user = await UserRepo.findOne("email", TEST_USER_EMAIL);
      const { accessToken } = await signTokenAndCreateSession(user);

      const socket = await io(`http://localhost:${port}`, {
        transports: ["websocket"],
        extraHeaders: { cookie: `access_token=${accessToken};` },
      });
      const banDuration = 60 * ONE_MINUTE;

      // ensure they are connected so we know banning the account actually disconnects them
      socket.on("connect", async () => {
        expect(lucella.server?.io.sockets.sockets.get(socket.id)!.id).toBe(socket.id);
        socket.on(SocketEventsFromServer.AUTHENTICATION_COMPLETE, async (data) => {
          socket.emit(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, defaultChatChannelNames.BATTLE_ROOM_CHAT);
        });
        socket.on(SocketEventsFromServer.NEW_CHAT_MESSAGE, async () => {
          // log in as admin and ban user
          const admin = await UserRepo.findOne("email", TEST_ADMIN_EMAIL);
          const objWithToken = await signTokenAndCreateSession(admin);
          const adminAccessToken = objWithToken.accessToken;
          const response = await request(app)
            .put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ACCOUNT_BAN}`)
            .set("Cookie", [`access_token=${adminAccessToken}`])
            .send({
              name: user.name,
              ban: new Ban("ACCOUNT", banDuration),
            });

          expect(response.status).toBe(204);
        });
        // sockets are disconnected
        socket.on("disconnect", async () => {
          expect(Object.keys(lucella.server!.connectedSockets!).length).toBe(0);
          expect(lucella.server?.connectedUsers[user.name]).toBeUndefined();
          // can't log in after acconut ban
          const loginResponse = await request(app).post(`/api${AuthRoutePaths.ROOT}`).send({
            email: TEST_USER_EMAIL,
            password: TEST_USER_PASSWORD,
          });

          expect(loginResponse.status).toBe(401);
          expect(loginResponse.headers["set-cookie"]).toBeUndefined();
          expect(responseBodyIncludesCustomErrorMessage(loginResponse, ErrorMessages.AUTH.ACCOUNT_BANNED)).toBeTruthy();

          // after waiting the duration of their ban, they can log in again
          const currentTime = Date.now();
          global.Date.now = jest.fn(() => currentTime + banDuration);
          const loginResponseAfterWaiting = await request(app).post(`/api${AuthRoutePaths.ROOT}`).send({
            email: TEST_USER_EMAIL,
            password: TEST_USER_PASSWORD,
          });
          expect(loginResponseAfterWaiting.status).toBe(200);
          expect(loginResponseAfterWaiting.headers["set-cookie"][0].includes(CookieNames.ACCESS_TOKEN)).toBeTruthy();

          global.Date.now = realDateNow;
          done();
        });
      });
    }
    thisTest();
  });
});
