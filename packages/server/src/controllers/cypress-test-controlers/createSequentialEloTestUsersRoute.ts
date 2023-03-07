import { NextFunction, Request, Response } from "express";
import createSequentialEloTestUsers from "../../utils/test-utils/createSequentialEloTestUsers";

export default async function createSequentialEloTestUsersRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const { numberToCreate, eloOfFirst, eloBetweenEach } = req.body;
    console.log(numberToCreate, eloOfFirst, eloBetweenEach);
    const createdUsers = await createSequentialEloTestUsers(numberToCreate, eloOfFirst, eloBetweenEach);
    return res.status(201).json(createdUsers);
  } catch (error) {
    console.log("createSequentialEloTestUsersRoute error: ", error);
    return next(error);
  }
}
