import { BattleRoomGame } from "../../../../../common";

export default (game: BattleRoomGame) => {
  if (game.score.neededToWin === 1) return;
  if (Math.abs(game.score.challenger - game.score.host) < 2) {
    if (game.score.challenger >= game.score.neededToWin - 1 && game.score.host >= game.score.neededToWin - 1) {
      game.score.neededToWin += 1;
    }
  }
};
