/* eslint-disable consistent-return */
import {
  baseSpeedModifier,
  BattleRoomGame,
  gameChannelNamePrefix,
  GameStatus,
  ONE_SECOND,
  setOrbsAtStartPositions,
  SocketEventsFromServer,
} from "../../../../../common";
import { LucellaServer } from "../../../LucellaServer";
export default function startNextRound(server: LucellaServer, game: BattleRoomGame) {
  const gameRoom = server.lobby.gameRooms[game.gameName];
  const gameChatChannelName = gameChannelNamePrefix + game.gameName;
  //
  game.score.host = 0;
  game.score.challenger = 0;
  game.speedModifier = baseSpeedModifier;
  game.score.neededToWin = game.config.numberOfPointsRequiredToWinRound;
  //
  gameRoom.gameStatus = GameStatus.STARTING_NEXT_ROUND;
  server.io.in(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
  game.newRoundCountdown.current = game.newRoundCountdown.duration;
  server.io.in(gameChatChannelName).emit(SocketEventsFromServer.NEW_ROUND_STARTING_COUNTDOWN_UPDATE, game.newRoundCountdown.current);
  const decrementCountdownAndUpdate = () => {
    game.intervals.newRoundCountdown = setTimeout(() => {
      game.newRoundCountdown.current! -= 1;
      server.io.in(gameChatChannelName).emit(SocketEventsFromServer.NEW_ROUND_STARTING_COUNTDOWN_UPDATE, game.newRoundCountdown.current);
      if (game.newRoundCountdown.current! <= 1) setOrbsAtStartPositions(game.orbs);
      if (game.newRoundCountdown.current! > 0) return decrementCountdownAndUpdate();
      game.clearNewRoundCountdownInterval();
      setOrbsAtStartPositions(game.orbs);
      server.io.in(gameChatChannelName).emit(SocketEventsFromServer.NEW_ROUND_STARTING_COUNTDOWN_UPDATE, game.newRoundCountdown.current);
      gameRoom.gameStatus = GameStatus.IN_PROGRESS;
      server.io.in(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
    }, ONE_SECOND);
  };
  decrementCountdownAndUpdate();
}
