/* eslint-disable consistent-return */
import { ErrorMessages, SocketEventsFromServer } from "../../../../common";
import handleNewSocketConnection from "./handleNewSocketConnection";
import lobbyUiListeners from "./listeners/lobbyUiListeners";
import battleRoomGameListeners from "./listeners/battleRoomGameListeners";
import { LucellaServer } from ".";
import { wrappedRedis } from "../../utils/RedisContext";

export default function initializeListeners(server: LucellaServer) {
  server.io.sockets.on("connect", async (socket) => {
    await handleNewSocketConnection(server, socket);
    socket.emit(SocketEventsFromServer.AUTHENTICATION_COMPLETE, null);
    socket.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, server.lobby.getSanitizedGameRooms());
    socket.emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, null);
    socket.onAny(() => {
      if (!server.connectedSockets[socket.id]) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.LOBBY.SOCKET_NOT_REGISTERED);
    });
    lobbyUiListeners(server, socket);
    battleRoomGameListeners(server, socket);

    socket.on("disconnect", () => server.handleSocketDisconnection(socket));
  });
}
