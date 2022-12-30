/* eslint-disable consistent-return */
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import UserRepo from "../../database/repos/users";
import CustomError from "../../classes/CustomError";
import { ErrorMessages, SanitizedUser } from "../../../../common";
import { UserRegistrationUserInput } from "../../user-input-validation-schema/register-user-schema";

export default async function registerNewAccountHandler(req: Request<object, object, UserRegistrationUserInput>, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await UserRepo.insert(name, email, hashedPassword);

    res.status(201).json({ user: new SanitizedUser(user) });
  } catch (error: any) {
    if (error.schema && error.detail) {
      // probably a postgres error
      const errors = [];
      console.log("pg error: ", error.code);
      // @todo - prettify errors and add to ErrorMessages object
      if (error.code === "23505") errors.push(new CustomError(ErrorMessages.AUTH.EMAIL_IN_USE_OR_UNAVAILABLE, 403));
      else if (error.column) errors.push(new CustomError(`Database error - problem relating to ${error.column}`, 400));
      else if (error.detail) errors.push(new CustomError(`Database error - detail: ${error.detail}`, 400));
      return next(errors);
    }
  }
}
