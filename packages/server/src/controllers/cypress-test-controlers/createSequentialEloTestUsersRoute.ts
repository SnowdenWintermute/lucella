import { NextFunction, Request, Response } from "express";
import createSequentialEloTestUsers from "../../utils/test-utils/createSequentialEloTestUsers";

export default async function createSequentialEloTestUsersRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const { numberToCreate, eloOfFirst, eloBetweenEach } = req.body;
    console.log(numberToCreate, eloOfFirst, eloBetweenEach);
    await createSequentialEloTestUsers(numberToCreate, eloOfFirst, eloBetweenEach);
    return res.sendStatus(200);
  } catch (error) {
    console.log("createSequentialEloTestUsersRoute error: ", error);
    return next(error);
  }
}
