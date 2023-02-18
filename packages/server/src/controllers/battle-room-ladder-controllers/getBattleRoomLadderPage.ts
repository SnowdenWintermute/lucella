/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from "express";
import { ErrorMessages, pageSize } from "../../../../common";
import CustomError from "../../classes/CustomError";
import { REDIS_KEYS } from "../../consts";
import BattleRoomScoreCardRepo from "../../database/repos/battle-room-game/score-cards";
import { wrappedRedis } from "../../utils/RedisContext";

export default async function getBattleRoomLadderPage(req: Request, res: Response, next: NextFunction) {
  const pageNumberAsString = req.params.page;
  console.log("req.params", req.params);
  const pageNumber = parseInt(pageNumberAsString, 10);
  if (typeof pageNumber !== "number" || Number.isNaN(pageNumber)) return next([new CustomError("Invalid page number", 501)]);
  console.log("typeof pageNumber: ", typeof pageNumber);

  // get total number of pages
  const totalNumEntries = await wrappedRedis.context?.zCard(REDIS_KEYS.BATTLE_ROOM_LADDER);
  if (!totalNumEntries) return next([new CustomError(ErrorMessages.LADDER.NO_ENTRIES_FOUND, 404)]);
  const totalNumberOfPages = Math.ceil(totalNumEntries / pageSize);
  console.log(pageNumber, pageSize, "start: ", pageNumber * pageSize, "end: ", pageSize + pageSize * pageNumber);
  const inRedis = await wrappedRedis.context?.zRangeWithScores(REDIS_KEYS.BATTLE_ROOM_LADDER, pageNumber * pageSize, pageSize + pageSize * pageNumber, {
    REV: true,
  });
  if (!inRedis) return next([new CustomError(ErrorMessages.LADDER.NO_ENTRIES_FOUND, 404)]);
  const ids = inRedis.map((item) => parseInt(item.value, 10));
  const scoreCardsWithUsernames = await BattleRoomScoreCardRepo.getScoreCardsWithUsernameByUserIds(ids);
  //
  ids.forEach((id, i) => {
    const rank = pageNumber * pageSize + i + 1;
    console.log("rank: ", rank);
  });
  console.log("scoreCardsWithUsernames: ", scoreCardsWithUsernames);
  if (inRedis) return res.status(200).json({ totalNumberOfPages, pageData: scoreCardsWithUsernames });
}
