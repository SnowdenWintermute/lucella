/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from "express";
import UsersRepo from "../../database/repos/users";
import banUser from "../utils/banUser";

export default async function banUserAccountHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, ban } = req.body;
    const user = await UsersRepo.findOne("name", name);
    await banUser(user, ban);
    res.sendStatus(204);
  } catch (error) {
    if (error) return next(error);
  }
}
