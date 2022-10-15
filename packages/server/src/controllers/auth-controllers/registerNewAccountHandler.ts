import { NextFunction, Request, Response } from "express";
import { CreateUserInput } from "../../schema/user.schema";
import { createUser } from "../../services/user.service";

export default async function registerNewAccountHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    await createUser({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    });

    res.status(201).json({
      status: "success",
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
}
