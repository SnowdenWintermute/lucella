import { NextFunction, Request, Response } from "express";
import redisClient, { connectRedis } from "../../utils/connectRedis";
import { wrappedRedis } from "../../utils/RedisContext";
import logout from "./utils/logout";

export default async function logoutHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = res.locals.user;
    // if (!redisClient.isOpen) await connectRedis();
    // await redisClient.del(user.id.toString());
    await wrappedRedis.context!.del(user.id.toString());
    logout(res);
    return res.status(200).json({ status: "success" });
  } catch (err: any) {
    next(err);
  }
}
