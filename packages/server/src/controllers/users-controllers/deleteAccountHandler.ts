import { NextFunction, Request, Response } from "express";
import { UserStatuses, User, CookieNames } from "../../../../common";
import UserRepo from "../../database/repos/users";
import { lucella } from "../../lucella";

export default async function deleteAccountHandler(req: Request, res: Response, next: NextFunction) {
  const { user } = res.locals as { [user: string]: User };
  try {
    user.status = UserStatuses.DELETED;
    await UserRepo.update(user);
    const deletedUser = await UserRepo.findOne(`email`, user.email);
    console.log(`flagged user ${deletedUser.name} as deleted`);
    lucella.server?.disconnectUser(user.name);
    res.cookie(CookieNames.ACCESS_TOKEN, "", { maxAge: 1 });
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return next(error);
  }
}
