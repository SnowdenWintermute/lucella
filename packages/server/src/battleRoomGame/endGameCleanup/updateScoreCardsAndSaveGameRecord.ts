/* eslint-disable consistent-return */
import { PlayerRole, GameRoom, BattleRoomGame, IBattleRoomGameRecord } from "../../../../common";

import updateElos from "./updateElos";
import UserRepo from "../../database/repos/users";
import BattleRoomScoreCardRepo from "../../database/repos/battle-room-game/score-cards";
import BattleRoomGameRecordRepo from "../../database/repos/battle-room-game/game-records";
import { wrappedRedis } from "../../utils/RedisContext";
import { REDIS_KEYS } from "../../consts";
// import updateLadder from "./updateLadder";

export default async function updateScoreCardsAndSaveGameRecord(gameRoom: GameRoom, game: BattleRoomGame): Promise<IBattleRoomGameRecord | null> {
  if (!gameRoom.isRanked) return null;
  console.log("updating score cards for game ", game.gameName);

  const winnerRole = game.winner!;

  // determine if both players have accounts in the database
  const hostUser = await UserRepo.findOne("name", gameRoom.players.host?.associatedUser.username);
  const challengerUser = await UserRepo.findOne("name", gameRoom.players.challenger?.associatedUser.username);
  if (!challengerUser || !hostUser) throw new Error("tried to update ranked game record in a game in which at least one user wasn't registered");
  // if both players are registered users, update their win loss records
  const hostScoreCard = await BattleRoomScoreCardRepo.findByUserId(hostUser.id);
  const challengerScoreCard = await BattleRoomScoreCardRepo.findByUserId(challengerUser.id);
  if (!hostScoreCard || !challengerScoreCard) return null;

  const { hostElo, challengerElo, newHostElo, newChallengerElo } = updateElos(hostScoreCard, challengerScoreCard, winnerRole);
  hostScoreCard.elo = newHostElo;
  challengerScoreCard.elo = newChallengerElo;

  if (winnerRole === PlayerRole.HOST) {
    hostScoreCard.wins += 1;
    challengerScoreCard.losses += 1;
  }
  if (winnerRole === PlayerRole.CHALLENGER) {
    challengerScoreCard.wins += 1;
    hostScoreCard.losses += 1;
  }

  const hostPreGameRank = await wrappedRedis.context?.zRevRank(REDIS_KEYS.BATTLE_ROOM_LADDER, hostUser.id.toString());
  const challengerPreGameRank = await wrappedRedis.context?.zRevRank(REDIS_KEYS.BATTLE_ROOM_LADDER, challengerUser.id.toString());
  await BattleRoomScoreCardRepo.update(hostScoreCard);
  await BattleRoomScoreCardRepo.update(challengerScoreCard);
  await wrappedRedis.context?.zAdd(REDIS_KEYS.BATTLE_ROOM_LADDER, [
    { value: hostScoreCard.userId.toString(), score: hostScoreCard.elo },
    { value: challengerScoreCard.userId.toString(), score: challengerScoreCard.elo },
  ]);

  const hostPostGameRank = await wrappedRedis.context?.zRevRank(REDIS_KEYS.BATTLE_ROOM_LADDER, hostUser.id.toString());
  const challengerPostGameRank = await wrappedRedis.context?.zRevRank(REDIS_KEYS.BATTLE_ROOM_LADDER, challengerUser.id.toString());

  if (
    typeof hostPreGameRank !== "number" ||
    typeof hostPostGameRank !== "number" ||
    typeof challengerPreGameRank !== "number" ||
    typeof challengerPostGameRank !== "number"
  ) {
    console.error(
      hostPreGameRank,
      hostPostGameRank,
      challengerPreGameRank,
      challengerPostGameRank,
      "couldn't find ladder ranks for a player when trying to create a game record"
    );
    return null;
  }
  // save game record
  const gameRecord = await BattleRoomGameRecordRepo.insert(
    hostUser.id,
    game.score.host,
    hostElo,
    newHostElo,
    hostPreGameRank,
    hostPostGameRank,
    challengerUser.id,
    game.score.challenger,
    challengerElo,
    newChallengerElo,
    challengerPreGameRank,
    challengerPostGameRank
  );

  return gameRecord;
}
