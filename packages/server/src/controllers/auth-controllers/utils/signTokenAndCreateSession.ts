import { User } from "../../../models/User";
import { wrappedRedis } from "../../../utils/RedisContext";
import { signJwt } from "./jwt";

export default async function signTokenAndCreateSession(user: User) {
  const access_token = signJwt({ sub: user.id }, process.env.ACCESS_TOKEN_PRIVATE_KEY!, {
    expiresIn: `${parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN!) / 1000 / 60}m`,
  });

  const refresh_token = signJwt({ sub: user.id }, process.env.REFRESH_TOKEN_PRIVATE_KEY!, {
    expiresIn: `${parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN!) / 1000 / 60}m`,
  });

  wrappedRedis.context!.set(user.id.toString(), JSON.stringify(user), {
    EX: parseInt(process.env.REDIS_SESSION_EXPIRATION!),
  });

  return { access_token, refresh_token };
}
