import { UserStatuses } from "../../../../common";
import { NextFunction, Request, Response } from "express";
import UserRepo from "../../database/repos/users";
import { wrappedRedis } from "../../utils/RedisContext";
import logout from "./utils/logout";
import { User } from "../../models/User";
import { lucella } from "../../lucella";

export default async function deleteAccountHandler(req: Request, res: Response, next: NextFunction) {
  const user: User = res.locals.user;
  try {
    user.status = UserStatuses.DELETED;
    await UserRepo.update(user);
    const deletedUser = await UserRepo.findOne("email", user.email);
    console.log(`flagged user ${deletedUser.name} as deleted`);
    lucella.server?.disconnectUser(user.name);
    await wrappedRedis.context!.del(user.id.toString());
    logout(res);
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return next(error);
  }
}
