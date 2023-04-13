/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGES } from "../../../common";
import CustomError from "../classes/CustomError";

export const restrictTo =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = res.locals;
      if (!allowedRoles.includes(user.role)) return next([new CustomError(ERROR_MESSAGES.AUTH.ROLE_RESTRICTED, 403)]);
      next();
    } catch (error) {
      console.log(error);
    }
  };
