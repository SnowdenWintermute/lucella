/* eslint-disable no-nested-ternary */
import { BattleRoomGame, gameChannelNamePrefix, PlayerRole, SocketEventsFromServer } from "../../../../../common";
import updateScoreNeededToWin from "./updateScoreNeededToWin";
import { LucellaServer } from "../../../LucellaServer";
import startNextRound from "./startNextRound";

export default function handleScoringPoints(server: LucellaServer, game: BattleRoomGame) {
  updateScoreNeededToWin(game); // players must win by at least 2 points
  const gameRoom = server.lobby.gameRooms[game.gameName];
  if (game.score.challenger >= game.score.neededToWin && game.score.host >= game.score.neededToWin) console.log("game ended in a tie"); // should be impossible
  const challengerWon = game.score.challenger >= game.score.neededToWin;
  const hostWon = game.score.host >= game.score.neededToWin;
  const winnerPlayerRole = hostWon ? PlayerRole.HOST : challengerWon ? PlayerRole.CHALLENGER : undefined;
  const gameChatChannelName = gameChannelNamePrefix + game.gameName;
  if (winnerPlayerRole) {
    // gameRoom needs to know about roundsWon to display in the score screen
    // game needs to know about roundsWon to display in canvas
    gameRoom.roundsWon[winnerPlayerRole] += 1;
    game.roundsWon[winnerPlayerRole] += 1;
    server.io.in(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_NUMBER_OF_ROUNDS_WON, gameRoom.roundsWon);
    if (gameRoom.roundsWon[winnerPlayerRole] >= gameRoom.battleRoomGameConfig.numberOfRoundsRequiredToWin) {
      game.winner = winnerPlayerRole;
      gameRoom.winner = gameRoom.players[winnerPlayerRole]!.associatedUser.username;
    } else {
      startNextRound(server, game);
    }
  }
}
