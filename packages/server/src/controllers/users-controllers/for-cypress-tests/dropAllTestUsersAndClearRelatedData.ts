import { NextFunction, Request, Response } from "express";
import { REDIS_KEY_PREFIXES } from "../../../../../common";
import UserRepo from "../../../database/repos/users";
import { wrappedRedis } from "../../../utils/RedisContext";

export default async function dropAllTestUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const userEmailFailedLoginsKey = `${req.body.email}${REDIS_KEY_PREFIXES.FAILED_LOGINS}`;
    const existingKey = await wrappedRedis.context!.get(userEmailFailedLoginsKey);
    console.log("deleting existing key: ", userEmailFailedLoginsKey, existingKey);
    const numDeleted = await wrappedRedis.context!.del(userEmailFailedLoginsKey);
    console.log("num keys deleted before cypress test: ", numDeleted);
    await UserRepo.deleteTestUsers();
    return res.sendStatus(200);
  } catch (error) {
    return next(error);
  }
}
