import { NextFunction, Request, Response } from "express";
import { findUserById } from "../services/user.service";
import AppError from "../classes/AppError";
import { verifyJwt } from "../utils/jwt";

import redisClient from "../utils/connectRedis";

export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let access_token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
      access_token = req.headers.authorization.split(" ")[1];
    else if (req.cookies.access_token) access_token = req.cookies.access_token;

    if (!access_token) return next(new AppError("You are not logged in", 401));
    const decoded = verifyJwt<{ sub: string }>(access_token, "accessTokenPublicKey");
    if (!decoded) return next(new AppError(`Invalid token or user doesn't exist`, 401));

    const session = await redisClient.get(decoded.sub);
    if (!session) return next(new AppError(`User session has expired`, 401));

    const user = await findUserById(JSON.parse(session)._id);
    if (!user) return next(new AppError(`User with that token no longer exist`, 401));

    // This is really important (Helps us know if the user is logged in from other controllers)
    // You can do: (req.user or res.locals.user)
    res.locals.user = user;

    next();
  } catch (err: any) {
    next(err);
  }
};
