import { NextFunction, Request, Response } from "express";

export default function getMeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = res.locals.user; // assigned in deserializeUser middleware
    delete user.password;
    res.status(200).json({
      user,
    });
  } catch (error: any) {
    next(error);
  }
}
