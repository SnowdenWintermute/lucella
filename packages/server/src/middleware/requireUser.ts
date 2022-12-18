import { NextFunction, Request, Response } from "express";
import CustomError from "../classes/CustomError";

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    if (!user) return next(new CustomError(`Invalid token or session has expired`, 401));
    next();
  } catch (err: any) {
    next(err);
  }
};
