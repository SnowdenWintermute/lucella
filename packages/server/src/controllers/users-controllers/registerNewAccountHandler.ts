/* eslint-disable consistent-return */
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import UserRepo from "../../database/repos/users";
import CustomError from "../../classes/CustomError";
import { ErrorMessages } from "../../../../common";
import { UserRegistrationUserInput } from "../../user-input-validation-schema/register-user-schema";
import { sendEmail } from "../utils/sendEmail";
import { buildAccountActivationHTML, buildAccountActivationText, ACCOUNT_ACTIVATION_SUBJECT } from "../utils/buildEmails";
import { signJwtAsymmetric } from "../utils/jwt";
import { wrappedRedis } from "../../utils/RedisContext";
import { ACCOUNT_CREATION_SESSION_PREFIX } from "../../consts";

export default async function registerNewAccountHandler(req: Request<object, object, UserRegistrationUserInput>, res: Response, next: NextFunction) {
  const { name, email, password } = req.body;

  const emailAlreadyExists = await UserRepo.findOne("email", email);
  if (emailAlreadyExists) return next([new CustomError(ErrorMessages.AUTH.EMAIL_IN_USE_OR_UNAVAILABLE, 403)]);
  const nameAlreadyExists = await UserRepo.findOne("name", name);
  if (nameAlreadyExists) return next([new CustomError(ErrorMessages.AUTH.NAME_IN_USE_OR_UNAVAILABLE, 403)]);

  const token = signJwtAsymmetric({ email }, process.env.ACCOUNT_ACTIVATION_TOKEN_PRIVATE_KEY!, {
    expiresIn: process.env.ACCOUNT_ACTIVATION_SESSION_EXPIRATION!,
  });
  const hashedPassword = await bcrypt.hash(password, 12);
  wrappedRedis.context!.set(`${ACCOUNT_CREATION_SESSION_PREFIX}${email}`, JSON.stringify({ name, email, password: hashedPassword }), {
    EX: parseInt(process.env.ACCOUNT_ACTIVATION_SESSION_EXPIRATION!, 10),
  });
  await sendEmail(email, ACCOUNT_ACTIVATION_SUBJECT, buildAccountActivationText(name, token!), buildAccountActivationHTML(name, token!));

  res.status(200).json({});
}
