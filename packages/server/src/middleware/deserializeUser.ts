import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../controllers/auth-controllers/utils/jwt";

import redisClient, { connectRedis } from "../utils/connectRedis";
import UserRepo from "../database/repos/users";
import CustomError from "../classes/CustomError";
import { AuthRoutePaths, ErrorMessages } from "../../../common";
import logout from "../controllers/auth-controllers/utils/logout";

export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let access_token;
    if (req.cookies.access_token) access_token = req.cookies.access_token;
    if (!access_token) return next([new CustomError(ErrorMessages.AUTH.NOT_LOGGED_IN, 401)]);
    const decoded = verifyJwt<{ sub: string }>(access_token, process.env.ACCESS_TOKEN_PUBLIC_KEY!);
    if (!decoded) return next([new CustomError(ErrorMessages.AUTH.INVALID_TOKEN, 401)]);
    if (!redisClient.isOpen) await connectRedis();
    const session = await redisClient.get(decoded.sub.toString());
    if (!session) {
      logout(res);
      if (req.path === AuthRoutePaths.LOGOUT) return res.status(200).json({ status: "success" });
      return next([new CustomError(ErrorMessages.AUTH.EXPIRED_SESSION, 401)]);
    }
    const user = await UserRepo.findById(JSON.parse(session).id);
    if (!user) return next([new CustomError(ErrorMessages.AUTH.NO_USER_EXISTS, 401)]);
    res.locals.user = user;
    next();
  } catch (err: any) {
    console.log(err);
    next(err);
  }
};
