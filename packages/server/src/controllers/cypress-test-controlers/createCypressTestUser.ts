import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";

import UserRepo from "../../database/repos/users";
import { TEST_USER_EMAIL, TEST_USER_NAME, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";

export default async function createCypressTestUser(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.body.email || TEST_USER_EMAIL;
    const hashedPassword = await bcrypt.hash(TEST_USER_PASSWORD, 12);
    await UserRepo.insert(TEST_USER_NAME, email, hashedPassword);
    return res.sendStatus(201);
  } catch (error) {
    return next(error);
  }
}
