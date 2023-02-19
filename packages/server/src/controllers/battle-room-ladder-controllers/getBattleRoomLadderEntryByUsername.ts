import { NextFunction, Request, Response } from "express";
import { BattleRoomLadderEntry, ErrorMessages } from "../../../../common";
import CustomError from "../../classes/CustomError";
import { REDIS_KEYS } from "../../consts";
import BattleRoomScoreCardRepo from "../../database/repos/battle-room-game/score-cards";
import { wrappedRedis } from "../../utils/RedisContext";

export default async function getBattleRoomLadderEntryByUsername(req: Request, res: Response, next: NextFunction) {
  const { username } = req.params;
  console.log("searching ladder entry for user ", username);
  const ladderEntry = await BattleRoomScoreCardRepo.getLadderEntryUsername(username.toLowerCase());
  console.log("ladder entry: ", ladderEntry);
  if (!ladderEntry) return next([new CustomError(ErrorMessages.LADDER.USER_NOT_FOUND, 404)]);

  const rank = await wrappedRedis.context?.zRevRank(REDIS_KEYS.BATTLE_ROOM_LADDER, ladderEntry.userId.toString());
  console.log(`rank found for user ${username}: `, rank);
  if (!rank) return next([new CustomError(ErrorMessages.LADDER.NO_RANK_FOUND, 404)]);
  const { name, elo, wins, losses } = ladderEntry;
  const ladderEntryForClient: BattleRoomLadderEntry = {
    name,
    rank,
    elo,
    wins,
    losses,
  };
  console.log("ladderEntryForClient: ", ladderEntryForClient);
  return res.status(200).json({ ladderEntry: ladderEntryForClient });
}
