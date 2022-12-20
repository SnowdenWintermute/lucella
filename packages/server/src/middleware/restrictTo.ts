import { ErrorMessages } from "@lucella/common";
import { NextFunction, Request, Response } from "express";
import CustomError from "../classes/CustomError";

export const restrictTo =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (!allowedRoles.includes(user.role)) return next([new CustomError(ErrorMessages.AUTH.ROLE_RESTRICTED, 403)]);
    next();
  };
