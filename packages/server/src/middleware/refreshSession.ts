import { NextFunction, Request, Response } from "express";
import { wrappedRedis } from "../utils/RedisContext";

export default function refreshSession(req: Request, res: Response, next: NextFunction) {
  const { user } = res.locals;
  wrappedRedis.context!.set(user.id.toString(), JSON.stringify(user), {
    EX: parseInt(process.env.AUTH_SESSION_EXPIRATION!, 10),
  });

  next();
}
