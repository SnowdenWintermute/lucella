/* eslint-disable consistent-return */
/* eslint-disable camelcase */
import bcrypt from "bcryptjs";
import { CookieOptions, NextFunction, Request, Response } from "express";
import { LoginUserInput } from "../../user-input-validation-schema/login-schema";
import UserRepo from "../../database/repos/users";
import signTokenAndCreateSession from "../utils/signTokenAndCreateSession";
import CustomError from "../../classes/CustomError";
import { ErrorMessages, UserStatuses } from "../../../../common";

const accessTokenExpiresIn: number = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN!, 10);
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + accessTokenExpiresIn),
  maxAge: accessTokenExpiresIn,
  httpOnly: true,
  sameSite: "lax", // @todo - figure out if this is the right option
};

// @todo - find out why this
// Only set secure to true in production // @production
if (process.env.NODE_ENV === "production") accessTokenCookieOptions.secure = true;

export default async function loginHandler(req: Request<object, object, LoginUserInput>, res: Response, next: NextFunction) {
  try {
    const user = await UserRepo.findOne("email", req.body.email);
    if (!user || user.status === UserStatuses.DELETED) return next([new CustomError(ErrorMessages.AUTH.EMAIL_DOES_NOT_EXIST, 401)]);
    if (!(await bcrypt.compare(req.body.password, user.password!))) return next([new CustomError(ErrorMessages.AUTH.INVALID_CREDENTIALS, 401)]);
    if (user.status === UserStatuses.BANNED) return next([new CustomError(ErrorMessages.AUTH.ACCOUNT_BANNED, 401)]);

    const { accessToken } = await signTokenAndCreateSession(user);
    res.cookie("access_token", accessToken, accessTokenCookieOptions);
    res.cookie("user_role", user.role, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // if we don't send some json rtk query complains PARSING_ERROR
    return res.status(200).json({ user });
  } catch (error: any) {
    console.log("error in login: ", error);
    return next(error);
  }
}
