/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-async-promise-executor */
import { Application } from "express";
import { IncomingMessage, Server, ServerResponse } from "http";
import { io, Socket } from "socket.io-client";
import request from "supertest";
import {
  BattleRoomConfigRoutePaths,
  BattleRoomGameConfigOptionIndices,
  BattleRoomGameOptions,
  CookieNames,
  ERROR_MESSAGES,
  gameOverCountdownDuration,
  GameRoom,
  ONE_SECOND,
  randBetween,
  SocketEventsFromClient,
  SocketEventsFromServer,
} from "../../../../common";
import { BattleRoomGameConfig } from "../../../../common/src/classes/BattleRoomGame/BattleRoomGameConfig";
import { lucella } from "../../lucella";
import { LucellaServer } from "../../LucellaServer";
import PGContext from "../../utils/PGContext";
import { wrappedRedis } from "../../utils/RedisContext";
import { TEST_USER_EMAIL } from "../../utils/test-utils/consts";
import createLoggedInUsersWithConnectedSockets from "../../utils/test-utils/createTestUsersAndReturnSockets";
import logTestUserIn from "../../utils/test-utils/logTestUserIn";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";

describe("createOrUpdateBattleRoomGameSettings", () => {
  let context: PGContext | undefined;
  let app: Application | undefined;
  let httpServer: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;
  const port = Math.round(randBetween(8081, 65535));
  const socketUrl = `http://localhost:${port}`;
  let clients: { [name: string]: Socket } = {};
  beforeAll(async () => {
    const { pgContext, expressApp } = await setupExpressRedisAndPgContextAndOneTestUser();
    context = pgContext;
    app = expressApp;
    httpServer = app.listen(port, () => {
      lucella.server = new LucellaServer(httpServer);
    });
    const usersToCreate = [
      { email: "firstplace@lucella.com", elo: 2000 },
      { email: "secondplace@lucella.com", elo: 1980 },
    ];
    clients = await createLoggedInUsersWithConnectedSockets(usersToCreate, socketUrl);
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
      setTimeout(() => {
        resolve(true);
        console.log("waiting for games to wrap up");
      }, gameOverCountdownDuration * ONE_SECOND + ONE_SECOND); // allow any ongoing games to wrap up, giving one extra second to do so
    });
    tasks.then(() => {
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

  jest.setTimeout(20000);

  // field to edit
  const optionNameToAttemptModifying = Object.keys(BattleRoomGameOptions)[0];
  const { defaultIndex } = BattleRoomGameOptions[optionNameToAttemptModifying as keyof typeof BattleRoomGameOptions];
  const nonDefaultIndex = defaultIndex === 0 ? 1 : 0;
  //

  it(`lets a logged in user save and retrieve Battle Room game settings,
    and uses default values if out of bound indices or junk data is sent,
    and user can reset to defaults`, async () => {
    // can't edit settings if not logged in
    const unauthedEditResponse = await request(app).put(`/api${BattleRoomConfigRoutePaths.ROOT}`).send(new BattleRoomGameConfigOptionIndices({}));
    expect(unauthedEditResponse.status).toBe(401);
    const { user, accessToken } = await logTestUserIn(TEST_USER_EMAIL);
    // can get settings if logged in (should create default settings as this is a new user)
    const getResponse = await request(app)
      .get(`/api${BattleRoomConfigRoutePaths.ROOT}`)
      .set("Cookie", [`${CookieNames.ACCESS_TOKEN}=${accessToken}`]);
    const defaultOptionIndices = new BattleRoomGameConfigOptionIndices({});
    Object.entries(defaultOptionIndices).forEach(([key, value]) => {
      expect(value).toEqual(getResponse.body[key]);
    });
    // can edit settings if logged in
    const randomNewValues = new BattleRoomGameConfigOptionIndices({});
    Object.keys(randomNewValues).forEach((key) => {
      const newValue = Math.round(randBetween(0, BattleRoomGameOptions[key as keyof typeof BattleRoomGameOptions].options.length - 1));
      // @ts-ignore
      randomNewValues[key] = newValue;
    });
    const authedEditResponse = await request(app)
      .put(`/api${BattleRoomConfigRoutePaths.ROOT}`)
      .set("Cookie", [`${CookieNames.ACCESS_TOKEN}=${accessToken}`])
      .send(randomNewValues);
    // subsequent get requests show the changes
    const getResponseAfterEdits = await request(app)
      .get(`/api${BattleRoomConfigRoutePaths.ROOT}`)
      .set("Cookie", [`${CookieNames.ACCESS_TOKEN}=${accessToken}`]);
    Object.entries(randomNewValues).forEach(([key, value]) => {
      expect(value).toEqual(getResponseAfterEdits.body[key]);
    });
    // attempting to save invalid data just results in setting default values
    const junkUpdate = { acceleration: 0.02, topSpeed: "15", numberOfRoundsRequiredToWin: NaN };
    const junkDataRequest = await request(app)
      .put(`/api${BattleRoomConfigRoutePaths.ROOT}`)
      .set("Cookie", [`${CookieNames.ACCESS_TOKEN}=${accessToken}`])
      .send({ ...junkUpdate });
    console.log(junkDataRequest.status);
    const getResponseAfterJunkEdit = await request(app)
      .get(`/api${BattleRoomConfigRoutePaths.ROOT}`)
      .set("Cookie", [`${CookieNames.ACCESS_TOKEN}=${accessToken}`]);
    expect(getResponseAfterJunkEdit.body.acceleration).toBe(defaultOptionIndices.acceleration);
    expect(getResponseAfterJunkEdit.body.topSpeed).toBe(defaultOptionIndices.topSpeed);
    expect(getResponseAfterJunkEdit.body.numberOfRoundsRequiredToWin).toBe(defaultOptionIndices.numberOfRoundsRequiredToWin);
    // user can reset to defaults
    const resetToDefaultsRequest = await request(app)
      .put(`/api${BattleRoomConfigRoutePaths.ROOT}${BattleRoomConfigRoutePaths.RESET}`)
      .set("Cookie", [`${CookieNames.ACCESS_TOKEN}=${accessToken}`])
      .send();
    const getResponseAfterReset = await request(app)
      .get(`/api${BattleRoomConfigRoutePaths.ROOT}`)
      .set("Cookie", [`${CookieNames.ACCESS_TOKEN}=${accessToken}`]);
    Object.entries(defaultOptionIndices).forEach(([key, value]) => {
      expect(value).toEqual(getResponseAfterReset.body[key]);
    });
  });

  it(`doesn't let user edit settings in ranked game`, (done) => {
    const thisTest = new Promise(async (resolve, reject) => {
      const { firstplace, secondplace } = clients;
      const eventsOccurred = {
        firstPlayerSentEditRequest: false,
        secondPlayerSentEditRequest: false,
      };

      // can't edit ranked game config
      firstplace.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, () => {
        firstplace.emit(SocketEventsFromClient.LEAVES_GAME);
        resolve(true);
      });
      const rejectIfRankedGameRoomWasModified = () => {
        if (
          Object.values(lucella.server!.lobby.gameRooms)[0].battleRoomGameConfigOptionIndices[optionNameToAttemptModifying as keyof BattleRoomGameConfig] !==
          defaultIndex
        )
          reject(new Error("User was able to modify config in ranked game"));
      };
      firstplace.on(SocketEventsFromServer.GAME_INITIALIZATION, rejectIfRankedGameRoomWasModified);
      secondplace.on(SocketEventsFromServer.GAME_INITIALIZATION, rejectIfRankedGameRoomWasModified);

      firstplace.on(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE, () => {
        if (eventsOccurred.firstPlayerSentEditRequest) return;
        eventsOccurred.firstPlayerSentEditRequest = true;
        firstplace.emit(SocketEventsFromClient.GAME_ROOM_CONFIG_EDIT_REQUEST, { [optionNameToAttemptModifying]: nonDefaultIndex });
      });
      secondplace.on(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE, () => {
        if (eventsOccurred.secondPlayerSentEditRequest) return;
        eventsOccurred.secondPlayerSentEditRequest = true;
        secondplace.emit(SocketEventsFromClient.GAME_ROOM_CONFIG_EDIT_REQUEST, { [optionNameToAttemptModifying]: nonDefaultIndex });
      });

      firstplace.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
      secondplace.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
    });
    thisTest
      .then(() => {
        done();
      })
      .catch((error) => {
        console.log(error);
        expect(true).toBe(false);
      });
  });

  it(`lets a user edit settings in their hosted game,
    doesn't let non host players edit the settings,
    and saves the settings when the game starts,`, (done) => {
    const thisTest = new Promise(async (resolve, reject) => {
      const { firstplace, secondplace } = clients;
      const eventsOccurred = {
        playerHostedCasualGame: false,
        secondPlayerJoinedCasualGame: false,
        playerEditedCasualGame: false,
        firstPlayerReceivedConfigEditUpdate: false,
        secondPlayerReceivedConfigEditUpdate: false,
        secondPlayerSentConfig: false,
        playersReadiedUpInCasualGame: false,
        casualGameStarted: false,
        firstPlayerLeftCasualGame: false,
        firstPlayerHostedSecondGame: false,
      };
      //   //   config is saved after game starts
      firstplace.on(SocketEventsFromServer.CURRENT_GAME_ROOM, (data: GameRoom) => {
        if (!eventsOccurred.firstPlayerHostedSecondGame) return;
        console.log("second game data: ", data);
        if (data.battleRoomGameConfigOptionIndices[optionNameToAttemptModifying as keyof BattleRoomGameConfigOptionIndices] === nonDefaultIndex) resolve(true);
        else reject(new Error("Game settings from the last started game were not applied"));
      });

      firstplace.on(SocketEventsFromServer.CURRENT_GAME_ROOM, (data) => {
        if (!eventsOccurred.firstPlayerLeftCasualGame || eventsOccurred.firstPlayerHostedSecondGame) return;
        console.log("should be null game room: ", data);
        firstplace.emit(SocketEventsFromClient.HOSTS_NEW_GAME, "b");
        eventsOccurred.firstPlayerHostedSecondGame = true;
      });

      firstplace.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, () => {
        if (!eventsOccurred.casualGameStarted) return;
        firstplace.emit(SocketEventsFromClient.LEAVES_GAME);
        eventsOccurred.firstPlayerLeftCasualGame = true;
      });

      secondplace.on(SocketEventsFromServer.ERROR_MESSAGE, (data) => {
        if (data !== ERROR_MESSAGES.LOBBY.ONLY_HOST_MAY_EDIT_GAME_CONFIG || eventsOccurred.playersReadiedUpInCasualGame) return;
        eventsOccurred.playersReadiedUpInCasualGame = true;
        secondplace.emit(SocketEventsFromClient.CLICKS_READY);
        firstplace.emit(SocketEventsFromClient.CLICKS_READY);
        eventsOccurred.casualGameStarted = true;
      });

      // non host can't edit config
      firstplace.on(SocketEventsFromServer.CURRENT_GAME_ROOM_CONFIG, () => {
        if (eventsOccurred.secondPlayerSentConfig && !eventsOccurred.playersReadiedUpInCasualGame)
          reject(new Error("non host player was able to configure game"));
      });

      function sendConfigFromNonHostplayer() {
        secondplace.emit(SocketEventsFromClient.GAME_ROOM_CONFIG_EDIT_REQUEST, { [optionNameToAttemptModifying]: defaultIndex });
        eventsOccurred.secondPlayerSentConfig = true;
        console.log("non host player sent config");
      }

      function expectModifiedValue(data: any) {
        expect(data[optionNameToAttemptModifying]).toBe(nonDefaultIndex);
        expect(
          lucella.server?.lobby.gameRooms["a"].battleRoomGameConfigOptionIndices[optionNameToAttemptModifying as keyof BattleRoomGameConfigOptionIndices]
        ).toBe(nonDefaultIndex);
      }

      // both players receive config updates when host changes config
      secondplace.on(SocketEventsFromServer.CURRENT_GAME_ROOM_CONFIG, (data) => {
        if (eventsOccurred.secondPlayerReceivedConfigEditUpdate) return;
        expectModifiedValue(data);
        eventsOccurred.secondPlayerReceivedConfigEditUpdate = true;
        if (eventsOccurred.firstPlayerReceivedConfigEditUpdate && eventsOccurred.secondPlayerReceivedConfigEditUpdate && !eventsOccurred.secondPlayerSentConfig)
          sendConfigFromNonHostplayer();
      });

      firstplace.on(SocketEventsFromServer.CURRENT_GAME_ROOM_CONFIG, (data) => {
        if (eventsOccurred.firstPlayerReceivedConfigEditUpdate) return;
        expectModifiedValue(data);
        eventsOccurred.firstPlayerReceivedConfigEditUpdate = true;
        if (eventsOccurred.firstPlayerReceivedConfigEditUpdate && eventsOccurred.secondPlayerReceivedConfigEditUpdate && !eventsOccurred.secondPlayerSentConfig)
          sendConfigFromNonHostplayer();
      });

      secondplace.on(SocketEventsFromServer.CURRENT_GAME_ROOM, (data) => {
        if (eventsOccurred.secondPlayerJoinedCasualGame) return;
        firstplace.emit(SocketEventsFromClient.GAME_ROOM_CONFIG_EDIT_REQUEST, { [optionNameToAttemptModifying]: nonDefaultIndex });
        eventsOccurred.secondPlayerJoinedCasualGame = true;
        console.log("firstplace sent edit request");
      });

      firstplace.on(SocketEventsFromServer.CURRENT_GAME_ROOM, (data) => {
        if (eventsOccurred.playerHostedCasualGame || eventsOccurred.secondPlayerJoinedCasualGame) return;
        secondplace.emit(SocketEventsFromClient.JOINS_GAME, "a");
        console.log("second place tried joining game a", data);
        eventsOccurred.playerHostedCasualGame = true;
      });

      firstplace.emit(SocketEventsFromClient.HOSTS_NEW_GAME, "a");
    });
    thisTest
      .then(() => {
        done();
      })
      .catch((error) => {
        console.log(error);
        expect(false).toBeTruthy();
      });
  });
});
