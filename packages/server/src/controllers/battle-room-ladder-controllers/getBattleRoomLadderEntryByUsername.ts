import { NextFunction, Request, Response } from "express";
import { BattleRoomLadderEntry, ERROR_MESSAGES } from "../../../../common";
import CustomError from "../../classes/CustomError";
import { REDIS_KEYS } from "../../consts";
import BattleRoomScoreCardRepo from "../../database/repos/battle-room-game/score-cards";
import { wrappedRedis } from "../../utils/RedisContext";

export default async function getBattleRoomLadderEntryByUsername(req: Request, res: Response, next: NextFunction) {
  const { username } = req.params;
  console.log("searching for ladder entry for user named ", username);
  const ladderEntry = await BattleRoomScoreCardRepo.getLadderEntryUsername(username.toLowerCase());
  if (!ladderEntry) {
    console.log("no ladder entry found");
    return next([new CustomError(ERROR_MESSAGES.LADDER.USER_NOT_FOUND, 404)]);
  }
  const rank = await wrappedRedis.context?.zRevRank(REDIS_KEYS.BATTLE_ROOM_LADDER, ladderEntry.userId.toString());
  if (typeof rank !== "number") {
    console.log("no rank found");
    return next([new CustomError(ERROR_MESSAGES.LADDER.NO_RANK_FOUND, 404)]);
  }
  const { name, elo, wins, losses } = ladderEntry;
  const ladderEntryForClient: BattleRoomLadderEntry = { name, rank: rank + 1, elo, wins, losses };
  return res.status(200).json({ ladderEntry: ladderEntryForClient });
}
