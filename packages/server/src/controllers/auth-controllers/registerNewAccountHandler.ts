import { NextFunction, Request, Response } from "express";
import UserRepo from "../../database/repos/users";
import { CreateUserInput } from "../../schema-validation/user-schema";
import bcrypt from "bcryptjs";
import CustomError from "../../classes/CustomError";

export default async function registerNewAccountHandler(req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await UserRepo.insert(name, email, hashedPassword);
    delete user.password;
    delete user.id;
    res.status(201).json(user);
  } catch (error: any) {
    if (error.schema && error.detail) {
      // probably a postgres error
      const errors = [];
      if (error.column) errors.push(new CustomError(`Database error - problem relating to ${error.column}`, 400));
      else if (error.detail) errors.push(new CustomError(`Database error - detail: ${error.detail}`, 400));
      return next(errors);
    } else return next();
  }
}
