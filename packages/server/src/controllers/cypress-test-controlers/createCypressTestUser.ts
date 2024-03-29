import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import BattleRoomScoreCardRepo from "../../database/repos/battle-room-game/score-cards";

import UsersRepo from "../../database/repos/users";
import { TEST_USER_EMAIL, TEST_USER_NAME, TEST_USER_PASSWORD } from "../../utils/test-utils/consts";

export default async function createCypressTestUser(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.body.email || TEST_USER_EMAIL;
    const name = req.body.name || TEST_USER_NAME;
    const hashedPassword = await bcrypt.hash(TEST_USER_PASSWORD, 12);
    const { role } = req.body;
    const user = await UsersRepo.insert(name, email, hashedPassword, role);
    if (req.body.elo) {
      const scoreCard = await BattleRoomScoreCardRepo.insert(user.id);
      await BattleRoomScoreCardRepo.update({ ...scoreCard, elo: req.body.elo });
    }
    return res.sendStatus(201);
  } catch (error) {
    return next(error);
  }
}
