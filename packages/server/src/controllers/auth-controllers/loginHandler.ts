/* eslint-disable consistent-return */
/* eslint-disable camelcase */
import bcrypt from "bcryptjs";
import { CookieOptions, NextFunction, Request, Response } from "express";
import UserRepo from "../../database/repos/users";
import signTokenAndCreateSession from "../utils/signTokenAndCreateSession";
import CustomError from "../../classes/CustomError";
import { CookieNames, ErrorMessages, SanitizedUser, UserStatuses } from "../../../../common";
import { LoginUserInput } from "../../user-input-validation-schema/login-schema";

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
    res.cookie(CookieNames.ACCESS_TOKEN, accessToken, accessTokenCookieOptions);

    return res.status(200).json({ user: new SanitizedUser(user) });
  } catch (error: any) {
    console.log("error in login: ", error);
    return next(error);
  }
}
