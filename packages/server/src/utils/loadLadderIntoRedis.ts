/* eslint-disable no-await-in-loop */
import { REDIS_KEYS } from "../consts";
import BattleRoomScoreCardRepo from "../database/repos/battle-room-game/score-cards";
import { wrappedRedis } from "./RedisContext";

export default async function loadLadderIntoRedis() {
  const pageSize = 10;
  let currentPage = 0;
  let lastPageReached = false;
  while (!lastPageReached) {
    const currentPageOfScoreCards = await BattleRoomScoreCardRepo.getEloAndUserIdByPage(pageSize, currentPage * pageSize);
    if (currentPageOfScoreCards) {
      const forRedis = currentPageOfScoreCards.map((scoreCard) => {
        return { value: scoreCard.userId.toString(), score: scoreCard.elo };
      });
      await wrappedRedis.context?.zAdd(REDIS_KEYS.BATTLE_ROOM_LADDER, forRedis);
    }
    if (!currentPageOfScoreCards || currentPageOfScoreCards.length < pageSize) lastPageReached = true;
    currentPage += 1;
  }

  const inRedis = await wrappedRedis.context?.zRangeWithScores(REDIS_KEYS.BATTLE_ROOM_LADDER, 0, 100000, { REV: true });
  console.log("inRedis:,", inRedis);
}
