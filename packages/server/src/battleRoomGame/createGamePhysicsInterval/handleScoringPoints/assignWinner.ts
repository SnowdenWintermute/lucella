import { BattleRoomGame, PlayerRole } from "../../../../../common";
import { LucellaServer } from "../../../LucellaServer";

export default function assignWinner(server: LucellaServer, game: BattleRoomGame) {
  const gameRoom = server.lobby.gameRooms[game.gameName];
  if (game.score.challenger >= game.score.neededToWin && game.score.host >= game.score.neededToWin) console.log("game ended in a tie"); // should be impossible

  if (game.score.challenger >= game.score.neededToWin) {
    game.winner = PlayerRole.CHALLENGER;
    gameRoom.winner = gameRoom.players.challenger!.associatedUser.username;
  }
  if (game.score.host >= game.score.neededToWin) {
    game.winner = PlayerRole.HOST;
    gameRoom.winner = gameRoom.players.host!.associatedUser.username;
  }
}
