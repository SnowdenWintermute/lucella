/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-async-promise-executor */
import { Application } from "express";
import { IncomingMessage, Server, ServerResponse } from "http";
import { io, Socket } from "socket.io-client";
import {
  battleRoomDefaultChatChannel,
  CookieNames,
  ErrorMessages,
  GENERIC_SOCKET_EVENTS,
  randBetween,
  SocketEventsFromClient,
  SocketEventsFromServer,
} from "../../../../common";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import {
  TEST_USER_EMAIL,
  TEST_USER_EMAIL_ALTERNATE,
  TEST_USER_EMAIL_THIRD,
  TEST_USER_NAME,
  TEST_USER_NAME_ALTERNATE,
  TEST_USER_NAME_THIRD,
} from "../../utils/test-utils/consts";
import { lucella } from "../../lucella";
import { LucellaServer } from "../LucellaServer";
import PGContext from "../../utils/PGContext";
import { wrappedRedis } from "../../utils/RedisContext";
import createTestUser from "../../utils/test-utils/createTestUser";
import logTestUserIn from "../../utils/test-utils/logTestUserIn";
import getAuthenticatedUserAndSocket from "../../utils/test-utils/getAuthenticatedUserAndSocket";

describe("MatchmakingQueue", () => {
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
    lucella.server?.io.close();
    httpServer?.close();
    if (context) await context.cleanup();
    await wrappedRedis.context!.cleanup();
  });

  it("lets a logged in user enter the queue and forbids a guest user from doing so", (done) => {
    const thisTest = new Promise(async (resolve, reject) => {
      const [testUser, testUserSocket] = await getAuthenticatedUserAndSocket(socketUrl, TEST_USER_NAME, TEST_USER_EMAIL);

      const guestSocket = io(socketUrl, {
        transports: ["websocket"],
      });
      // set up the conditions for a passing test so they can happen in any order
      const conditions = { authedSocketJoinedMatchmaking: false, guestSocketRejectedFromMatchmaking: false };
      function disconnectAllSockets() {
        testUserSocket.disconnect();
        guestSocket.disconnect();
      }

      // whichever one completes last should end the test
      testUserSocket.on(SocketEventsFromServer.MATCHMAKING_QUEUE_ENTERED, () => {
        conditions.authedSocketJoinedMatchmaking = true;
        if (conditions.guestSocketRejectedFromMatchmaking) {
          disconnectAllSockets();
          resolve(true);
        }
      });
      guestSocket.on(SocketEventsFromServer.ERROR_MESSAGE, (data) => {
        expect(data).toBe(ErrorMessages.LOBBY.LOG_IN_TO_PLAY_RANKED);
        if (data === ErrorMessages.LOBBY.LOG_IN_TO_PLAY_RANKED) conditions.guestSocketRejectedFromMatchmaking = true;
        if (conditions.authedSocketJoinedMatchmaking) {
          disconnectAllSockets();
          resolve(true);
        }
      });
      // conncet and attemp to join queue
      testUserSocket.on(SocketEventsFromServer.AUTHENTICATION_COMPLETE, () => {
        testUserSocket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
      });

      guestSocket.on(GENERIC_SOCKET_EVENTS.CONNECT, () => {
        guestSocket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
      });
    });
    thisTest.then(() => {
      done();
    });
  });

  jest.setTimeout(25000);
  it("matches the two closest elo players in the queue first", (done) => {
    const thisTest = new Promise(async (resolve, reject) => {
      lucella.server!.matchmakingQueue.eloDiffThresholdAdditive = 100;
      // this user's elo more closely matches the TEST_USER_ALTERNATE created in the beforeAll(), they should be matched instead of the default test user
      // await createTestUser(TEST_USER_NAME_THIRD, TEST_USER_EMAIL_THIRD, undefined, undefined, 1650);
      const [testUserThird, testUserThirdSocket] = await getAuthenticatedUserAndSocket(socketUrl, TEST_USER_NAME_THIRD, TEST_USER_EMAIL_THIRD, 1650);
      const [testUser, testUserSocket] = await getAuthenticatedUserAndSocket(socketUrl, TEST_USER_NAME, TEST_USER_EMAIL);
      const [testUserAlternate, testUserAlternateSocket] = await getAuthenticatedUserAndSocket(socketUrl, TEST_USER_NAME_ALTERNATE, TEST_USER_EMAIL_ALTERNATE);

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
        resolve(true);
      });
    });
    thisTest.then(() => {
      done();
    });
  });

  jest.setTimeout(25000);

  it("correctly matches the closest elo players sequentially until no players are left in the queue", (done) => {
    const thisTest = new Promise(async (resolve, reject) => {
      lucella.server!.matchmakingQueue.eloDiffThresholdAdditive = 100;
      // set up 6 players
      const players = [
        // difference of 20 (should be matched first)
        { email: "topranked@lucella.com", elo: 2000 },
        { email: "secondplace@lucella.com", elo: 1980 },
        // difference of 50 (should be matched second)
        { email: "thirdplace@lucella.com", elo: 1950 },
        { email: "fourthplace@lucella.com", elo: 1900 },
        // difference of 100 (should be matched third)
        { email: "fifthplace@lucella.com", elo: 1800 },
        { email: "sixthplace@lucella.com", elo: 1700 },
      ];

      const clients: { [username: string]: Socket } = {};
      const userCreationAndSocketConnectionPromises: any[] = [];

      players.forEach((player) => {
        userCreationAndSocketConnectionPromises.push(
          new Promise(async (resolve, reject) => {
            const user = await createTestUser(player.email.split("@")[0], player.email, undefined, undefined, player.elo);
            const loginResult = await logTestUserIn(user.email);
            const playerSocket = io(socketUrl, {
              transports: ["websocket"],
              extraHeaders: { cookie: `${CookieNames.ACCESS_TOKEN}=${loginResult.accessToken};` },
            });
            clients[user.name] = playerSocket;
            resolve(true);
          })
        );
      });

      await Promise.all(userCreationAndSocketConnectionPromises);

      Object.values(clients).forEach((clientSocket) => {
        clientSocket.on(SocketEventsFromServer.AUTHENTICATION_COMPLETE, () => {
          clientSocket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
        });
      });

      const expectedMatchupsSucceeded = {
        firstAndSecond: false,
        thirdAndForth: false,
        fifthAndSixth: false,
      };
      type ExpectedMatchupsKey = keyof typeof expectedMatchupsSucceeded;

      // concede the games by disconnecting so we can check the score screens
      clients.topranked.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, () => {
        clients.topranked.disconnect();
      });
      clients.thirdplace.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, () => {
        clients.thirdplace.disconnect();
      });
      clients.fifthplace.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, () => {
        clients.fifthplace.disconnect();
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
        handleScoreScreen(data, "firstAndSecond", "topranked", null);
      });
      clients.fourthplace.on(SocketEventsFromServer.SHOW_SCORE_SCREEN, (data) => {
        handleScoreScreen(data, "thirdAndForth", "thirdplace", "firstAndSecond");
      });
      clients.sixthplace.on(SocketEventsFromServer.SHOW_SCORE_SCREEN, (data) => {
        handleScoreScreen(data, "fifthAndSixth", "fifthplace", "thirdAndForth");
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
  it("puts a user back into the queue, as well as their previous chat channel, if their opponent disconnects while the lobby countdown is in progress", (done) => {
    const thisTest = new Promise(async (resolve, reject) => {
      lucella.server!.matchmakingQueue.eloDiffThresholdAdditive = 300;

      const conditionsToMeet = {
        testUserSocketGotCountdownEvent: false,
        testUserSocketPutBackInQueue: false,
        testUserSentToTheirPreviousRoomAfterTheirOpponentDisconnectedDuringRankedGameCountdownSequence: false,
      };

      const eventsThatHaveOccurred = {
        testUserJoinedChatChannelForTheFirstTime: false,
        testUserAlternateJoinedChatChannelForTheFirstTime: false,
      };

      const [testUser, testUserSocket] = await getAuthenticatedUserAndSocket(socketUrl, TEST_USER_NAME, TEST_USER_EMAIL);
      const [testUserAlternate, testUserAlternateSocket] = await getAuthenticatedUserAndSocket(socketUrl, TEST_USER_NAME_ALTERNATE, TEST_USER_EMAIL_ALTERNATE);

      const clients = { testUser: testUserSocket, testUserAlternate: testUserAlternateSocket };

      Object.values(clients).forEach((clientSocket) => {
        clientSocket.on(SocketEventsFromServer.AUTHENTICATION_COMPLETE, () => {
          // join a chat channel so we can see if they get sent back to it after the other player disconnects during the game room coundown sequence
          clientSocket.emit(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, battleRoomDefaultChatChannel);
        });
      });

      testUserSocket.on(SocketEventsFromServer.CHAT_CHANNEL_UPDATE, (data) => {
        // once they have joined a chat channel they can queue up for ranked, but only join ranked once
        if (!eventsThatHaveOccurred.testUserJoinedChatChannelForTheFirstTime) testUserSocket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
        else if (data.name === battleRoomDefaultChatChannel)
          conditionsToMeet.testUserSentToTheirPreviousRoomAfterTheirOpponentDisconnectedDuringRankedGameCountdownSequence = true;
        eventsThatHaveOccurred.testUserJoinedChatChannelForTheFirstTime = true;
      });

      testUserAlternateSocket.on(SocketEventsFromServer.CHAT_CHANNEL_UPDATE, () => {
        if (!eventsThatHaveOccurred.testUserAlternateJoinedChatChannelForTheFirstTime)
          testUserAlternateSocket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
        eventsThatHaveOccurred.testUserAlternateJoinedChatChannelForTheFirstTime = true;
      });

      testUserAlternateSocket.on(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE, () => {
        testUserAlternateSocket.disconnect();
      });

      testUserSocket.on(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE, () => {
        conditionsToMeet.testUserSocketGotCountdownEvent = true;
      });

      testUserSocket.on(SocketEventsFromServer.MATCHMAKING_QUEUE_ENTERED, () => {
        if (conditionsToMeet.testUserSocketGotCountdownEvent) {
          conditionsToMeet.testUserSocketPutBackInQueue = true;
          testUserSocket.disconnect();
        }
      });

      testUserSocket.on(GENERIC_SOCKET_EVENTS.DISCONNECT, () => {
        if (Object.values(conditionsToMeet).every((item) => item === true)) resolve(true);
      });
    });
    thisTest.then(() => {
      done();
    });
  });
});
