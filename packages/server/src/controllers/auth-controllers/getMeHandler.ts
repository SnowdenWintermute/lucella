import { NextFunction, Request, Response } from "express";

export default function getMeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = res.locals.user; // assigned in deserializeUser middleware
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    console.log(err);
    next(err);
  }
}
