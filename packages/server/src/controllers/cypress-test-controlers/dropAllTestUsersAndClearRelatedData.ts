import { NextFunction, Request, Response } from "express";
import { REDIS_KEY_PREFIXES } from "../../../../common";
import UserRepo from "../../database/repos/users";
import { wrappedRedis } from "../../utils/RedisContext";
import { TEST_USER_EMAIL } from "../../utils/test-utils/consts";

export default async function dropAllTestUsers(req: Request, res: Response, next: NextFunction) {
  try {
    // const email = req.body.email || TEST_USER_EMAIL;
    // const userEmailFailedLoginsKey = `${email}${REDIS_KEY_PREFIXES.FAILED_LOGINS}`;
    // const existingKey = await wrappedRedis.context!.get(userEmailFailedLoginsKey);
    // console.log("deleting existing key: ", userEmailFailedLoginsKey, existingKey);
    // const numDeleted = await wrappedRedis.context!.del(userEmailFailedLoginsKey);
    // console.log("num keys deleted before cypress test: ", numDeleted);
    await wrappedRedis.context!.removeAllKeys();
    await UserRepo.deleteTestUsers();
    return res.sendStatus(200);
  } catch (error) {
    return next(error);
  }
}
