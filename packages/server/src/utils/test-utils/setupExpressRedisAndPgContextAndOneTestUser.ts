import createExpressApp from "../../createExpressApp";
import PGContext from "../PGContext";
import { RedisContext, wrappedRedis } from "../RedisContext";
import request from "supertest";
import { AuthRoutePaths } from "../../../../common";
import { TEST_USER_EMAIL, TEST_USER_NAME, TEST_USER_PASSWORD } from "./consts";

export default async function setupExpressRedisAndPgContextAndOneTestUser() {
  const pgContext = await PGContext.build();
  const expressApp = createExpressApp();
  wrappedRedis.context = RedisContext.build(true);
  await wrappedRedis.context.connect();
  await request(expressApp)
    .post(`/api${AuthRoutePaths.BASE + AuthRoutePaths.REGISTER}`)
    .send({
      name: TEST_USER_NAME,
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
      passwordConfirm: TEST_USER_PASSWORD,
    });
  return { pgContext, expressApp };
}
