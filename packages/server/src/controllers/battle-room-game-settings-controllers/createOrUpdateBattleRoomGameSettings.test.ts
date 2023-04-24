import { Application } from "express";
import request from "supertest";
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

  it(`lets a logged in user save and retrieve Battle Room game settings,
  and uses default values if out of bound indices or junk data is sent`, async () => {
    // can't edit settings if not logged in
    // can get settings if logged in (should create default settings as this is a new user)
    // can edit settings if logged in
    const { user, accessToken } = await logTestUserIn(TEST_USER_EMAIL);
    // can get updated settings
    // attempting to save invalid data just results in setting default values
  });

  it(`lets a user edit settings in their hosted game,
  doesn't let non host players edit the settings,
  and saves the settings when the game starts`, async () => {
    const { user, accessToken } = await logTestUserIn(TEST_USER_EMAIL);
  });
});
