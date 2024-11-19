import { NextFunction, Request, Response } from "express";
import { wrappedRedis } from "../utils/RedisContext";
import { env } from "../validate-env";

export default function refreshSession(req: Request, res: Response, next: NextFunction) {
  const { user } = res.locals;
  wrappedRedis.context!.set(user.id.toString(), JSON.stringify(user), {
    EX: env.AUTH_SESSION_EXPIRATION,
  });

  next();
}
