import { Socket } from "socket.io";
import { BattleRoomGame, gameChannelNamePrefix, GameStatus, ONE_SECOND, SocketEventsFromServer } from "../../../../common";
import { LucellaServer } from ".";
import createGamePhysicsInterval from "../../battleRoomGame/createGamePhysicsInterval";

// eslint-disable-next-line consistent-return
export default function handleReadyStateToggleRequest(server: LucellaServer, socket: Socket) {
  const { io, connectedSockets, lobby, games } = server;
  const { currentGameName } = connectedSockets[socket.id];
  if (!currentGameName) return console.error(`${connectedSockets[socket.id].associatedUser.username} clicked ready but wasn't in a game`);
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
    io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
    gameRoom.countdownInterval = setInterval(() => {
      console.log(`${gameRoom.gameName} :${gameRoom.countdown.current}`);
      io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE, gameRoom.countdown.current);
      gameRoom.countdown.current -= 1;
      if (gameRoom.countdown.current > 0) return;
      if (gameRoom.countdownInterval) clearInterval(gameRoom.countdownInterval);
      gameRoom.gameStatus = GameStatus.IN_PROGRESS;
      io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
      games[currentGameName] = new BattleRoomGame(currentGameName, gameRoom.isRanked);
      const game = games[currentGameName];
      io.to(gameChatChannelName).emit(SocketEventsFromServer.GAME_INITIALIZATION);
      game.intervals.physics = createGamePhysicsInterval(io, socket, server, currentGameName);
    }, ONE_SECOND);
  } else {
    gameRoom.cancelCountdownInterval();
    io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
    io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE, gameRoom.countdown.current);
  }
}
