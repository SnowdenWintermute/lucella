/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-async-promise-executor */
import { Application } from "express";
import { IncomingMessage, Server, ServerResponse } from "http";
import { io, Socket } from "socket.io-client";
import {
  battleRoomDefaultChatChannel,
  ErrorMessages,
  gameOverCountdownDuration,
  GENERIC_SOCKET_EVENTS,
  ONE_SECOND,
  putTwoClientSocketsInGameAndStartIt,
  randBetween,
  SocketEventsFromClient,
  SocketEventsFromServer,
} from "../../../../common";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { TEST_USER_EMAIL_ALTERNATE, TEST_USER_NAME_ALTERNATE } from "../../utils/test-utils/consts";
import { lucella } from "../../lucella";
import { LucellaServer } from "..";
import PGContext from "../../utils/PGContext";
import { wrappedRedis } from "../../utils/RedisContext";
import createTestUser from "../../utils/test-utils/createTestUser";
import createLoggedInUsersWithConnectedSockets from "../../utils/test-utils/createTestUsersAndReturnSockets";
//
// WORD OF CAUTION: this test suite involves reusing authenticated users who's elo changes persist from test to test
//
describe("MatchmakingQueue", () => {
  let context: PGContext | undefined;
  let app: Application | undefined;
  let httpServer: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;
  const port = Math.round(randBetween(8081, 65535));
  const socketUrl = `http://localhost:${port}`;
  let clients: { [name: string]: Socket } = {};
  beforeAll((done) => {
    const tasks = new Promise(async (resolve, reject) => {
      const { pgContext, expressApp } = await setupExpressRedisAndPgContextAndOneTestUser();
      // create a test user with a high elo
      await createTestUser(TEST_USER_NAME_ALTERNATE, TEST_USER_EMAIL_ALTERNATE, undefined, undefined, 1700);
      context = pgContext;
      app = expressApp;

      httpServer = app.listen(port, () => {
        lucella.server = new LucellaServer(httpServer);
      });
      const usersToCreate = [
        // difference of 20 (should be matched first)
        { email: "firstplace@lucella.com", elo: 2000 },
        { email: "secondplace@lucella.com", elo: 1980 },
        // difference of 50 (should be matched second)
        { email: "thirdplace@lucella.com", elo: 1950 },
        { email: "fourthplace@lucella.com", elo: 1900 },
        // difference of 100 (should be matched third)
        { email: "fifthplace@lucella.com", elo: 1800 },
        { email: "sixthplace@lucella.com", elo: 1700 },
      ];

      clients = await createLoggedInUsersWithConnectedSockets(usersToCreate, socketUrl);
      resolve(true);
    });
    tasks.then(() => {
      done();
    });
  });

  beforeEach((done) => {
    const tasks = new Promise(async (resolve, reject) => {
      const reconnectionPromises: Promise<boolean>[] = [];
      if (!Object.keys(clients).length) done();
      Object.values(clients).forEach((socket) => {
        if (!socket.connected)
          reconnectionPromises.push(
            new Promise((resolve, reject) => {
              socket.removeAllListeners();
              socket.on(SocketEventsFromServer.ERROR_MESSAGE, (data) => console.error(data));
              socket.on(SocketEventsFromServer.AUTHENTICATION_COMPLETE, () => {
                socket.off(SocketEventsFromServer.AUTHENTICATION_COMPLETE);
                resolve(true);
              });
              socket.connect();
            })
          );
      });
      await Promise.all(reconnectionPromises);
      resolve(true);
    });
    tasks.then(() => {
      done();
    });
  });

  afterEach((done) => {
    const tasks = new Promise(async (resolve, reject) => {
      Object.values(clients).forEach((socket) => {
        socket.disconnect();
      });
      await setTimeout(() => {
        resolve(true);
        console.log("waiting for games to wrap up");
      }, gameOverCountdownDuration * ONE_SECOND + ONE_SECOND); // allow any ongoing games to wrap up, giving one extra second to do so
    });
    tasks.then(() => {
      done();
    });
  });

  afterAll(async () => {
    lucella.server?.io.close();
    httpServer?.close();
    if (context) await context.cleanup();
    await wrappedRedis.context!.cleanup();
  });

  jest.setTimeout(25000);

  it("lets a logged in user enter the queue and forbids a guest user from doing so", (done) => {
    const thisTest = new Promise(async (resolve, reject) => {
      const guestSocket = io(socketUrl, { transports: ["websocket"] });
      // set up the conditions for a passing test so they can happen in any order
      const eventsOccurred = { authedSocketJoinedMatchmaking: false, guestSocketRejectedFromMatchmaking: false };

      // whichever one completes last should end the test
      clients.firstplace.on(SocketEventsFromServer.MATCHMAKING_QUEUE_ENTERED, () => {
        eventsOccurred.authedSocketJoinedMatchmaking = true;
        if (eventsOccurred.guestSocketRejectedFromMatchmaking) {
          resolve(true);
        }
      });
      guestSocket.on(SocketEventsFromServer.ERROR_MESSAGE, (data) => {
        expect(data).toBe(ErrorMessages.LOBBY.LOG_IN_TO_PLAY_RANKED);
        if (data === ErrorMessages.LOBBY.LOG_IN_TO_PLAY_RANKED) eventsOccurred.guestSocketRejectedFromMatchmaking = true;
        if (eventsOccurred.authedSocketJoinedMatchmaking) {
          resolve(true);
        }
      });

      guestSocket.on(GENERIC_SOCKET_EVENTS.CONNECT, () => {
        guestSocket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
      });

      clients.firstplace.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
    });
    thisTest.then(() => {
      done();
    });
  });

  it("matches the two closest elo players in the queue first", (done) => {
    const thisTest = new Promise(async (resolve, reject) => {
      lucella.server!.matchmakingQueue.eloDiffThresholdAdditive = 100;

      const { firstplace, secondplace, fourthplace } = clients;

      function resolveIfMatchedWithCorrectOpponent(data: any, expectedOpponent: string) {
        if (!data) return;
        Object.values(data.players).forEach((playerInGameRoom: any) => {
          if (!playerInGameRoom) return;
          if (playerInGameRoom.associatedUser.username === expectedOpponent) resolve(true);
        });
      }

      // 1.a the two closely matched players should get a game room update
      firstplace.on(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, (data) => {
        resolveIfMatchedWithCorrectOpponent(data, "secondplace");
      });
      secondplace.on(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, (data) => {
        resolveIfMatchedWithCorrectOpponent(data, "firstplace");
      });

      // 1. queue up three users for ranked, two of them closely matched
      firstplace.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
      secondplace.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
      fourthplace.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
    });
    thisTest.then(() => {
      done();
    });
  });

  it("correctly matches the closest elo players sequentially until no players are left in the queue", (done) => {
    const thisTest = new Promise(async (resolve, reject) => {
      lucella.server!.matchmakingQueue.eloDiffThresholdAdditive = 100;
      const { firstplace, thirdplace, fifthplace } = clients;

      const expectedMatchupsSucceeded = {
        firstAndSecond: false,
        thirdAndForth: false,
        fifthAndSixth: false,
      };
      type ExpectedMatchupsKey = keyof typeof expectedMatchupsSucceeded;

      // concede the games by disconnecting so we can check the score screens
      firstplace.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, () => {
        firstplace.disconnect();
      });
      thirdplace.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, () => {
        thirdplace.disconnect();
      });
      fifthplace.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, () => {
        fifthplace.disconnect();
      });

      let previousMatchup: ExpectedMatchupsKey | null = null;

      function handleScoreScreen(
        data: any,
        expectedMatchup: ExpectedMatchupsKey,
        expectedOpponentName: string,
        expectedPreviousMatchup: ExpectedMatchupsKey | null
      ) {
        let matchedWithExpectedOpponent = false;
        Object.values(data.gameRoom.players).forEach((player) => {
          // @ts-ignore
          if (player.associatedUser.username === expectedOpponentName) matchedWithExpectedOpponent = true;
        });
        if (expectedPreviousMatchup !== previousMatchup) reject(new Error("players were not matched in the correct order"));
        if (matchedWithExpectedOpponent) {
          previousMatchup = expectedMatchup;
          expectedMatchupsSucceeded[expectedMatchup] = true;
        }
        if (Object.values(expectedMatchupsSucceeded).every((item) => item === true)) {
          Object.values(clients).forEach((clientSocket) => clientSocket.disconnect());
          resolve(true);
        }
      }

      clients.secondplace.on(SocketEventsFromServer.SHOW_SCORE_SCREEN, (data) => {
        handleScoreScreen(data, "firstAndSecond", "firstplace", null);
      });
      clients.fourthplace.on(SocketEventsFromServer.SHOW_SCORE_SCREEN, (data) => {
        handleScoreScreen(data, "thirdAndForth", "thirdplace", "firstAndSecond");
      });
      clients.sixthplace.on(SocketEventsFromServer.SHOW_SCORE_SCREEN, (data) => {
        handleScoreScreen(data, "fifthAndSixth", "fifthplace", "thirdAndForth");
      });

      Object.values(clients).forEach((clientSocket) => {
        clientSocket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
      });
    });
    thisTest
      .then(() => {
        done();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  jest.setTimeout(25000);
  it("puts a user back into the queue and their previous chat channel if their opponent disconnects while the lobby countdown is in progress", (done) => {
    const thisTest = new Promise(async (resolve, reject) => {
      lucella.server!.matchmakingQueue.eloDiffThresholdAdditive = 300;
      const { firstplace, secondplace } = clients;

      const conditionsToMeet = {
        firstPlaceSentToTheirPreviousRoom: false,
        firstPlacePutBackInMatchmakingQueue: false,
      };

      const eventsOccurred = {
        firstPlaceJoinedChatChannelForTheFirstTime: false,
        secondPlaceJoinedChatChannel: false,
        secondPlaceDisconnectedAfterReceivingCountdownUpdate: false,
      };

      // 3.a[1/2] firstplace should get put back in matchmaking queue and their previous chat channel
      firstplace.on(SocketEventsFromServer.MATCHMAKING_QUEUE_ENTERED, () => {
        if (eventsOccurred.secondPlaceDisconnectedAfterReceivingCountdownUpdate) conditionsToMeet.firstPlacePutBackInMatchmakingQueue = true;
        if (Object.values(conditionsToMeet).every((condition) => condition)) resolve(true);
      });

      // 3. once users receive the game start countdown, have one of them disconnect
      secondplace.on(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE, () => {
        secondplace.disconnect();
        eventsOccurred.secondPlaceDisconnectedAfterReceivingCountdownUpdate = true;
      });

      // 2. have the two users queue for ranked
      // 3.a[2/2] firstplace should get put back in matchmaking queue and their previous chat channel
      firstplace.on(SocketEventsFromServer.CHAT_CHANNEL_UPDATE, (data) => {
        if (!eventsOccurred.firstPlaceJoinedChatChannelForTheFirstTime) {
          firstplace.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
          eventsOccurred.firstPlaceJoinedChatChannelForTheFirstTime = true;
        } else if (data.name === battleRoomDefaultChatChannel && eventsOccurred.secondPlaceDisconnectedAfterReceivingCountdownUpdate)
          conditionsToMeet.firstPlaceSentToTheirPreviousRoom = true;
        if (Object.values(conditionsToMeet).every((condition) => condition)) resolve(true);
      });

      secondplace.on(SocketEventsFromServer.CHAT_CHANNEL_UPDATE, () => {
        if (eventsOccurred.secondPlaceJoinedChatChannel) return;
        secondplace.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
        eventsOccurred.secondPlaceJoinedChatChannel = true;
      });

      // 1. join a chat channel so we can see if they get sent back to it after the other player disconnects during the game room coundown sequence
      Object.values(clients).forEach((clientSocket) => {
        clientSocket.emit(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, battleRoomDefaultChatChannel);
      });
    });
    thisTest.then(() => {
      done();
    });
  });

  it("puts a user back into the queue and their previous chat channel if their opponent unreadies while the game is in the waiting list", (done) => {
    const thisTest = new Promise(async (resolve, reject) => {
      lucella.server!.matchmakingQueue.eloDiffThresholdAdditive = 300;
      const { firstplace, secondplace } = clients;

      const conditionsToMeet = {
        firstPlaceSentToTheirPreviousRoom: false,
        firstPlacePutBackInMatchmakingQueue: false,
        secondPlaceRemovedFromMatchmaking: false,
      };

      const eventsOccurred = {
        firstPlaceJoinedChatChannelForTheFirstTime: false,
        secondPlaceJoinedChatChannel: false,
        secondPlaceUnreadiededAfterReceivingWaitingListUpdate: false,
      };

      // set the limit to two games and reduce the waiting list interval to make the test go faster
      lucella.server!.config.maxConcurrentGames = 2;
      lucella.server!.config.gameCreationWaitingListLoopInterval = 1000;
      // start two games to reach the limit
      const gameStartPromises = [
        putTwoClientSocketsInGameAndStartIt(clients.thirdplace, clients.fourthplace, "game1"),
        putTwoClientSocketsInGameAndStartIt(clients.fifthplace, clients.sixthplace, "game2"),
      ];
      await Promise.all(gameStartPromises);
      console.log("two games started");

      // 3.a[1/3] firstplace should get put back in matchmaking queue and their previous chat channel, and secondplace should be removed from matchmaking queue
      secondplace.on(SocketEventsFromServer.REMOVED_FROM_MATCHMAKING, () => {
        conditionsToMeet.secondPlaceRemovedFromMatchmaking = true;
        if (Object.values(conditionsToMeet).every((condition) => condition)) resolve(true);
      });

      // 3.a[1/3] firstplace should get put back in matchmaking queue and their previous chat channel, and secondplace should be removed from matchmaking queue
      firstplace.on(SocketEventsFromServer.MATCHMAKING_QUEUE_ENTERED, () => {
        if (eventsOccurred.secondPlaceUnreadiededAfterReceivingWaitingListUpdate) conditionsToMeet.firstPlacePutBackInMatchmakingQueue = true;
        if (Object.values(conditionsToMeet).every((condition) => condition)) resolve(true);
      });

      // 3. once users receive the game start countdown, have one of them unready
      secondplace.on(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION, () => {
        if (eventsOccurred.secondPlaceUnreadiededAfterReceivingWaitingListUpdate) return;
        secondplace.emit(SocketEventsFromClient.CLICKS_READY);
        eventsOccurred.secondPlaceUnreadiededAfterReceivingWaitingListUpdate = true;
      });

      // 2. have the two users queue for ranked
      // 3.a[2/3] firstplace should get put back in matchmaking queue and their previous chat channel, and secondplace should be removed from matchmaking queue
      firstplace.on(SocketEventsFromServer.CHAT_CHANNEL_UPDATE, (data) => {
        if (!eventsOccurred.firstPlaceJoinedChatChannelForTheFirstTime) {
          firstplace.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
          eventsOccurred.firstPlaceJoinedChatChannelForTheFirstTime = true;
        } else if (data.name === battleRoomDefaultChatChannel && eventsOccurred.secondPlaceUnreadiededAfterReceivingWaitingListUpdate)
          conditionsToMeet.firstPlaceSentToTheirPreviousRoom = true;
        if (Object.values(conditionsToMeet).every((condition) => condition)) resolve(true);
      });

      secondplace.on(SocketEventsFromServer.CHAT_CHANNEL_UPDATE, () => {
        if (eventsOccurred.secondPlaceJoinedChatChannel) return;
        secondplace.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
        eventsOccurred.secondPlaceJoinedChatChannel = true;
      });

      // 1. join a chat channel so we can see if they get sent back to it after the other player disconnects during the game room coundown sequence
      Object.values(clients).forEach((clientSocket) => {
        clientSocket.emit(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, battleRoomDefaultChatChannel);
      });
    });
    thisTest.then(() => {
      done();
    });
  });
});
