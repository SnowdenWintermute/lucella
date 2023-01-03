import { NextFunction, Request, Response } from "express";
import UserRepo from "../../../database/repos/users";

export default async function dropAllTestUsers(req: Request, res: Response, next: NextFunction) {
  try {
    await UserRepo.deleteTestUsers();
    return res.sendStatus(200);
  } catch (error) {
    return next(error);
  }
}
