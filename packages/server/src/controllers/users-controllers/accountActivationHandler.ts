/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from "express";
import UsersRepo from "../../database/repos/users";
import CustomError from "../../classes/CustomError";
import { ERROR_MESSAGES, SanitizedUser } from "../../../../common";
import { verifyJwtAsymmetric } from "../utils/jwt";
import { wrappedRedis } from "../../utils/RedisContext";
import { ACCOUNT_CREATION_SESSION_PREFIX } from "../../consts";

export default async function accountActivationHandler(req: Request<object, object, { token: string }>, res: Response, next: NextFunction) {
  try {
    const { token } = req.body;
    if (!token) return next([new CustomError(ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN, 401)]);
    const decoded: { email: string } | null = verifyJwtAsymmetric(token, process.env.ACCOUNT_ACTIVATION_TOKEN_PUBLIC_KEY!);
    if (!decoded) return next([new CustomError(ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN, 401)]);
    const { email } = decoded;
    const accountActivationSession = await wrappedRedis.context!.get(`${ACCOUNT_CREATION_SESSION_PREFIX}${email}`);
    if (!accountActivationSession) return next([new CustomError(ERROR_MESSAGES.AUTH.USED_OR_EXPIRED_ACCOUNT_CREATION_SESSION, 401)]);
    const parsedSession = JSON.parse(accountActivationSession);
    const { name, password } = parsedSession;
    const user = await UsersRepo.insert(name, email, password);
    await wrappedRedis.context!.del(`${ACCOUNT_CREATION_SESSION_PREFIX}${email}`);
    res.status(201).json({ user: new SanitizedUser(user) });
  } catch (error: any) {
    if (error.schema && error.detail) {
      // probably a postgres error
      const errors = [];
      console.log("pg error: ", error.code, JSON.stringify(error, null, 2));
      // @todo - prettify errors and add to ERROR_MESSAGES object
      if (error.code === "23505" && error.constraint === "users_email_key") errors.push(new CustomError(ERROR_MESSAGES.AUTH.EMAIL_IN_USE_OR_UNAVAILABLE, 403));
      if (error.code === "23505" && error.constraint === "users_name_key") errors.push(new CustomError(ERROR_MESSAGES.AUTH.NAME_IN_USE_OR_UNAVAILABLE, 403));
      else if (error.column) errors.push(new CustomError(`Database error - problem relating to ${error.column}`, 400));
      else if (error.detail) errors.push(new CustomError(`Database error - detail: ${error.detail}`, 400));
      return next(errors);
    }
  }
}
