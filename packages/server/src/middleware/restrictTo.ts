/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from "express";
import { ErrorMessages } from "../../../common";
import CustomError from "../classes/CustomError";

export const restrictTo =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;
    if (!allowedRoles.includes(user.role)) return next([new CustomError(ErrorMessages.AUTH.ROLE_RESTRICTED, 403)]);
    next();
  };
