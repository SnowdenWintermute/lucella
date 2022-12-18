import { Request, Response, NextFunction } from "express";
import CustomError from "../classes/CustomError";

export default function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
  console.log("error received in error handler: ", error);
  let status;
  let messages;
  if (error[0] instanceof CustomError) {
    status = error[0].status;
    messages = error.map((customError: CustomError) => customError.message);
  }
  res.status(status || error.status || 500).json({ error: true, messages: messages || ["Internal server error"] });
}
