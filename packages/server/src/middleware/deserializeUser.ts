/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../controllers/auth-controllers/utils/jwt";
import UserRepo from "../database/repos/users";
import CustomError from "../classes/CustomError";
import { AuthRoutePaths, ErrorMessages, UserStatuses } from "../../../common";
import logout from "../controllers/auth-controllers/utils/logout";
import { wrappedRedis } from "../utils/RedisContext";

export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let accessToken;
    if (req.cookies.access_token) accessToken = req.cookies.access_token;
    if (!accessToken) return next([new CustomError(ErrorMessages.AUTH.NOT_LOGGED_IN, 401)]);
    const decoded = verifyJwt<{ sub: string }>(accessToken, process.env.ACCESS_TOKEN_PUBLIC_KEY!);
    if (!decoded) return next([new CustomError(ErrorMessages.AUTH.INVALID_OR_EXPIRED_TOKEN, 401)]);

    const session = await wrappedRedis.context!.get(decoded.sub.toString());

    if (!session) {
      logout(res);
      if (req.path === AuthRoutePaths.LOGOUT) return res.sendStatus(200);
      return next([new CustomError(ErrorMessages.AUTH.EXPIRED_SESSION, 401)]);
    }
    const user = await UserRepo.findById(JSON.parse(session).id);
    if (!user || user.status === UserStatuses.DELETED) return next([new CustomError(ErrorMessages.AUTH.NO_USER_EXISTS, 401)]);
    if (user.status === UserStatuses.BANNED) return next([new CustomError(ErrorMessages.AUTH.ACCOUNT_BANNED, 401)]);
    res.locals.user = user;
    next();
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};
