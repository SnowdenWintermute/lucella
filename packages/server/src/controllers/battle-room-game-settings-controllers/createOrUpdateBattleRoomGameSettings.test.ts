import { Application } from "express";
import request from "supertest";
import { BattleRoomConfigRoutePaths, BattleRoomGameConfigOptionIndices, BattleRoomGameOptions, CookieNames, randBetween } from "../../../../common";
import PGContext from "../../utils/PGContext";
import { wrappedRedis } from "../../utils/RedisContext";
import { TEST_USER_EMAIL } from "../../utils/test-utils/consts";
import logTestUserIn from "../../utils/test-utils/logTestUserIn";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";

describe("createOrUpdateBattleRoomGameSettings", () => {
  let context: PGContext | undefined;
  let app: Application | undefined;
  beforeAll(async () => {
    try {
      const { pgContext, expressApp } = await setupExpressRedisAndPgContextAndOneTestUser();
      context = pgContext;
      app = expressApp;
    } catch (error) {
      console.log(error);
    }
  });
  beforeEach(async () => {
    await wrappedRedis.context!.removeAllKeys();
  });
  afterAll(async () => {
    if (context) await context.cleanup();
    await wrappedRedis.context!.cleanup();
  });

  jest.setTimeout(10000);

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

  //   it(`lets a user edit settings in their hosted game,
  //   doesn't let non host players edit the settings,
  //   and saves the settings when the game starts`, async () => {
  //     const { user, accessToken } = await logTestUserIn(TEST_USER_EMAIL);
  //   });
});
