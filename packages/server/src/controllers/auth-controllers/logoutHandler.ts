import { NextFunction, Request, Response } from "express";
import { wrappedRedis } from "../../utils/RedisContext";
import logout from "./utils/logout";

export default async function logoutHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = res.locals.user;
    await wrappedRedis.context!.del(user.id.toString());
    logout(res);
    return res.sendStatus(200);
  } catch (err: any) {
    next(err);
  }
}
