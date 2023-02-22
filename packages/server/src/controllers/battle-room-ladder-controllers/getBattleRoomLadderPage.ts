/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from "express";
import { ErrorMessages, pageSize } from "../../../../common";
import CustomError from "../../classes/CustomError";
import { REDIS_KEYS } from "../../consts";
import BattleRoomScoreCardRepo from "../../database/repos/battle-room-game/score-cards";
import { wrappedRedis } from "../../utils/RedisContext";

export default async function getBattleRoomLadderPage(req: Request, res: Response, next: NextFunction) {
  const pageNumberAsString = req.params.page;
  const pageNumber = parseInt(pageNumberAsString, 10);
  if (typeof pageNumber !== "number" || Number.isNaN(pageNumber)) return next([new CustomError("Invalid page number", 501)]);

  const totalNumEntries = await wrappedRedis.context?.zCard(REDIS_KEYS.BATTLE_ROOM_LADDER);
  if (!totalNumEntries) return next([new CustomError(ErrorMessages.LADDER.NO_ENTRIES_FOUND, 404)]);
  const totalNumberOfPages = Math.ceil(totalNumEntries / pageSize);
  const start = pageNumber * pageSize;
  const end = pageSize + pageSize * pageNumber;

  const inRedis = await wrappedRedis.context?.zRangeWithScores(REDIS_KEYS.BATTLE_ROOM_LADDER, start, end - 1, {
    REV: true,
  });
  console.log("ladder page in redis: ", inRedis);
  if (!inRedis) {
    console.log("no ladder entries in redis");
    return next([new CustomError(`${ErrorMessages.LADDER.NO_ENTRIES_FOUND}no ladder entries in redis`, 404)]);
  }

  const ids = inRedis.map((item) => parseInt(item.value, 10));
  if (!ids.length) {
    console.log("redis entries didn't contain ids");
    return next([new CustomError(`${ErrorMessages.LADDER.NO_ENTRIES_FOUND}redis entries didn't contain ids`, 404)]);
  }
  const scoreCardsWithUsernames = await BattleRoomScoreCardRepo.getScoreCardsWithUsernameByUserIds(ids);
  if (!scoreCardsWithUsernames) {
    console.log("didn't find score cards in psql");
    return next([new CustomError(`${ErrorMessages.LADDER.NO_ENTRIES_FOUND}didn't find score cards in psql`, 404)]);
  }
  const sortedByElo = scoreCardsWithUsernames.sort((a, b) => b.elo - a.elo);
  const withRanks = sortedByElo.map((item, i) => {
    item.rank = i + start + 1;
    return item;
  });

  if (inRedis) return res.status(200).json({ totalNumberOfPages, pageData: withRanks });
}
