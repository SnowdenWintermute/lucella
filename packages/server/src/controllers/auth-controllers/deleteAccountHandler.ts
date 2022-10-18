import { NextFunction, Request, Response } from "express";
import logout from "./logout";
import redisClient from "../../utils/connectRedis";
import { deleteUser } from "../../services/user.service";

export default async function deleteAccountHandler(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  try {
    await deleteUser(user.email);
    await redisClient.del(user._id.toString());
    logout(res);
    return res.status(200).json({ status: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
}