/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES } from "../../../common";
import CustomError from "../classes/CustomError";

export function requireTesterKey(req: Request, res: Response, next: NextFunction) {
  if (!req.body.testerKey || req.body.testerKey !== process.env.TESTER_KEY) return next([new CustomError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, 401)]);
  next();
}
