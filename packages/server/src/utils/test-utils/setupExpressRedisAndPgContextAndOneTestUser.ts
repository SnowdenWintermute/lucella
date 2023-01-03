import bcrypt from "bcryptjs";
import createExpressApp from "../../createExpressApp";
import PGContext from "../PGContext";
import { RedisContext, wrappedRedis } from "../RedisContext";
import { TEST_USER_EMAIL, TEST_USER_NAME, TEST_USER_PASSWORD } from "./consts";
import UserRepo from "../../database/repos/users";

export default async function setupExpressRedisAndPgContextAndOneTestUser() {
  const pgContext = await PGContext.build();
  const expressApp = createExpressApp();
  wrappedRedis.context = RedisContext.build(true);
  await wrappedRedis.context.connect();
  const hashedPassword = await bcrypt.hash(TEST_USER_PASSWORD, 12);
  await UserRepo.insert(TEST_USER_NAME, TEST_USER_EMAIL, hashedPassword);
  return { pgContext, expressApp };
}
