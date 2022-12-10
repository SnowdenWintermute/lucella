import { BattleRoomGame, gameChannelNamePrefix, GameStatus, SocketEventsFromServer } from "../../../../common";
import { Socket } from "socket.io";
import { LucellaServer } from ".";
import createGamePhysicsInterval from "../../battleRoomGame/createGamePhysicsInterval";

export default function handleReadyStateToggleRequest(server: LucellaServer, socket: Socket) {
  const { io, connectedSockets, lobby, games } = server;
  const { currentGameName } = connectedSockets[socket.id];
  if (!currentGameName) return console.error("client clicked ready but wasn't in a game");
  const gameRoom = lobby.gameRooms[currentGameName];
  if (!gameRoom) return console.error("No such game exists");
  if (gameRoom.gameStatus === GameStatus.COUNTING_DOWN && gameRoom.isRanked) return console.error("Can't unready from ranked game");
  const { players, playersReady } = gameRoom;
  const gameChatChannelName = gameChannelNamePrefix + currentGameName;

  if (players.host!.uuid === connectedSockets[socket.id].uuid) playersReady.host = !playersReady.host;
  else if (players.challenger!.uuid === connectedSockets[socket.id].uuid) playersReady.challenger = !playersReady.challenger;
  io.to(gameChatChannelName).emit(SocketEventsFromServer.PLAYER_READINESS_UPDATE, playersReady);

  if (playersReady.host && playersReady.challenger) {
    gameRoom.gameStatus = GameStatus.COUNTING_DOWN;
    gameRoom.countdownInterval = setInterval(() => {
      io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
      if (gameRoom.countdown.current > 0) return;
      gameRoom.countdownInterval && clearInterval(gameRoom.countdownInterval);
      gameRoom.gameStatus = GameStatus.IN_PROGRESS;
      io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
      games[currentGameName] = new BattleRoomGame(currentGameName);
      const game = games[currentGameName];
      io.to(gameChatChannelName).emit(SocketEventsFromServer.GAME_INITIALIZATION);
      game.intervals.physics = createGamePhysicsInterval(io, socket, server, currentGameName);
      gameRoom.countdown.current--;
    }, 1000);
  } else {
    gameRoom.cancelCountdownInterval();
    io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
    io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE, gameRoom.countdown.current);
  }
}
