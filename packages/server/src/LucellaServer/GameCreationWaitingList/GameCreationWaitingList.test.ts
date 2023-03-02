/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-shadow */
import { Application } from "express";
import { IncomingMessage, Server, ServerResponse } from "http";
import { Socket } from "socket.io-client";
import {
  gameOverCountdownDuration,
  GameStatus,
  GENERIC_SOCKET_EVENTS,
  ONE_SECOND,
  randBetween,
  SocketEventsFromClient,
  SocketEventsFromServer,
} from "../../../../common";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { lucella } from "../../lucella";
import { LucellaServer } from "..";
import PGContext from "../../utils/PGContext";
import { wrappedRedis } from "../../utils/RedisContext";
import createLoggedInUsersWithConnectedSockets from "../../utils/test-utils/createTestUsersAndReturnSockets";
import putTwoClientSocketsInGameAndStartIt from "../../utils/test-utils/putTwoClientSocketsInGameAndStartIt";
import putTwoSocketClientsInRoomAndHaveBothReadyUp from "../../utils/test-utils/putTwoSocketClientsInRoomAndHaveBothReadyUp";

describe("GameCreationWaitingList", () => {
  let context: PGContext | undefined;
  let app: Application | undefined;
  let httpServer: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;
  const port = Math.round(randBetween(8081, 65535));
  const socketUrl = `http://localhost:${port}`;
  let clients: { [name: string]: Socket } = {};

  beforeAll((done) => {
    const tasks = new Promise(async (resolve, reject) => {
      // if (context) await context.cleanup();
      if (wrappedRedis.context && wrappedRedis.context.redisClient.isOpen) await wrappedRedis.context.cleanup();
      const { pgContext, expressApp } = await setupExpressRedisAndPgContextAndOneTestUser();
      context = pgContext;
      app = expressApp;

      httpServer = app.listen(port, async () => {
        lucella.server = new LucellaServer(httpServer);
        // set the limit to two games and reduce the waiting list interval to make the test go faster
        lucella.server.config.maxConcurrentGames = 2;
        lucella.server.config.gameCreationWaitingListLoopInterval = 1000;
        const usersToCreate = [
          { email: "user1@lucella.com", elo: 2000 },
          { email: "user2@lucella.com", elo: 1980 },
          { email: "user3@lucella.com", elo: 1950 },
          { email: "user4@lucella.com", elo: 1900 },
          { email: "user5@lucella.com", elo: 1800 },
          { email: "user6@lucella.com", elo: 1700 },
          { email: "user7@lucella.com", elo: 1800 },
          { email: "user8@lucella.com", elo: 1700 },
          { email: "user9@lucella.com", elo: 1800 },
          { email: "user10@lucella.com", elo: 1700 },
        ];
        clients = await createLoggedInUsersWithConnectedSockets(usersToCreate, socketUrl);
        resolve(true);
      });
    });
    tasks.then(() => {
      done();
    });
  });

  afterEach((done) => {
    const tasks = new Promise(async (resolve, reject) => {
      Object.values(clients).forEach((socket) => {
        socket.removeAllListeners();
        socket.on(SocketEventsFromServer.ERROR_MESSAGE, (data) => console.error(data));
        socket.disconnect();
      });
      await setTimeout(() => {
        resolve(true);
        console.log("waiting for games to wrap up");
      }, gameOverCountdownDuration * ONE_SECOND + ONE_SECOND); // allow any ongoing games to wrap up, giving one extra second to do so
    });
    tasks.then(() => {
      console.log(`aftereach ran, current games and game rooms: 
      \n games: 
      ${Object.values(lucella.server!.games).map((game) => `${game.gameName}, `)}
      \n gameRooms: ${Object.values(lucella.server!.lobby.gameRooms).map((gameRoom) => `${gameRoom.gameName}, `)}
      `);
      done();
    });
  });

  beforeEach((done) => {
    const tasks = new Promise(async (resolve, reject) => {
      console.log("beforeeach ran");
      const reconnectionPromises: Promise<boolean>[] = [];
      if (!Object.keys(clients).length) done();
      Object.values(clients).forEach((socket) => {
        if (!socket.connected)
          reconnectionPromises.push(
            new Promise((resolve, reject) => {
              socket.on(GENERIC_SOCKET_EVENTS.CONNECT, () => {
                socket.off(GENERIC_SOCKET_EVENTS.CONNECT);
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
      console.log(`Before Each ran, current games and game rooms: 
      \n games: 
      ${Object.values(lucella.server!.games).map((game) => `${game.gameName}, `)}
      \n gameRooms: ${Object.values(lucella.server!.lobby.gameRooms).map((gameRoom) => `${gameRoom.gameName}, `)}
      `);
      done();
    });
  });

  afterAll(async () => {
    lucella.server?.io.disconnectSockets();
    httpServer?.close();
    lucella.server = undefined;
    if (context) await context.cleanup();
    await wrappedRedis.context!.cleanup();
  });

  jest.setTimeout(27000);
  // it("after both players ready up and the maximum number of allowed games are in progress, delays game start until an open spot becomes available", (done) => {
  //   const thisTest = new Promise(async (resolve, reject) => {
  //     try {
  //       // start two games to reach the limit
  //       const gameStartPromises = [
  //         putTwoClientSocketsInGameAndStartIt(clients.user1, clients.user2, "game1"),
  //         putTwoClientSocketsInGameAndStartIt(clients.user3, clients.user4, "game2"),
  //       ];
  //       await Promise.all(gameStartPromises);
  //       console.log("two games started");
  //       // attempt to start a third game, it should put them in the waiting list
  //       const eventsOccurred = {
  //         user5HostedGame: false,
  //         user6JoinedGame: false,
  //         user5ClickedReady: false,
  //         user6ClickedReady: false,
  //         numberOfWaitingListUpdateMessagesReceivedByUser5: 0,
  //         numberOfWaitingListUpdateMessagesReceivedByUser6: 0,
  //         socketInFirstGameDisconnected: false,
  //         gameCountdownUpdateReceived: false,
  //         user5RecievedCompressedGamePacket: false,
  //         user6RecievedCompressedGamePacket: false,
  //       };

  //       // end one of the first two games, it should allow the third game to start
  //       clients.user5.on(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION, (data) => {
  //         expect(data).toBe(1);
  //         eventsOccurred.numberOfWaitingListUpdateMessagesReceivedByUser5 += 1;
  //         if (eventsOccurred.numberOfWaitingListUpdateMessagesReceivedByUser6 >= 2 && !eventsOccurred.socketInFirstGameDisconnected) {
  //           eventsOccurred.socketInFirstGameDisconnected = true;
  //           console.log("game has been in waiting list for two ticks, disconnecting user from first game");
  //           clients.user1.disconnect();
  //         }
  //       });
  //       clients.user6.on(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION, (data) => {
  //         expect(data).toBe(1);
  //         eventsOccurred.numberOfWaitingListUpdateMessagesReceivedByUser6 += 1;
  //         if (eventsOccurred.numberOfWaitingListUpdateMessagesReceivedByUser5 >= 2 && !eventsOccurred.socketInFirstGameDisconnected) {
  //           eventsOccurred.socketInFirstGameDisconnected = true;
  //           console.log("game has been in waiting list for two ticks, disconnecting user from first game");
  //           clients.user1.disconnect();
  //         }
  //       });

  //       clients.user5.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, (data) => {
  //         eventsOccurred.user5RecievedCompressedGamePacket = true;
  //         if (eventsOccurred.user6RecievedCompressedGamePacket) {
  //           Object.values(clients).forEach((socket) => socket.disconnect());
  //           resolve(true);
  //         }
  //       });
  //       clients.user6.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, (data) => {
  //         eventsOccurred.user6RecievedCompressedGamePacket = true;
  //         if (eventsOccurred.user5RecievedCompressedGamePacket) {
  //           Object.values(clients).forEach((socket) => socket.disconnect());
  //           resolve(true);
  //         }
  //       });

  //       clients.user5.on(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, (data) => {
  //         if (!data) return;
  //         eventsOccurred.user5HostedGame = true;
  //         if (!data.players.challenger) {
  //           clients.user6.emit(SocketEventsFromClient.JOINS_GAME, "game3");
  //           eventsOccurred.user6JoinedGame = true;
  //         } else if (!data.playersReady.host) {
  //           clients.user5.emit(SocketEventsFromClient.CLICKS_READY);
  //           eventsOccurred.user5ClickedReady = true;
  //           clients.user6.emit(SocketEventsFromClient.CLICKS_READY);
  //           eventsOccurred.user6ClickedReady = true;
  //         }
  //       });

  //       clients.user5.emit(SocketEventsFromClient.HOSTS_NEW_GAME, "game3");
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   });
  //   thisTest
  //     .then(() => {
  //       done();
  //     })
  //     .catch((error) => {
  //       expect(false).toBeTruthy();
  //     });
  // });

  it("removes a game from the waiting list and emits updates when a user unreadies from a game that is in the waiting list", (done) => {
    console.log('it("removes a game from the waiting list and emits updates when a user unreadies from a game that is in the waiting list"');

    const thisTest = new Promise(async (resolve, reject) => {
      try {
        const { user1, user5, user6, user7, user8 } = clients;
        // start two games to reach the limit
        const gameStartPromises = [
          putTwoClientSocketsInGameAndStartIt(clients.user1, clients.user2, "game1"),
          putTwoClientSocketsInGameAndStartIt(clients.user3, clients.user4, "game2"),
        ];
        await Promise.all(gameStartPromises);

        const eventsOccurred = {
          client5ReceivedWatingListInitialPosition: false,
          client6ReceivedWatingListInitialPosition: false,
          client7ReceivedWatingListInitialPosition: false,
          client8ReceivedWatingListInitialPosition: false,
          client5ReceivedInWaitingListStatus: false,
          client5Unreadied: false,
          client7ReceivedUpdatedWaitingListPosition: false,
          client8ReceivedUpdatedWaitingListPosition: false,
          game3PutBackInLobbyFromWaitingListAfterPlayerUnreadied: false,
          client5ReReadied: false,
          firstPairSentToBackOfLineAfterReReadying: false,
          firstGameInProgressEnded: false,
        };

        user5.on(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, async (data) => {
          console.log(data);
          if (data === GameStatus.IN_WAITING_LIST) eventsOccurred.client5ReceivedInWaitingListStatus = true;
          if (eventsOccurred.client5Unreadied && eventsOccurred.client5ReceivedInWaitingListStatus && data === GameStatus.IN_LOBBY) {
            //    3.a they should get an update that their game room is now IN_LOBBY status
            eventsOccurred.game3PutBackInLobbyFromWaitingListAfterPlayerUnreadied = true;
            console.log("game3 put back in lobby after unreadying");
          }
        });

        user5.on(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION, async (data) => {
          if (!eventsOccurred.client5ReceivedWatingListInitialPosition) {
            expect(data).toBe(1);
            eventsOccurred.client5ReceivedWatingListInitialPosition = true;
          }
          // 4.a the first pair should get an update that they are back in the waiting list queue at the end of the line
          if (eventsOccurred.client5ReReadied && !eventsOccurred.firstPairSentToBackOfLineAfterReReadying && !eventsOccurred.firstGameInProgressEnded) {
            expect(data).toBe(2);
            // 5 disconnect one of the current games in progress
            user1.disconnect();
            eventsOccurred.firstGameInProgressEnded = true;
          }
        });
        user6.on(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION, (data) => {
          if (!eventsOccurred.client6ReceivedWatingListInitialPosition) {
            expect(data).toBe(1);
            eventsOccurred.client6ReceivedWatingListInitialPosition = true;
          }
        });
        user7.on(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION, async (data) => {
          console.log("user7.on(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION", data);
          if (!eventsOccurred.client7ReceivedWatingListInitialPosition) {
            if (!eventsOccurred.client5Unreadied) expect(data).toBe(2);
            eventsOccurred.client7ReceivedWatingListInitialPosition = true;
          }
          // 3. have one of the first pair of users unready
          if (eventsOccurred.client8ReceivedWatingListInitialPosition && !eventsOccurred.client5Unreadied) {
            user5.emit(SocketEventsFromClient.CLICKS_READY);
            eventsOccurred.client5Unreadied = true;
            console.log("user 5 unreadied");
          }
          //    3.b the other pair's next waiting list update should show their position in line has decreased
          if (data === 1) {
            if (!eventsOccurred.client5Unreadied) reject();
            else if (!eventsOccurred.client5ReReadied && !eventsOccurred.firstGameInProgressEnded) {
              eventsOccurred.client7ReceivedUpdatedWaitingListPosition = true;
              console.log(lucella.server?.gameCreationWaitingList.gameRoomsWaitingToStart);
              // 4. have the unreadied user ready up again
              user5.emit(SocketEventsFromClient.CLICKS_READY);
              eventsOccurred.client5ReReadied = true;
            }
          }
        });

        user8.on(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION, (data) => {
          console.log("user8.on(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION", data);
          if (!eventsOccurred.client8ReceivedWatingListInitialPosition) {
            if (!eventsOccurred.client5Unreadied) expect(data).toBe(2);
            eventsOccurred.client8ReceivedWatingListInitialPosition = true;
          }
          if (data === 1) {
            if (!eventsOccurred.client5Unreadied) reject();
            else eventsOccurred.client8ReceivedUpdatedWaitingListPosition = true;
          }
        });

        user7.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, async () => {
          if (!eventsOccurred.firstGameInProgressEnded) return reject();
          // 5.a the 4th pair of users should have their game started
          console.log("4th pair of user's game started");
          Object.values(clients).forEach((socket) => socket.disconnect());
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(true);
            }, gameOverCountdownDuration * ONE_SECOND + ONE_SECOND);
          });
          resolve(true);
        });

        // 1. have two test users ready up in a game and get entered into the waiting list
        await putTwoSocketClientsInRoomAndHaveBothReadyUp(clients.user5, clients.user6, "game3");
        // 2. have a second pair of users ready up and enter the list behind the first pair
        await putTwoSocketClientsInRoomAndHaveBothReadyUp(clients.user7, clients.user8, "game4");
        console.log(lucella.server?.gameCreationWaitingList.gameRoomsWaitingToStart);
      } catch (error) {
        console.error(error);
      }
    });

    thisTest
      .then(() => {
        done();
      })
      .catch((error) => {
        expect(false).toBeTruthy();
      });
  });

  // it("works for ranked games as well as casual", (done) => {
  //   const thisTest = new Promise(async (resolve, reject) => {
  //     const { user1, user5, user6, user7, user8, user9, user10 } = clients;
  //     Object.values(clients).forEach((clientSocket) => {
  //       clientSocket.on(SocketEventsFromServer.ERROR_MESSAGE, (data) => console.error(data));
  //     });

  //     const gameStartPromises = [
  //       putTwoClientSocketsInGameAndStartIt(clients.user1, clients.user2, "game1"),
  //       putTwoClientSocketsInGameAndStartIt(clients.user3, clients.user4, "game2"),
  //     ];
  //     await Promise.all(gameStartPromises);

  //     const eventsOccurred = {
  //       client5ReceivedMatchmakingQueueEnteredMessage: false,
  //       client6ReceivedMatchmakingQueueEnteredMessage: false,
  //       client5WasPutInWaitingListAfterBeingMatchedForRanked: false,
  //       client6WasPutInWaitingListAfterBeingMatchedForRanked: false,
  //       user1DisconnectedFromGame1: false,
  //       rankedGameStartedForClients5And6: false,
  //       client7ReceivedMatchmakingQueueEnteredMessage: false,
  //       client8ReceivedMatchmakingQueueEnteredMessage: false,
  //       secondRankedGamePlacedInWaitingList: false,
  //       thirdRankedGamePlacedInWaitingList: false,
  //     };

  //     user9.on(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION, (data) => {
  //       if (!eventsOccurred.thirdRankedGamePlacedInWaitingList) {
  //         eventsOccurred.thirdRankedGamePlacedInWaitingList = true;
  //         expect(data).toBe(2);
  //         Object.values(clients).forEach((clientSocket) => {
  //           clientSocket.on(SocketEventsFromServer.ERROR_MESSAGE, (data) => console.error(data));
  //         });
  //         resolve(true);
  //       }
  //     });

  //     user7.on(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION, (data) => {
  //       if (!eventsOccurred.client7ReceivedMatchmakingQueueEnteredMessage) reject();
  //       if (!eventsOccurred.secondRankedGamePlacedInWaitingList) {
  //         eventsOccurred.secondRankedGamePlacedInWaitingList = true;
  //         expect(data).toBe(1);
  //         user9.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
  //         user10.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
  //       }
  //     });

  //     user7.on(SocketEventsFromServer.MATCHMAKING_QUEUE_ENTERED, () => {
  //       if (!eventsOccurred.client7ReceivedMatchmakingQueueEnteredMessage) eventsOccurred.client7ReceivedMatchmakingQueueEnteredMessage = true;
  //     });
  //     user8.on(SocketEventsFromServer.MATCHMAKING_QUEUE_ENTERED, () => {
  //       if (!eventsOccurred.client8ReceivedMatchmakingQueueEnteredMessage) eventsOccurred.client8ReceivedMatchmakingQueueEnteredMessage = true;
  //     });

  //     user5.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, () => {
  //       if (!eventsOccurred.rankedGameStartedForClients5And6) {
  //         eventsOccurred.rankedGameStartedForClients5And6 = true;
  //         user7.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
  //         user8.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
  //       }
  //     });

  //     user5.on(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION, (data) => {
  //       if (!eventsOccurred.client5ReceivedMatchmakingQueueEnteredMessage) reject();
  //       if (!eventsOccurred.client5WasPutInWaitingListAfterBeingMatchedForRanked) {
  //         expect(data).toBe(1);
  //         eventsOccurred.client5WasPutInWaitingListAfterBeingMatchedForRanked = true;
  //         if (eventsOccurred.client5WasPutInWaitingListAfterBeingMatchedForRanked && eventsOccurred.client6WasPutInWaitingListAfterBeingMatchedForRanked) {
  //           user1.disconnect();
  //           eventsOccurred.user1DisconnectedFromGame1 = true;
  //         }
  //       }
  //     });
  //     user6.on(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION, (data) => {
  //       if (!eventsOccurred.client6ReceivedMatchmakingQueueEnteredMessage) reject();
  //       if (!eventsOccurred.client6WasPutInWaitingListAfterBeingMatchedForRanked) {
  //         expect(data).toBe(1);
  //         eventsOccurred.client6WasPutInWaitingListAfterBeingMatchedForRanked = true;
  //         if (eventsOccurred.client5WasPutInWaitingListAfterBeingMatchedForRanked && eventsOccurred.client6WasPutInWaitingListAfterBeingMatchedForRanked) {
  //           clients.user1.disconnect();
  //           eventsOccurred.user1DisconnectedFromGame1 = true;
  //         }
  //       }
  //     });

  //     user5.on(SocketEventsFromServer.MATCHMAKING_QUEUE_ENTERED, () => {
  //       if (!eventsOccurred.client5ReceivedMatchmakingQueueEnteredMessage) eventsOccurred.client5ReceivedMatchmakingQueueEnteredMessage = true;
  //     });
  //     user6.on(SocketEventsFromServer.MATCHMAKING_QUEUE_ENTERED, () => {
  //       if (!eventsOccurred.client6ReceivedMatchmakingQueueEnteredMessage) eventsOccurred.client6ReceivedMatchmakingQueueEnteredMessage = true;
  //     });

  //     user5.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
  //     user6.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
  //     // start two casual games (2 max)
  //     // attempt to start one ranked game
  //     //  ranked game players should receive waiting list update
  //     // end one of the games in progress
  //     //  ranked game players should have their game started
  //     // attempt to start another ranked game
  //     //  ranked players in 2nd ranked game should get waiting list update
  //     // attempt to start a third ranked game
  //     //  ranked players in 3rd ranked game should get waiting list update

  //     // ranked player in 2nd ranked game should unready (unreadying should only be allowed from the waiting list, not if game is counting down or any other status)
  //     //  ranked players in 3rd ranked game should get updated waiting list position
  //   });

  //   thisTest
  //     .then(() => {
  //       done();
  //     })
  //     .catch((error) => {
  //       expect(false).toBeTruthy();
  //     });
  // });
});
