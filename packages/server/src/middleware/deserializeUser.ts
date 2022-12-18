import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../controllers/auth-controllers/utils/jwt";

import redisClient from "../utils/connectRedis";
import UserRepo from "../database/repos/users";
import CustomError from "../classes/CustomError";

export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let access_token;
    // if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) access_token = req.headers.authorization.split(" ")[1];
    if (req.cookies.access_token) access_token = req.cookies.access_token;

    if (!access_token) return next(new CustomError("You are not logged in", 401));

    const decoded = verifyJwt<{ sub: string }>(access_token, process.env.ACCESS_TOKEN_PUBLIC_KEY!);
    if (!decoded) return next(new CustomError(`Invalid token or user doesn't exist`, 401));
    const session = await redisClient.get(decoded.sub.toString());
    if (!session) return next(new CustomError(`User session has expired`, 401));

    const user = await UserRepo.findById(JSON.parse(session).id);
    if (!user) return next(new CustomError(`User with that token no longer exist`, 401));

    // This is really important (Helps us know if the user is logged in from other controllers)
    // You can do: (req.user or res.locals.user)
    res.locals.user = user;

    next();
  } catch (err: any) {
    console.log(err);
    next(err);
  }
};
