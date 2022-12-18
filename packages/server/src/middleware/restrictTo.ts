import { NextFunction, Request, Response } from "express";
import CustomError from "../classes/CustomError";

export const restrictTo =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (!allowedRoles.includes(user.role)) return next(new CustomError("You are not allowed to perform this action", 403));
    next();
  };
