/* eslint-disable consistent-return */
/* eslint-disable camelcase */
import bcrypt from "bcryptjs";
import { CookieOptions, NextFunction, Request, Response } from "express";
import UsersRepo from "../../database/repos/users";
import signTokenAndCreateSession from "../utils/signTokenAndCreateSession";
import CustomError from "../../classes/CustomError";
import {
  CookieNames,
  ERROR_MESSAGES,
  failedLoginCounterExpiration,
  failedLoginCountTolerance,
  REDIS_KEY_PREFIXES,
  SanitizedUser,
  UserStatuses,
} from "../../../../common";
import { LoginUserInput } from "../../user-input-validation-schema/login-schema";
import { wrappedRedis } from "../../utils/RedisContext";

const accessTokenExpiresIn: number = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN!, 10);
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + accessTokenExpiresIn),
  maxAge: accessTokenExpiresIn,
  httpOnly: true,
  sameSite: "lax", // @todo - figure out if this is the right option
};

// @todo - find out why this
// Only set secure to true in production // @production
if (process.env.NODE_ENV === "production") accessTokenCookieOptions.secure = true;

export default async function loginHandler(req: Request<object, object, LoginUserInput>, res: Response, next: NextFunction) {
  try {
    const user = await UsersRepo.findOne("email", req.body.email);
    if (!user || user.status === UserStatuses.DELETED) return next([new CustomError(ERROR_MESSAGES.AUTH.EMAIL_DOES_NOT_EXIST, 401)]);
    if (user.status === UserStatuses.LOCKED_OUT) return next([new CustomError(ERROR_MESSAGES.AUTH.ACCOUNT_LOCKED, 401)]);
    if (user.status === UserStatuses.BANNED) {
      if (user.banExpiresAt && Date.now() > new Date(user.banExpiresAt).getTime())
        await UsersRepo.update({ ...user, status: UserStatuses.ACTIVE, banExpiresAt: null });
      else return next([new CustomError(ERROR_MESSAGES.AUTH.ACCOUNT_BANNED, 401)]);
    }

    if (!(await bcrypt.compare(req.body.password, user.password!))) {
      const failedAttempts = await wrappedRedis.context!.incrBy(`${user.email}${REDIS_KEY_PREFIXES.FAILED_LOGINS}`, 1);
      await wrappedRedis.context!.expire(`${user.email}${REDIS_KEY_PREFIXES.FAILED_LOGINS}`, failedLoginCounterExpiration);
      if (failedAttempts > failedLoginCountTolerance) {
        await UsersRepo.update({ ...user, status: UserStatuses.LOCKED_OUT });
        return next([new CustomError(ERROR_MESSAGES.RATE_LIMITER.TOO_MANY_FAILED_LOGINS, 401)]);
      }
      return next([new CustomError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS_WITH_ATTEMPTS_REMAINING(failedLoginCountTolerance - failedAttempts), 401)]);
    }

    const { accessToken } = await signTokenAndCreateSession(user);
    res.cookie(CookieNames.ACCESS_TOKEN, accessToken, accessTokenCookieOptions);

    return res.status(200).json({ user: new SanitizedUser(user) });
  } catch (error: any) {
    console.log("error in login: ", error);
    return next(error);
  }
}
