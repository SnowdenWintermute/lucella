import { NextFunction, Request, Response } from "express";
import { signJwt } from "../utils/jwt";
import UserRepo from "../../database/repos/users";
import CustomError from "../../classes/CustomError";
import { ErrorMessages } from "../../../../common";
import { sendEmail } from "../utils/sendEmail";
import { buildPasswordResetHTML, buildPasswordResetText } from "../utils/buildEmailBodies";

// eslint-disable-next-line consistent-return
export default async function passwordResetEmailRequestHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await UserRepo.findOne("email", req.body.email);
    if (!user) return next([new CustomError(ErrorMessages.AUTH.EMAIL_DOES_NOT_EXIST, 404)]);
    const payload = { user: { id: user.id } };
    const passwordResetToken = signJwt(payload, process.env.PASSWORD_RESET_TOKEN_PRIVATE_KEY!, {
      expiresIn: `${parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN!, 10) / 1000 / 60}m`,
    });

    const htmlOutput = buildPasswordResetHTML(passwordResetToken!);
    const textOutput = buildPasswordResetText(passwordResetToken!);

    await sendEmail(req.body.email, textOutput, htmlOutput);
    res.sendStatus(200);
  } catch (error: any) {
    console.log(error);
    return next([new CustomError(ErrorMessages.AUTH.PASSWORD_RESET_EMAIL, 500)]);
  }
}
