import { User } from "../../../../common";
import { wrappedRedis } from "../../utils/RedisContext";
import { env } from "../../validate-env";
import { signJwtAsymmetric } from "./jwt";

export default async function signTokenAndCreateSession(user: User) {
  const accessToken = signJwtAsymmetric({ sub: user.id }, env.ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn: `${env.ACCESS_TOKEN_EXPIRES_IN / 1000 / 60}m`,
  });

  wrappedRedis.context!.set(user.id.toString(), JSON.stringify(user), {
    EX: env.AUTH_SESSION_EXPIRATION,
  });

  return { accessToken };
}
