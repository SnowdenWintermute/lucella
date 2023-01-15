import { NextFunction, Request, Response } from "express";
import { signJwtSymmetric } from "../utils/jwt";
import UserRepo from "../../database/repos/users";
import CustomError from "../../classes/CustomError";
import { ErrorMessages, UserStatuses } from "../../../../common";
import { sendEmail } from "../utils/sendEmail";
import { buildPasswordResetHTML, buildPasswordResetText, RESET_PASSWORD_SUBJECT } from "../utils/buildEmails";

// eslint-disable-next-line consistent-return
export default async function passwordResetEmailRequestHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await UserRepo.findOne("email", req.body.email);
    if (!user || user.status === UserStatuses.DELETED) return next([new CustomError(ErrorMessages.AUTH.EMAIL_DOES_NOT_EXIST, 404)]);
    if (user.status === UserStatuses.BANNED) return next([new CustomError(ErrorMessages.AUTH.ACCOUNT_BANNED, 401)]);
    const payload = { user: { email: user.email } };

    const passwordResetToken = signJwtSymmetric(payload, user.password, {
      expiresIn: `${parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN!, 10) / 1000 / 60}m`,
    });

    const htmlOutput = buildPasswordResetHTML(user.email, passwordResetToken!);
    const textOutput = buildPasswordResetText(user.email, passwordResetToken!);

    await sendEmail(req.body.email, RESET_PASSWORD_SUBJECT, textOutput, htmlOutput);
    res.status(200).json({});
  } catch (error: any) {
    console.log(error);
    return next([new CustomError(ErrorMessages.AUTH.CHANGE_PASSWORD_EMAIL, 500)]);
  }
}
