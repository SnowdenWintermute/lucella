import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserStatuses, User, CookieNames, ERROR_MESSAGES } from "../../../../common";
import CustomError from "../../classes/CustomError";
import UserRepo from "../../database/repos/users";
import { lucella } from "../../lucella";
import { wrappedRedis } from "../../utils/RedisContext";

export default async function deleteAccountHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = res.locals as { [user: string]: User };
    user.status = UserStatuses.DELETED;
    if (!req.body.password || !(await bcrypt.compare(req.body.password, user.password)))
      return next([new CustomError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, 401)]);
    await UserRepo.update(user);
    const deletedUser = await UserRepo.findOne(`email`, user.email);
    wrappedRedis.context!.del(deletedUser.id.toString());
    console.log(`flagged user ${deletedUser.name} as deleted`);
    lucella.server?.disconnectUser(user.name);
    res.cookie(CookieNames.ACCESS_TOKEN, "", { maxAge: 1 });
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return next(error);
  }
}
