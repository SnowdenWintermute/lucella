/* eslint-disable consistent-return */
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import UsersRepo from "../../database/repos/users";
import CustomError from "../../classes/CustomError";
import { ERROR_MESSAGES } from "../../../../common";
import { UserRegistrationUserInput } from "../../user-input-validation-schema/register-user-schema";
import { sendEmail } from "../utils/sendEmail";
import { buildAccountActivationHTML, buildAccountActivationText, ACCOUNT_ACTIVATION_SUBJECT } from "../utils/buildEmails";
import { signJwtAsymmetric } from "../utils/jwt";
import { wrappedRedis } from "../../utils/RedisContext";
import { ACCOUNT_CREATION_SESSION_PREFIX } from "../../consts";
import { env } from "../../validate-env";

export default async function registerNewAccountHandler(req: Request<object, object, UserRegistrationUserInput>, res: Response, next: NextFunction) {
  const { name, email, password } = req.body;

  const emailAlreadyExists = await UsersRepo.findOne("email", email);
  if (emailAlreadyExists) return next([new CustomError(ERROR_MESSAGES.AUTH.EMAIL_IN_USE_OR_UNAVAILABLE, 403)]);
  const nameAlreadyExists = await UsersRepo.findOne("name", name.toLowerCase().trim());
  if (nameAlreadyExists) return next([new CustomError(ERROR_MESSAGES.AUTH.NAME_IN_USE_OR_UNAVAILABLE, 403)]);

  const token = signJwtAsymmetric({ email }, env.ACCOUNT_ACTIVATION_TOKEN_PRIVATE_KEY, {
    expiresIn: env.ACCOUNT_ACTIVATION_SESSION_EXPIRATION!,
  });
  const hashedPassword = await bcrypt.hash(password, 12);
  wrappedRedis.context!.set(`${ACCOUNT_CREATION_SESSION_PREFIX}${email}`, JSON.stringify({ name, email, password: hashedPassword }), {
    EX: env.ACCOUNT_ACTIVATION_SESSION_EXPIRATION,
  });
  await sendEmail(email, ACCOUNT_ACTIVATION_SUBJECT, buildAccountActivationText(name, token!), buildAccountActivationHTML(name, token!));

  res.status(200).json({});
}
