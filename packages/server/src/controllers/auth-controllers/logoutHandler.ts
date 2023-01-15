/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from "express";
import logout from "../utils/logout";

export default async function logoutHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await logout(res);
    return res.sendStatus(200);
  } catch (err: any) {
    next(err);
  }
}
