import { User } from "../../../../common";
import { wrappedRedis } from "../../utils/RedisContext";
import { signJwt } from "./jwt";

export default async function signTokenAndCreateSession(user: User) {
  const accessToken = signJwt({ sub: user.id }, process.env.ACCESS_TOKEN_PRIVATE_KEY!, {
    expiresIn: `${parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN!, 10) / 1000 / 60}m`,
  });

  wrappedRedis.context!.set(user.id.toString(), JSON.stringify(user), {
    EX: parseInt(process.env.AUTH_SESSION_EXPIRATION!, 10),
  });

  return { accessToken };
}
