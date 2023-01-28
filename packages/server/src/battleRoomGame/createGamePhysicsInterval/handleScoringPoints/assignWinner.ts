/* eslint-disable no-param-reassign */
import { BattleRoomGame, PlayerRole } from "../../../../../common";
import { LucellaServer } from "../../../classes/LucellaServer";

export default function assignWinner(server: LucellaServer, game: BattleRoomGame) {
  const gameRoom = server.lobby.gameRooms[game.gameName];
  if (game.score.challenger >= game.score.neededToWin && game.score.host >= game.score.neededToWin) {
    game.winner = "tie"; // @todo - what really happens in this situation?
    gameRoom.winner = "game ended in a draw";
  } else {
    if (game.score.challenger >= game.score.neededToWin) {
      game.winner = PlayerRole.CHALLENGER;
      gameRoom.winner = gameRoom.players.challenger!.associatedUser.username;
    }
    if (game.score.host >= game.score.neededToWin) {
      game.winner = PlayerRole.HOST;
      gameRoom.winner = gameRoom.players.host!.associatedUser.username;
    }
  }
}
