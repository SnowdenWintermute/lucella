import { ErrorMessages, GameStatus, PlayerRole, SocketEventsFromServer } from "../../../../common";
import { LucellaServer } from ".";
import { Socket } from "socket.io";

export default function handlePlayerLeavingGame(lucellaServer: LucellaServer, socket: Socket, isDisconnecting: boolean) {
  const { io, lobbyManager, connectedSockets, games } = lucellaServer;
  const { currentGameName } = connectedSockets[socket.id];
  console.log(`${socket.id} leaving game ${currentGameName}`);
  if (!currentGameName) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.CANT_LEAVE_GAME_IF_YOU_ARE_NOT_IN_ONE);
  const gameRoom = lobbyManager.gameRooms[currentGameName];
  if (!gameRoom) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.CANT_LEAVE_GAME_THAT_DOES_NOT_EXIST);

  const usernameOfPlayerLeaving = connectedSockets[socket.id].associatedUser.username;
  const { players } = gameRoom;
  const playerToKick = players.challenger && players.host?.associatedUser.username === usernameOfPlayerLeaving ? players.challenger : undefined;

  if (gameRoom.gameStatus === GameStatus.IN_LOBBY || gameRoom.gameStatus === GameStatus.COUNTING_DOWN)
    lucellaServer.handleSocketLeavingGameRoom(socket, gameRoom, isDisconnecting, playerToKick);
  else {
    const game = games[currentGameName];
    game.winner = playerToKick ? players.host?.associatedUser.username : players.challenger?.associatedUser.username;
    if (gameRoom.gameStatus === GameStatus.ENDING) return;
    gameRoom.winner = game.winner === PlayerRole.HOST ? players!.host!.associatedUser.username : players!.challenger!.associatedUser.username;
    lucellaServer.endGameAndEmitUpdates(game);
  }
  io.sockets.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, lobbyManager.getSanitizedGameRooms());
}
