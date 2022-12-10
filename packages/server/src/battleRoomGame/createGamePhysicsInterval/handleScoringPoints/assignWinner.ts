import { BattleRoomGame, PlayerRole } from "@lucella/common";

export default function assignWinner(game: BattleRoomGame) {
  if (game.score.challenger >= game.score.neededToWin && game.score.host >= game.score.neededToWin) game.winner = "tie";
  else {
    if (game.score.challenger >= game.score.neededToWin) game.winner = PlayerRole.CHALLENGER;
    if (game.score.host >= game.score.neededToWin) game.winner = PlayerRole.HOST;
  }
}
