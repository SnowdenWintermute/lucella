import { CookieOptions, NextFunction, Request, Response } from "express";
import { LoginUserInput } from "../../schema-validation/user-schema";
import bcrypt from "bcryptjs";
import UserRepo from "../../database/repos/users";
import signTokenAndCreateSession from "./utils/signTokenAndCreateSession";
import CustomError from "../../classes/CustomError";
import { ErrorMessages } from "@lucella/common";

const accessTokenExpiresIn: number = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN!);
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + accessTokenExpiresIn),
  maxAge: accessTokenExpiresIn,
  httpOnly: true,
  sameSite: "lax",
};

// Only set secure to true in production // @production
if (process.env.NODE_ENV === "production") accessTokenCookieOptions.secure = true;

const refreshTokenExpiresIn: number = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN!);
const refreshTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + refreshTokenExpiresIn),
  maxAge: refreshTokenExpiresIn,
  httpOnly: true,
  sameSite: "lax",
};

export default async function loginHandler(req: Request<{}, {}, LoginUserInput>, res: Response, next: NextFunction) {
  try {
    const validationErrors: CustomError[] = [];
    if (!req.body.password) validationErrors.push(new CustomError(ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD, 401));
    if (!req.body.email) validationErrors.push(new CustomError(ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL, 401));
    if (validationErrors.length) return next(validationErrors);
    const user = await UserRepo.findOne("email", req.body.email);
    if (!user || !(await bcrypt.compare(req.body.password, user.password!))) return next([new CustomError(ErrorMessages.AUTH.INVALID_CREDENTIALS, 401)]);

    const { access_token, refresh_token } = await signTokenAndCreateSession(user);
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
    res.cookie("user_role", user.role, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    res.status(200).json({ status: "success" });
  } catch (err: any) {
    next(err);
  }
}
