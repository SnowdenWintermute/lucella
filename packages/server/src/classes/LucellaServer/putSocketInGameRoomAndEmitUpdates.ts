import { ErrorMessages, gameChannelNamePrefix, PlayerRole, SocketEventsFromServer } from "../../../../common";
import { Socket } from "socket.io";
import { LucellaServer } from ".";

export default function putSocketInGameRoomAndEmitUpdates(lucellaServer: LucellaServer, socket: Socket, gameName: string) {
  const { io, lobby, connectedSockets } = lucellaServer;
  const username = connectedSockets[socket.id].associatedUser.username;
  const gameRoom = lobby.gameRooms[gameName];
  try {
    if (!gameRoom) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE);
    if (connectedSockets[socket.id].currentGameName) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.GAME_DOES_NOT_EXIST);
    if (gameRoom.players.host && gameRoom.players.challenger) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.GAME_IS_FULL);
    if (gameRoom.players.host && gameRoom.players.host.associatedUser.username === username)
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.CANT_PLAY_AGAINST_SELF); // to prevent a logged in player from playing against themselves by opening another browser window

    connectedSockets[socket.id].currentGameName = gameName;
    let playerRole;
    if (!gameRoom.players.host) {
      gameRoom.players.host = connectedSockets[socket.id];
      playerRole = PlayerRole.HOST;
    } else if (!gameRoom.players.challenger) {
      gameRoom.players.challenger = connectedSockets[socket.id];
      playerRole = PlayerRole.CHALLENGER;
    }
    socket.emit(SocketEventsFromServer.PLAYER_ROLE_ASSIGNMENT, playerRole);
    io.sockets.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, lobby.getSanitizedGameRooms());
    io.to(gameChannelNamePrefix + gameName).emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, lobby.getSanitizedGameRoom(gameRoom));
    return gameRoom;
  } catch (error) {
    console.log(error);
  }
}
