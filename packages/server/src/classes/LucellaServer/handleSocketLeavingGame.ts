/* eslint-disable consistent-return */
import { Socket } from "socket.io";
import { ErrorMessages, GameStatus, PlayerRole, SocketEventsFromServer } from "../../../../common";
import { LucellaServer } from "../LucellaServer";

export default function handleSocketLeavingGame(server: LucellaServer, socket: Socket, isDisconnecting: boolean) {
  const { io, lobby, connectedSockets, games } = server;
  const { currentGameName } = connectedSockets[socket.id];
  console.log(`${socket.id} leaving game ${currentGameName}`);
  if (!currentGameName) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.CANT_LEAVE_GAME_IF_YOU_ARE_NOT_IN_ONE);
  const gameRoom = lobby.gameRooms[currentGameName];
  if (!gameRoom) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.CANT_LEAVE_GAME_THAT_DOES_NOT_EXIST);

  const usernameOfPlayerLeaving = connectedSockets[socket.id].associatedUser.username;
  const { players } = gameRoom;
  const playerToKick = players.challenger && players.host?.associatedUser.username === usernameOfPlayerLeaving ? players.challenger : undefined;

  if (gameRoom.gameStatus === GameStatus.IN_LOBBY || gameRoom.gameStatus === GameStatus.COUNTING_DOWN)
    server.lobby.handleSocketLeavingGameRoom(socket, gameRoom, isDisconnecting, playerToKick);
  else {
    const game = games[currentGameName];
    game.winner = playerToKick ? players.host?.associatedUser.username : players.challenger?.associatedUser.username;
    if (gameRoom.gameStatus === GameStatus.ENDING) return;
    gameRoom.winner = game.winner === PlayerRole.HOST ? players!.host!.associatedUser.username : players!.challenger!.associatedUser.username;
    server.endGameAndEmitUpdates(game);
  }
  io.sockets.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, lobby.getSanitizedGameRooms());
}
