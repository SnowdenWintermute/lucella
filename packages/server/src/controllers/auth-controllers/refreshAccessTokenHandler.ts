import { CookieOptions, NextFunction, Request, Response } from "express";
import AppError from "../../classes/AppError";
import { findUserById } from "../../services/user.service";
import redisClient from "../../utils/connectRedis";
import { signJwt, verifyJwt } from "../../utils/jwt";

const accessTokenExpiresIn: number = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN!);
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + accessTokenExpiresIn),
  maxAge: accessTokenExpiresIn,
  httpOnly: true,
  sameSite: "lax",
};

// Only set secure to true in production // @production
if (process.env.NODE_ENV === "production") accessTokenCookieOptions.secure = true;

export default async function refreshAccessTokenHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const refresh_token = req.cookies.refresh_token as string;
    const decoded = verifyJwt<{ sub: string }>(refresh_token, process.env.REFRESH_TOKEN_PUBLIC_KEY!);

    const message = "Could not refresh access token";
    if (!decoded) return next(new AppError(message, 403));
    const session = await redisClient.get(decoded.sub);
    if (!session) return next(new AppError(message, 403));
    const user = await findUserById(JSON.parse(session)._id);
    if (!user) return next(new AppError(message, 403));

    const access_token = signJwt({ sub: user._id }, process.env.ACCESS_TOKEN_PRIVATE_KEY!, {
      expiresIn: `${parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN!) / 1000 / 60}m`,
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
}
