import createExpressApp from "../../createExpressApp";
import PGContext from "../PGContext";
import { RedisContext, wrappedRedis } from "../RedisContext";
import { TEST_USER_EMAIL, TEST_USER_NAME } from "./consts";
import createTestUser from "./createTestUser";

export default async function setupExpressRedisAndPgContextAndOneTestUser() {
  const pgContext = await PGContext.build();
  const expressApp = createExpressApp();
  wrappedRedis.context = RedisContext.build(true);
  await wrappedRedis.context.connect();
  await createTestUser(TEST_USER_NAME, TEST_USER_EMAIL);
  return { pgContext, expressApp };
}
