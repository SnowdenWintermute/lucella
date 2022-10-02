import { CookieOptions, NextFunction, Request, Response } from "express";
import { CreateUserInput, LoginUserInput } from "../schema/user.schema";
import { createUser, findUser, findUserById, signTokenAndCreateSession } from "../services/user.service";
import AppError from "../classes/AppError";
import { signJwt, verifyJwt } from "../utils/jwt";
import redisClient from "../utils/connectRedis";

// Exclude this fields from the response
export const excludedFields = ["password"];

// Cookie options
const accessTokenExpiresIn: number = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN!);
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + accessTokenExpiresIn),
  maxAge: accessTokenExpiresIn,
  httpOnly: true,
  sameSite: "lax",
};

const refreshTokenExpiresIn: number = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN!);
const refreshTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + refreshTokenExpiresIn),
  maxAge: refreshTokenExpiresIn,
  httpOnly: true,
  sameSite: "lax",
};

// Only set secure to true in production
if (process.env.NODE_ENV === "production") accessTokenCookieOptions.secure = true;

export const registerHandler = async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {
  try {
    const user = await createUser({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    });

    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    // mongodb specific code for duplicate entry
    if (!(err.code === 11000)) return next(err);
    // all other errors
    return res.status(409).json({
      status: "fail",
      message: "Email already exist",
    });
  }
};

export const loginHandler = async (req: Request<{}, {}, LoginUserInput>, res: Response, next: NextFunction) => {
  try {
    const user = await findUser({ email: req.body.email });
    if (!user || !(await user.comparePasswords(user.password, req.body.password)))
      return next(new AppError("Invalid email or password", 401));

    const { access_token, refresh_token } = await signTokenAndCreateSession(user);
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    res.status(200).json({
      status: "success",
      access_token: process.env.NODE_ENV === "development" ? access_token : "",
    });
  } catch (err: any) {
    next(err);
  }
};

export const refreshAccessTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refresh_token = req.cookies.refresh_token as string;
    const decoded = verifyJwt<{ sub: string }>(refresh_token, "refreshTokenPublicKey");

    const message = "Could not refresh access token";
    if (!decoded) return next(new AppError(message, 403));
    const session = await redisClient.get(decoded.sub);
    if (!session) return next(new AppError(message, 403));
    const user = await findUserById(JSON.parse(session)._id);
    if (!user) return next(new AppError(message, 403));

    const access_token = signJwt({ sub: user._id }, "accessTokenPrivateKey", {
      expiresIn: `${parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN!) / 60 / 60}m`,
    });

    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    res.status(200).json({
      status: "success",
      access_token: process.env.NODE_ENV === "development" ? access_token : "",
    });
  } catch (err: any) {
    next(err);
  }
};

const logout = (res: Response) => {
  res.cookie("access_token", "", { maxAge: 1 });
  res.cookie("refresh_token", "", { maxAge: 1 });
  res.cookie("logged_in", "", {
    maxAge: 1,
  });
};

export const logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    await redisClient.del(user._id.toString());
    logout(res);
    return res.status(200).json({ status: "success" });
  } catch (err: any) {
    next(err);
  }
};
