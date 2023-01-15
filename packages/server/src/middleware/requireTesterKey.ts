/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from "express";
import { ErrorMessages } from "../../../common";
import CustomError from "../classes/CustomError";

export function requireTesterKey(req: Request, res: Response, next: NextFunction) {
  if (req.body.testerKey !== process.env.TESTER_KEY) return next([new CustomError(ErrorMessages.AUTH.INVALID_CREDENTIALS, 401)]);
  next();
}
