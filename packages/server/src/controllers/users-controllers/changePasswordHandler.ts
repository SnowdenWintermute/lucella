/* eslint-disable consistent-return */
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import UserRepo from "../../database/repos/users";
import { verifyJwt } from "../utils/jwt";
import CustomError from "../../classes/CustomError";
import { ErrorMessages } from "../../../../common/dist";

export default async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const decoded = verifyJwt<{ user: { id: string } }>(req.body.token, process.env.PASSWORD_RESET_TOKEN_PUBLIC_KEY!);
    if (!decoded) return next([new CustomError(ErrorMessages.AUTH.INVALID_OR_EXPIRED_TOKEN, 401)]);
    const user = await UserRepo.findById(parseInt(decoded.user.id, 10));
    if (!user) return next([new CustomError(ErrorMessages.AUTH.NO_USER_EXISTS, 401)]);
    const newPassword = req.body.password;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await UserRepo.update(user);
    res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}
