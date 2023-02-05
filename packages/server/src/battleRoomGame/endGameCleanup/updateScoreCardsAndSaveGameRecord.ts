/* eslint-disable consistent-return */
import { PlayerRole, GameRoom, BattleRoomGame, IBattleRoomGameRecord } from "../../../../common";

import updateElos from "./updateElos";
import UserRepo from "../../database/repos/users";
import BattleRoomScoreCardRepo from "../../database/repos/battle-room-game/score-cards";
import BattleRoomGameRecordRepo from "../../database/repos/battle-room-game/game-records";
// import updateLadder from "./updateLadder";

export default async function updateScoreCardsAndSaveGameRecord(
  gameRoom: GameRoom,
  game: BattleRoomGame,
  isRanked: boolean
): Promise<IBattleRoomGameRecord | null> {
  if (!isRanked) return null;
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

  await BattleRoomScoreCardRepo.update(hostScoreCard);
  await BattleRoomScoreCardRepo.update(challengerScoreCard);

  // save game record
  const gameRecord = await BattleRoomGameRecordRepo.insert(
    hostUser.id,
    game.score.host,
    hostElo,
    newHostElo,
    challengerUser.id,
    game.score.challenger,
    challengerElo,
    newChallengerElo
  );

  return gameRecord;
}