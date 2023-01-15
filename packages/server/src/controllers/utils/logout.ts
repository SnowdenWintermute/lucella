import { Response } from "express";
import { CookieNames } from "../../../../common";
import { wrappedRedis } from "../../utils/RedisContext";

export default async function logout(res: Response) {
  const { user } = res.locals;
  if (user) await wrappedRedis.context!.del(user.id.toString());
  res.cookie(CookieNames.ACCESS_TOKEN, "", { maxAge: 1 });
}
