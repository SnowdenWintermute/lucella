import { NextFunction, Request, Response } from "express";
import { ErrorMessages } from "../../../../common";
import CustomError from "../../classes/CustomError";
import BattleRoomScoreCardRepo from "../../database/repos/battle-room-game/score-cards";

export default async function getBattleRoomLadderEntryByUsername(req: Request, res: Response, next: NextFunction) {
  const { username } = req.params;
  const ladderEntry = await BattleRoomScoreCardRepo.getLadderEntryUsername(username.toLowerCase());
  if (ladderEntry) return res.status(200).json({ ladderEntry });
  return next([new CustomError(ErrorMessages.LADDER.USER_NOT_FOUND, 404)]);
}
