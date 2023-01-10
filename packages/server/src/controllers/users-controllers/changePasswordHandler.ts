/* eslint-disable consistent-return */
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import UserRepo from "../../database/repos/users";
import { verifyJwtSymmetric } from "../utils/jwt";
import CustomError from "../../classes/CustomError";
import { ErrorMessages, REDIS_KEY_PREFIXES, UserStatuses } from "../../../../common";
import { wrappedRedis } from "../../utils/RedisContext";

export default async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    const user = await UserRepo.findOne("email", email);
    if (!user || user.status === UserStatuses.DELETED) return next([new CustomError(ErrorMessages.AUTH.NO_USER_EXISTS, 401)]);
    if (user.status === UserStatuses.BANNED) return next([new CustomError(ErrorMessages.AUTH.ACCOUNT_BANNED, 401)]);
    const decoded = verifyJwtSymmetric<{ user: { email: string } }>(req.body.token, user.password);
    if (!decoded) return next([new CustomError(ErrorMessages.AUTH.INVALID_OR_EXPIRED_TOKEN, 401)]);
    if (decoded.user.email !== user.email) return next([new CustomError(ErrorMessages.AUTH.PASSWORD_RESET_EMAIL_DOES_NOT_MATCH_TOKEN, 401)]);
    const newPassword = req.body.password;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    if (user.status === UserStatuses.LOCKED_OUT) user.status = UserStatuses.ACTIVE;
    await UserRepo.update(user);
    // give them back their failed login attempts so they don't immediately lock themselves out again on one failed attempt
    await wrappedRedis.context!.del(`${user.email}${REDIS_KEY_PREFIXES.FAILED_LOGINS}`);
    // it is important to delete their auth session so anyone using a session from the old password is unauthed
    await wrappedRedis.context!.del(user.id.toString());
    res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}
