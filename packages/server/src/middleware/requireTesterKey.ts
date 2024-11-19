/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES } from "../../../common";
import CustomError from "../classes/CustomError";
import { env } from "../validate-env";

export function requireTesterKey(req: Request, res: Response, next: NextFunction) {
  if (!req.body.testerKey || req.body.testerKey !== env.TESTER_KEY) return next([new CustomError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, 401)]);
  next();
}
