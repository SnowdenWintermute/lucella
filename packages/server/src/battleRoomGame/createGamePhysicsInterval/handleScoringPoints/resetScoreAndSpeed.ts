import { baseSpeedModifier, BattleRoomGame } from "../../../../../common";

export default function resetScoreAndSpeed(game: BattleRoomGame) {
  game.score.host = 0;
  game.score.challenger = 0;
  game.speedModifier = baseSpeedModifier;
  game.score.neededToWin = game.config.numberOfPointsRequiredToWinRound;
}
