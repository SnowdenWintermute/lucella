import { NextFunction, Request, Response } from "express";
import redisClient from "../../utils/connectRedis";
import logout from "./utils/logout";

export default async function logoutHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = res.locals.user;
    await redisClient.del(user.id.toString());
    logout(res);
    return res.status(200).json({ status: "success" });
  } catch (err: any) {
    next(err);
  }
}
