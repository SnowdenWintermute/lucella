import { NextFunction, Request, Response } from "express";
import { SanitizedUser } from "../../../../common";

export default function getMeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = res.locals; // assigned in deserializeUser middleware

    res.status(200).json({
      user: new SanitizedUser(user),
    });
  } catch (error: any) {
    next(error);
  }
}
