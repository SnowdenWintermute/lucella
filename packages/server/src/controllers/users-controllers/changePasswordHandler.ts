/* eslint-disable consistent-return */
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import UserRepo from "../../database/repos/users";
import { verifyJwtSymmetric } from "../utils/jwt";
import CustomError from "../../classes/CustomError";
import { ErrorMessages } from "../../../../common";
import { wrappedRedis } from "../../utils/RedisContext";

export default async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    const user = await UserRepo.findOne("email", email);
    if (!user) return next([new CustomError(ErrorMessages.AUTH.NO_USER_EXISTS, 401)]);
    console.log("user: ", user);
    const decoded = verifyJwtSymmetric<{ user: { email: string } }>(req.body.token, user.password);
    if (!decoded) return next([new CustomError(ErrorMessages.AUTH.INVALID_OR_EXPIRED_TOKEN, 401)]);
    if (decoded.user.email !== user.email) return next([new CustomError(ErrorMessages.AUTH.PASSWORD_RESET_EMAIL_DOES_NOT_MATCH_TOKEN, 401)]);
    const newPassword = req.body.password;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await UserRepo.update(user);
    // it is important to delete their auth session so anyone using a session from the old password is unauthed
    await wrappedRedis.context!.del(user.id.toString());
    res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}
