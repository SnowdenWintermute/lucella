/* eslint-disable no-async-promise-executor */
import { Application } from "express";
import { IncomingMessage, Server, ServerResponse } from "http";
import { io } from "socket.io-client";
import { ErrorMessages, GENERIC_SOCKET_EVENTS, randBetween, SocketEventsFromClient, SocketEventsFromServer } from "../../../../common";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import {
  TEST_USER_EMAIL,
  TEST_USER_EMAIL_ALTERNATE,
  TEST_USER_EMAIL_THIRD,
  TEST_USER_NAME_ALTERNATE,
  TEST_USER_NAME_THIRD,
} from "../../utils/test-utils/consts";
import { lucella } from "../../lucella";
import { LucellaServer } from "../LucellaServer";
import PGContext from "../../utils/PGContext";
import { wrappedRedis } from "../../utils/RedisContext";
import createTestUser from "../../utils/test-utils/createTestUser";
import logTestUserIn from "../../utils/test-utils/logTestUserIn";

describe("MatchmakingQueue", () => {
  let context: PGContext | undefined;
  let app: Application | undefined;
  let httpServer: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;
  const port = Math.round(randBetween(8081, 65535));
  beforeAll(async () => {
    const { pgContext, expressApp } = await setupExpressRedisAndPgContextAndOneTestUser();
    // create a test user with a high elo
    await createTestUser(TEST_USER_NAME_ALTERNATE, TEST_USER_EMAIL_ALTERNATE, undefined, undefined, 1700);
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

  it("lets a logged in user enter the queue and forbids a guest user from doing so", (done) => {
    const thisTest = new Promise(async (resolve, reject) => {
      const { accessToken } = await logTestUserIn(TEST_USER_EMAIL);

      const authedSocket = io(`http://localhost:${port}`, {
        transports: ["websocket"],
        extraHeaders: { cookie: `access_token=${accessToken};` },
      });
      const guestSocket = io(`http://localhost:${port}`, {
        transports: ["websocket"],
      });
      // set up the conditions for a passing test so they can happen in any order
      const conditions = { authedSocketJoinedMatchmaking: false, guestSocketRejectedFromMatchmaking: false };
      function disconnectAllSockets() {
        authedSocket.disconnect();
        guestSocket.disconnect();
      }

      // whichever one completes last should end the test
      authedSocket.on(SocketEventsFromServer.MATCHMAKING_QUEUE_ENTERED, () => {
        conditions.authedSocketJoinedMatchmaking = true;
        if (conditions.guestSocketRejectedFromMatchmaking) {
          disconnectAllSockets();
          console.log("authed condition ended test");
          resolve(true);
        }
      });
      guestSocket.on(SocketEventsFromServer.ERROR_MESSAGE, (data) => {
        expect(data).toBe(ErrorMessages.LOBBY.LOG_IN_TO_PLAY_RANKED);
        if (data === ErrorMessages.LOBBY.LOG_IN_TO_PLAY_RANKED) conditions.guestSocketRejectedFromMatchmaking = true;
        if (conditions.authedSocketJoinedMatchmaking) {
          disconnectAllSockets();
          console.log("guest condition ended test");
          resolve(true);
        }
      });
      // conncet and attemp to join queue
      authedSocket.on(SocketEventsFromServer.AUTHENTICATION_COMPLETE, () => {
        authedSocket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
      });

      guestSocket.on(GENERIC_SOCKET_EVENTS.CONNECT, () => {
        guestSocket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
      });
    });
    thisTest.then(() => {
      console.log("test 1 completed");
      done();
    });
  });

  jest.setTimeout(20000);
  it("matches the two closest elo players in the queue first", (done) => {
    const thisTest = new Promise(async (resolve, reject) => {
      console.log("test 2 started");
      lucella.server!.matchmakingQueue.eloDiffThresholdAdditive = 100;
      // this user's elo more closely matches the TEST_USER_ALTERNATE created in the beforeAll(), they should be matched instead of the default test user
      await createTestUser(TEST_USER_NAME_THIRD, TEST_USER_EMAIL_THIRD, undefined, undefined, 1650);
      const testUser = await logTestUserIn(TEST_USER_EMAIL);
      const testUserSocket = io(`http://localhost:${port}`, {
        transports: ["websocket"],
        extraHeaders: { cookie: `access_token=${testUser.accessToken};` },
      });
      const testUserAlternate = await logTestUserIn(TEST_USER_EMAIL_ALTERNATE);
      const testUserAlternateSocket = io(`http://localhost:${port}`, {
        transports: ["websocket"],
        extraHeaders: { cookie: `access_token=${testUserAlternate.accessToken};` },
      });
      const testUserThird = await logTestUserIn(TEST_USER_EMAIL_THIRD);
      const testUserThirdSocket = io(`http://localhost:${port}`, {
        transports: ["websocket"],
        extraHeaders: { cookie: `access_token=${testUserThird.accessToken};` },
      });

      const clients = [testUserSocket, testUserAlternateSocket, testUserThirdSocket];
      clients.forEach((clientSocket) => {
        clientSocket.on(SocketEventsFromServer.AUTHENTICATION_COMPLETE, () => {
          clientSocket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
        });
      });

      testUserThirdSocket.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, () => {
        // disconnect testUser now so the matchmaking queue has a moment to shut down and doesn't log after test completion
        testUserSocket.disconnect();
        // disconnect testUserThird to concede the game to testUserAlternate
        testUserThirdSocket.disconnect();
      });

      testUserAlternateSocket.on(SocketEventsFromServer.SHOW_SCORE_SCREEN, () => {
        // they should get the score screen because testUserThird disconnected and testUser never should have been placed in a game
        clients.forEach((clientSocket) => {
          clientSocket.disconnect();
        });
        console.log("SCORESCREEN RECEIEVED");
        resolve(true);
      });
    });
    thisTest.then(() => {
      done();
    });
  });
});
