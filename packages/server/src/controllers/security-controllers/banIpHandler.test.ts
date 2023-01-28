/* eslint-disable prefer-destructuring */
import { Application } from "express";
import request from "supertest";
import io from "socket.io-client";
import { IncomingMessage, Server, ServerResponse } from "node:http";
import {
  AuthRoutePaths,
  CookieNames,
  defaultChatChannelNames,
  ErrorMessages,
  IPBanReason,
  ModerationRoutePaths,
  ONE_MINUTE,
  randBetween,
  SocketEventsFromClient,
  SocketEventsFromServer,
  UserRole,
  UsersRoutePaths,
  GENERIC_SOCKET_EVENTS,
} from "../../../../common";
import PGContext from "../../utils/PGContext";
import { TEST_ADMIN_EMAIL, TEST_ADMIN_NAME, TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";
import { wrappedRedis } from "../../utils/RedisContext";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { responseBodyIncludesCustomErrorMessage } from "../../utils/test-utils";
import { lucella } from "../../lucella";
import { LucellaServer } from "../../classes/LucellaServer";
import createTestUser from "../../utils/test-utils/createTestUser";
import logTestUserIn from "../../utils/test-utils/logTestUserIn";

describe("banIpHandler.test", () => {
  let context: PGContext | undefined;
  let app: Application | undefined;
  let httpServer: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;
  const port = Math.round(randBetween(8081, 65535));
  beforeAll(async () => {
    const { pgContext, expressApp } = await setupExpressRedisAndPgContextAndOneTestUser();
    // create test admin
    await createTestUser(TEST_ADMIN_NAME, TEST_ADMIN_EMAIL, undefined, UserRole.ADMIN);
    context = pgContext;
    app = expressApp;

    httpServer = app.listen(port, () => {
      lucella.server = new LucellaServer(httpServer);
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

  it("requires a user to be admin or moderator to ban an ip address", async () => {
    const { accessToken } = await logTestUserIn(TEST_USER_EMAIL);
    const response = await request(app)
      .put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ACCOUNT_BAN}`)
      .set("Cookie", [`access_token=${accessToken}`]);
    expect(responseBodyIncludesCustomErrorMessage(response, ErrorMessages.AUTH.ROLE_RESTRICTED)).toBeTruthy();
    expect(response.status).toBe(403);
  });

  jest.setTimeout(7000);
  it(`lets an admin ban an ip and that user is disconnected from socket server and can not reconnect to the socket server
    and all http requests are cut short before reaching their routes,
    then after waiting their ban duration the user can log in again`, (done) => {
    async function thisTest() {
      const socket = await io(`http://localhost:${port}`, {
        transports: ["websocket"],
      });

      const banDuration = 60 * ONE_MINUTE;
      // ensure they are connected so we know banning the account actually disconnects them
      socket.on(GENERIC_SOCKET_EVENTS.CONNECT, async () => {
        expect(lucella.server?.io.sockets.sockets.get(socket.id)!.id).toBe(socket.id);
        socket.on(SocketEventsFromServer.AUTHENTICATION_COMPLETE, async (data) => {
          socket.emit(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, defaultChatChannelNames.BATTLE_ROOM_CHAT);
        });
      });
      let nameOfAnonUserToBan = "";
      socket.on(SocketEventsFromServer.NEW_CHAT_MESSAGE, async () => {
        console.log("lucella.server?.connectedUsers: ", lucella.server?.connectedUsers);
        nameOfAnonUserToBan = Object.keys(lucella.server?.connectedUsers!)[0];
        // log in as admin and ban user
        const userAndToken = await logTestUserIn(TEST_ADMIN_EMAIL);
        const response = await request(app)
          .post(`/api${ModerationRoutePaths.ROOT}${ModerationRoutePaths.IP_BAN}`)
          .set("Cookie", [`${CookieNames.ACCESS_TOKEN}=${userAndToken.accessToken}`])
          .send({
            name: nameOfAnonUserToBan,
            duration: banDuration,
            reason: IPBanReason.CHAT,
          });

        expect(response.status).toBe(201);
      });
      socket.on(GENERIC_SOCKET_EVENTS.DISCONNECT, async () => {
        // sockets are disconnected
        expect(Object.keys(lucella.server!.connectedSockets!).length).toBe(0);
        expect(lucella.server?.connectedUsers[nameOfAnonUserToBan]).toBeUndefined();
        // can't log in after acconut ban
        const loginResponse = await request(app).post(`/api${AuthRoutePaths.ROOT}`).send({
          email: TEST_USER_EMAIL,
          password: TEST_USER_PASSWORD,
        });
        console.log(loginResponse.body, loginResponse.status);
        // we don't tell them they are banned so 200 status is given by res.end() called in the ip ban check middleware
        expect(loginResponse.status).toBe(200);
        // but no body or cookie should be sent
        expect(loginResponse.headers["set-cookie"]).toBeUndefined();
        expect(loginResponse.body).toStrictEqual({});

        // attempt to connect to socket server, it should be rejected
        const secondSocketConnection = await io(`http://localhost:${port}`, {
          transports: ["websocket"],
        });

        // should never receive connection event
        secondSocketConnection.on(GENERIC_SOCKET_EVENTS.CONNECT, () => {
          // eslint-disable-next-line no-undef
          fail("it should not reach here");
        });

        secondSocketConnection.on(GENERIC_SOCKET_EVENTS.CONNECT_ERROR, async () => {
          // socket should not be allowed to connect due to the middleware that checks for banned ips
          // after waiting the duration of their ban, they can log in again
          const currentTime = Date.now();
          global.Date.now = jest.fn(() => currentTime + banDuration);
          const loginResponseAfterWaiting = await request(app).post(`/api${AuthRoutePaths.ROOT}`).send({
            email: TEST_USER_EMAIL,
            password: TEST_USER_PASSWORD,
          });
          expect(loginResponseAfterWaiting.status).toBe(200);
          expect(loginResponseAfterWaiting.headers["set-cookie"][0].includes(CookieNames.ACCESS_TOKEN)).toBeTruthy();

          const thirdSocketConnection = await io(`http://localhost:${port}`, {
            transports: ["websocket"],
          });
          // should now be allowed to connect to socket server once again
          thirdSocketConnection.on(GENERIC_SOCKET_EVENTS.CONNECT, () => {
            global.Date.now = realDateNow;
            done();
          });
        });
      });
    }
    thisTest();
  });
});
