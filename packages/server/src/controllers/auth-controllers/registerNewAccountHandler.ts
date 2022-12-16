import { NextFunction, Request, Response } from "express";
import { CreateUserInput } from "../../schema-validation/user-schema";
import { createUser } from "../../services/user.service";

export default async function registerNewAccountHandler(req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) {
  try {
    const user = await createUser(req);
    res.status(201).json(user);
  } catch (error: any) {
    console.error(error);
    if (error.schema && error.detail) {
      // probably a postgres error
      const errors = [];
      if (error.column) errors.push(`Database error - problem relating to ${error.column}`);
      else if (error.detail) errors.push(`Database error - detail: ${error.detail}`);
      return res.status(500).json(errors);
    } else return res.status(500).json([error.toString()]);
  }
}
