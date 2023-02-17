import { NextFunction, Request, Response } from "express";
import { pageSize } from "../../../../common";
import { REDIS_KEYS } from "../../consts";
import BattleRoomScoreCardRepo from "../../database/repos/battle-room-game/score-cards";
import { wrappedRedis } from "../../utils/RedisContext";

export default async function getBattleRoomLadderPage(req: Request, res: Response, next: NextFunction) {
  const { page } = req.params;
  const pageAsNumber = parseInt(page, 10);
  // get total number of pages
  const totalNumEntries = await wrappedRedis.context?.zCard(REDIS_KEYS.BATTLE_ROOM_LADDER);
  if (!totalNumEntries) return res.status(404).json({});
  const totalNumberOfPages = Math.ceil(totalNumEntries / pageSize);
  console.log("start: ", pageAsNumber * pageAsNumber, "end: ", pageSize + pageSize * pageAsNumber);
  const inRedis = await wrappedRedis.context?.zRangeWithScores(REDIS_KEYS.BATTLE_ROOM_LADDER, pageAsNumber * pageAsNumber, pageSize + pageSize * pageAsNumber, {
    REV: true,
  });
  if (!inRedis) return res.status(404).json({});
  const ids = inRedis.map((item) => parseInt(item.value, 10));
  const scoreCardsWithUsernames = await BattleRoomScoreCardRepo.getScoreCardWithUsernameByUserIds(ids);
  console.log("scoreCardsWithUsernames: ", scoreCardsWithUsernames);
  if (inRedis) {
    return res.status(200).json({ totalNumberOfPages, pageData: scoreCardsWithUsernames });
  }
}
