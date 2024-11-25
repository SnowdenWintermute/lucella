import { NextFunction, Request, Response } from "express";
import { signJwtSymmetric } from "../utils/jwt";
import UsersRepo from "../../database/repos/users";
import CustomError from "../../classes/CustomError";
import { ERROR_MESSAGES, UserStatuses } from "../../../../common";
import { sendEmail } from "../utils/sendEmail";
import { buildPasswordResetHTML, buildPasswordResetText, RESET_PASSWORD_SUBJECT } from "../utils/buildEmails";
import { env } from "../../validate-env";

// eslint-disable-next-line consistent-return
export default async function passwordResetEmailRequestHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await UsersRepo.findOne("email", req.body.email);
    if (!user || user.status === UserStatuses.DELETED) return next([new CustomError(ERROR_MESSAGES.AUTH.EMAIL_DOES_NOT_EXIST, 404)]);
    if (user.status === UserStatuses.BANNED) return next([new CustomError(ERROR_MESSAGES.AUTH.ACCOUNT_BANNED, 401)]);
    const payload = { user: { email: user.email } };

    const passwordResetToken = signJwtSymmetric(payload, user.password, {
      expiresIn: `${env.PASSWORD_RESET_TOKEN_EXPIRES_IN / 1000 / 60}m`,
    });

    const htmlOutput = buildPasswordResetHTML(user.email, passwordResetToken!);
    const textOutput = buildPasswordResetText(user.email, passwordResetToken!);

    await sendEmail(req.body.email, RESET_PASSWORD_SUBJECT, textOutput, htmlOutput);
    res.status(200).json({});
  } catch (error: any) {
    console.log(error);
    return next([new CustomError(ERROR_MESSAGES.AUTH.CHANGE_PASSWORD_EMAIL, 500)]);
  }
}
