import { Application } from "express";
import { IncomingMessage, Server, ServerResponse } from "http";
import { io } from "socket.io-client";
import { ErrorMessages, randBetween, SocketEventsFromClient, SocketEventsFromServer } from "../../../../common";
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

  //   it("lets a logged in user enter the queue and forbids a guest user from doing so", (done) => {
  //     async function thisTest() {
  //       const { accessToken } = await logTestUserIn(TEST_USER_EMAIL);

  //       const authedSocket = await io(`http://localhost:${port}`, {
  //         transports: ["websocket"],
  //         extraHeaders: { cookie: `access_token=${accessToken};` },
  //       });
  //       const guestSocket = await io(`http://localhost:${port}`, {
  //         transports: ["websocket"],
  //       });

  //       authedSocket.on(SocketEventsFromServer.MATCHMAKING_QUEUE_ENTERED, () => {
  //         done();
  //       });

  //       guestSocket.on(SocketEventsFromServer.ERROR_MESSAGE, (data) => {
  //         expect(data).toBe(ErrorMessages.LOBBY.LOG_IN_TO_PLAY_RANKED);
  //         authedSocket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
  //       });

  //       guestSocket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
  //     }
  //     thisTest();
  //   });

  jest.setTimeout(20000);
  it("matches the two closest elo players in the queue first", (done) => {
    async function thisTest() {
      // this user's elo more closely matches the TEST_USER_ALTERNATE created in the beforeAll(), they should be matched instead of the default test user
      await createTestUser(TEST_USER_NAME_THIRD, TEST_USER_EMAIL_THIRD, undefined, undefined, 1650);
      const testUser = await logTestUserIn(TEST_USER_EMAIL);
      const testUserSocket = await io(`http://localhost:${port}`, {
        transports: ["websocket"],
        extraHeaders: { cookie: `access_token=${testUser.accessToken};` },
      });
      const testUserAlternate = await logTestUserIn(TEST_USER_EMAIL_ALTERNATE);
      const testUserAlternateSocket = await io(`http://localhost:${port}`, {
        transports: ["websocket"],
        extraHeaders: { cookie: `access_token=${testUserAlternate.accessToken};` },
      });
      const testUserThird = await logTestUserIn(TEST_USER_EMAIL_THIRD);
      const testUserThirdSocket = await io(`http://localhost:${port}`, {
        transports: ["websocket"],
        extraHeaders: { cookie: `access_token=${testUserThird.accessToken};` },
      });

      testUserThirdSocket.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, () => {
        console.log("GOT GAME PACKET");
        testUserSocket.disconnect(); // disconnect this player now so the matchmaking queue has a moment to shut down and doesn't log after test completion
        testUserThirdSocket.disconnect();
      });

      function sleep(milliseconds: number) {
        return new Promise((resolve) => {
          setTimeout(resolve, milliseconds);
        });
      }
      async function disconnectAllSockets() {
        testUserSocket.disconnect();
        testUserAlternateSocket.disconnect();
        testUserThirdSocket.disconnect();
        await sleep(200);
      }

      testUserAlternateSocket.on(SocketEventsFromServer.SHOW_SCORE_SCREEN, async (data) => {
        // they should get the score screen because testUserThird disconnected and testUser never should have been placed in a game
        console.log("ALTERNATE GOT SCORE SCREEN", data.gameRoom.players);
        await disconnectAllSockets();
        done();
      });

      testUserSocket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
      await sleep(200);
      testUserAlternateSocket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
      await sleep(200);
      testUserThirdSocket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
    }
    thisTest();
  });
});
