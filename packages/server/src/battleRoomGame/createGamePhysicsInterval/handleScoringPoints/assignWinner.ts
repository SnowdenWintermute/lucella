/* eslint-disable no-nested-ternary */
import createGamePhysicsInterval from "..";
import { baseSpeedModifier, BattleRoomGame, gameChannelNamePrefix, GameStatus, PlayerRole, SocketEventsFromServer } from "../../../../../common";
import { LucellaServer } from "../../../LucellaServer";

export default function assignWinner(server: LucellaServer, game: BattleRoomGame) {
  const gameRoom = server.lobby.gameRooms[game.gameName];
  if (game.score.challenger >= game.score.neededToWin && game.score.host >= game.score.neededToWin) console.log("game ended in a tie"); // should be impossible

  const challengerWon = game.score.challenger >= game.score.neededToWin;
  const hostWon = game.score.host >= game.score.neededToWin;
  const winnerPlayerRole = hostWon ? PlayerRole.HOST : challengerWon ? PlayerRole.CHALLENGER : undefined;

  if (winnerPlayerRole && gameRoom.roundsWon[winnerPlayerRole] >= gameRoom.numberOfRoundsRequiredToWin) {
    game.winner = winnerPlayerRole;
    gameRoom.winner = gameRoom.players[winnerPlayerRole]!.associatedUser.username;
  } else if (winnerPlayerRole) {
    BattleRoomGame.initializeWorld(game);
    //
    game.score.host = 0;
    game.score.challenger = 0;
    game.speedModifier = baseSpeedModifier;
    game.score.neededToWin = BattleRoomGame.initialScoreNeededToWin;
    //
    gameRoom.roundsWon[winnerPlayerRole] += 1;
    const gameChatChannelName = gameChannelNamePrefix + game.gameName;
    gameRoom.gameStatus = GameStatus.STARTING_NEXT_ROUND;
    server.io.in(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
    server.io.in(gameChatChannelName).emit(SocketEventsFromServer.NEW_ROUND_STARTING_COUNTDOWN_UPDATE, game.newRoundCountdown.current);
    game.newRoundCountdown.current = game.newRoundCountdown.duration;
    game.intervals.newRoundCountdown = setInterval(() => {
      game.newRoundCountdown.current! -= 1;
      server.io.to(gameChatChannelName).emit(SocketEventsFromServer.NEW_ROUND_STARTING_COUNTDOWN_UPDATE, game.newRoundCountdown.current);
      if (game.newRoundCountdown.current! > 0) return;
      game.clearNewRoundCountdownInterval();
    });
  }

  // if (game.score.host >= game.score.neededToWin) {
  //   game.winner = PlayerRole.HOST;
  //   gameRoom.winner = gameRoom.players.host!.associatedUser.username;
  // }
}
