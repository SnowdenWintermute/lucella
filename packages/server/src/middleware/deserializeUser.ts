/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from "express";
import { verifyJwtAsymmetric } from "../controllers/utils/jwt";
import logout from "../controllers/utils/logout";
import UsersRepo from "../database/repos/users";
import CustomError from "../classes/CustomError";
import { AuthRoutePaths, ERROR_MESSAGES, UserStatuses } from "../../../common";
import { wrappedRedis } from "../utils/RedisContext";

export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.rateLimited) {
    console.log("rate limiter applied");
    return next();
  }
  try {
    let accessToken;
    if (req.cookies.access_token) accessToken = req.cookies.access_token;
    if (!accessToken) return next([new CustomError(ERROR_MESSAGES.AUTH.NOT_LOGGED_IN, 401)]);
    const decoded = verifyJwtAsymmetric<{ sub: string }>(accessToken, process.env.ACCESS_TOKEN_PUBLIC_KEY!);
    if (!decoded) return next([new CustomError(ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN, 401)]);

    const session = await wrappedRedis.context!.get(decoded.sub.toString());

    if (!session) {
      logout(res);
      if (req.path === AuthRoutePaths.LOGOUT) return res.sendStatus(200);
      return next([new CustomError(ERROR_MESSAGES.AUTH.EXPIRED_SESSION, 401)]);
    }

    const user = await UsersRepo.findById(JSON.parse(session).id);
    if (!user || user.status === UserStatuses.DELETED) return next([new CustomError(ERROR_MESSAGES.AUTH.NO_USER_EXISTS, 401)]);
    if (user.status === UserStatuses.BANNED) return next([new CustomError(ERROR_MESSAGES.AUTH.ACCOUNT_BANNED, 401)]);

    res.locals.user = user;
    next();
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};
