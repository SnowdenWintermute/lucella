/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-async-promise-executor */
import { Application } from "express";
import { IncomingMessage, Server, ServerResponse } from "http";
import { randBetween, SocketEventsFromClient, SocketEventsFromServer } from "../../../../common";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { TEST_USER_EMAIL_ALTERNATE, TEST_USER_NAME_ALTERNATE } from "../../utils/test-utils/consts";
import { lucella } from "../../lucella";
import { LucellaServer } from "..";
import PGContext from "../../utils/PGContext";
import { wrappedRedis } from "../../utils/RedisContext";
import createTestUser from "../../utils/test-utils/createTestUser";
import createLoggedInUsersWithConnectedSockets from "../../utils/test-utils/createTestUsersAndReturnSockets";
import putTwoClientSocketsInGameAndStartIt from "../../utils/test-utils/putTwoClientSocketsInGameAndStartIt";

describe("GameCreationWaitingList", () => {
  let context: PGContext | undefined;
  let app: Application | undefined;
  let httpServer: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;
  const port = Math.round(randBetween(8081, 65535));
  const socketUrl = `http://localhost:${port}`;
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
    console.log("running test cleanup");
    lucella.server?.io.close();
    httpServer?.close();
    if (context) await context.cleanup();
    await wrappedRedis.context!.cleanup();
  });

  jest.setTimeout(25000);
  it("after both players ready up and the maximum number of allowed games are in progress, delays game start until an open spot becomes available", (done) => {
    const thisTest = new Promise(async (resolve, reject) => {
      const usersToCreate = [
        { email: "user1@lucella.com", elo: 2000 },
        { email: "user2@lucella.com", elo: 1980 },
        { email: "user3@lucella.com", elo: 1950 },
        { email: "user4@lucella.com", elo: 1900 },
        { email: "user5@lucella.com", elo: 1800 },
        { email: "user6@lucella.com", elo: 1700 },
      ];
      const clients = await createLoggedInUsersWithConnectedSockets(usersToCreate, socketUrl);
      // set the limit to two games and reduce the waiting list interval to make the test go faster
      lucella.server!.config.maxConcurrentGames = 2;
      lucella.server!.config.gameCreationWaitingListLoopInterval = 1000;
      // start two games to reach the limit
      const gameStartPromises = [
        putTwoClientSocketsInGameAndStartIt(clients.user1, clients.user2, "game1"),
        putTwoClientSocketsInGameAndStartIt(clients.user3, clients.user4, "game2"),
      ];
      await Promise.all(gameStartPromises);
      console.log("two games started");
      // attempt to start a third game, it should put them in the waiting list
      const eventsOccurred = {
        user5HostedGame: false,
        user6JoinedGame: false,
        user5ClickedReady: false,
        user6ClickedReady: false,
        numberOfWaitingListMessagesReceivedByUser5: 0,
        numberOfWaitingListMessagesReceivedByUser6: 0,
        socketInFirstGameDisconnected: false,
        gameCountdownUpdateReceived: false,
        gameStarted: false,
      };

      // end one of the first two games, it should allow the third game to start
      clients.user5.on(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION, (data) => {
        console.log("GAME_CREATION_WAITING_LIST_POSITION for user5: ", data);
        eventsOccurred.numberOfWaitingListMessagesReceivedByUser5 += 1;
        if (eventsOccurred.numberOfWaitingListMessagesReceivedByUser6 >= 2 && !eventsOccurred.socketInFirstGameDisconnected) {
          eventsOccurred.socketInFirstGameDisconnected = true;
          console.log("game has been in waiting list for two ticks, disconnecting user from first game");
          clients.user1.disconnect();
        }
      });
      clients.user6.on(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION, (data) => {
        console.log("GAME_CREATION_WAITING_LIST_POSITION for user6: ", data);
        eventsOccurred.numberOfWaitingListMessagesReceivedByUser6 += 1;
        if (eventsOccurred.numberOfWaitingListMessagesReceivedByUser5 >= 2 && !eventsOccurred.socketInFirstGameDisconnected) {
          eventsOccurred.socketInFirstGameDisconnected = true;
          console.log("game has been in waiting list for two ticks, disconnecting user from first game");
          clients.user1.disconnect();
        }
      });

      clients.user5.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, (data) => {
        resolve(true);
      });

      clients.user5.on(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, (data) => {
        if (!data) return;
        eventsOccurred.user5HostedGame = true;
        if (!data.players.challenger) {
          clients.user6.emit(SocketEventsFromClient.JOINS_GAME, "game3");
          eventsOccurred.user6JoinedGame = true;
        } else if (!data.playersReady.host) {
          clients.user5.emit(SocketEventsFromClient.CLICKS_READY);
          eventsOccurred.user5ClickedReady = true;
          clients.user6.emit(SocketEventsFromClient.CLICKS_READY);
          eventsOccurred.user6ClickedReady = true;
        }
      });

      clients.user5.emit(SocketEventsFromClient.HOSTS_NEW_GAME, "game3");
    });
    thisTest
      .then(() => {
        done();
      })
      .catch((error) => {
        expect(false).toBeTruthy();
      });
  });

  it("removes a game from the waiting list and emits updates when a user unreadies from a game that is in the waiting list", (done) => {
    const thisTest = new Promise(async (resolve, reject) => {
      const usersToCreate = [
        { email: "user1@lucella.com", elo: 2000 },
        { email: "user2@lucella.com", elo: 1980 },
        { email: "user3@lucella.com", elo: 1950 },
        { email: "user4@lucella.com", elo: 1900 },
        { email: "user5@lucella.com", elo: 1800 },
        { email: "user6@lucella.com", elo: 1700 },
      ];
      const clients = await createLoggedInUsersWithConnectedSockets(usersToCreate, socketUrl);
      // set the limit to two games and reduce the waiting list interval to make the test go faster
      lucella.server!.config.maxConcurrentGames = 2;
      lucella.server!.config.gameCreationWaitingListLoopInterval = 1000;
      // start two games to reach the limit
      const gameStartPromises = [
        putTwoClientSocketsInGameAndStartIt(clients.user1, clients.user2, "game1"),
        putTwoClientSocketsInGameAndStartIt(clients.user3, clients.user4, "game2"),
      ];
      await Promise.all(gameStartPromises);
      console.log("two games started");
      //
    });

    thisTest
      .then(() => {
        done();
      })
      .catch((error) => {
        expect(false).toBeTruthy();
      });
  });
});
