import request from "supertest";
import { Application } from "express";
import UserRepo from "../../database/repos/users";
import PGContext from "../../utils/PGContext";
import { wrappedRedis } from "../../utils/RedisContext";
import createSequentialEloTestUsers from "../../utils/test-utils/createSequentialEloTestUsers";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { BattleRoomGame, GameRoom, LadderRoutePaths, PlayerRole, SocketMetadata } from "../../../../common";
import loadLadderIntoRedis from "../../utils/loadLadderIntoRedis";
import updateScoreCardsAndSaveGameRecord from "./updateScoreCardsAndSaveGameRecord";

describe("updateScoreCardsAndSaveGameRecord (ladder and elo change behavior)", () => {
  let context: PGContext | undefined;
  let app: Application | undefined;
  beforeAll(async () => {
    const { pgContext, expressApp } = await setupExpressRedisAndPgContextAndOneTestUser();
    context = pgContext;
    app = expressApp;
  });

  beforeEach(async () => {
    await wrappedRedis.context!.removeAllKeys();
  });

  afterAll(async () => {
    if (context) await context.cleanup();
    await wrappedRedis.context!.cleanup();
  });

  jest.setTimeout(15000);
  it(`correctly changes the ranks of players after a ranked game resolves and new ranks are reflected when fetching
  ladder pages and individual ladder entries`, async () => {
    await createSequentialEloTestUsers(10, 200, 10);
    await loadLadderIntoRedis();
    const users = await UserRepo.find();
    expect(users).toHaveLength(11);

    const userWith210Elo = await request(app).get(`/api${LadderRoutePaths.ROOT}${LadderRoutePaths.BATTLE_ROOM}${LadderRoutePaths.ENTRIES}/test-210`);
    const userWith220Elo = await request(app).get(`/api${LadderRoutePaths.ROOT}${LadderRoutePaths.BATTLE_ROOM}${LadderRoutePaths.ENTRIES}/test-220`);
    expect(userWith210Elo.body.ladderEntry.rank).toBe(9);
    expect(userWith220Elo.body.ladderEntry.rank).toBe(8);
    const ladderPage0BeforeGame = await request(app).get(`/api${LadderRoutePaths.ROOT}${LadderRoutePaths.BATTLE_ROOM}/0`);

    expect(ladderPage0BeforeGame.body.pageData[8].name).toBe("test-210");
    expect(ladderPage0BeforeGame.body.pageData[7].name).toBe("test-220");

    const gameRoom = new GameRoom("game-test", true);
    const game = new BattleRoomGame("game-test", true);
    const user210SocketMeta = new SocketMetadata("someSocketId", "someip", { username: "test-210", isGuest: false }, "someChannel", "game-test");
    const user220SocketMeta = new SocketMetadata("someSocketId", "someip", { username: "test-220", isGuest: false }, "someChannel", "game-test");
    gameRoom.players.host = user210SocketMeta;
    gameRoom.players.challenger = user220SocketMeta;
    game.winner = PlayerRole.HOST;
    await updateScoreCardsAndSaveGameRecord(gameRoom, game);

    const userWith210EloPostGameLadderEntry = await request(app).get(
      `/api${LadderRoutePaths.ROOT}${LadderRoutePaths.BATTLE_ROOM}${LadderRoutePaths.ENTRIES}/test-210`
    );
    const userWith220EloPostGameLadderEntry = await request(app).get(
      `/api${LadderRoutePaths.ROOT}${LadderRoutePaths.BATTLE_ROOM}${LadderRoutePaths.ENTRIES}/test-220`
    );
    expect(userWith210EloPostGameLadderEntry.body.ladderEntry.rank).toBe(8);
    expect(userWith220EloPostGameLadderEntry.body.ladderEntry.rank).toBe(9);
    const ladderPage0 = await request(app).get(`/api${LadderRoutePaths.ROOT}${LadderRoutePaths.BATTLE_ROOM}/0`);
    expect(ladderPage0.body.pageData[7].name).toBe("test-210");
    expect(ladderPage0.body.pageData[8].name).toBe("test-220");
  });
});
