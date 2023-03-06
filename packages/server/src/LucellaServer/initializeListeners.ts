/* eslint-disable consistent-return */
import { ErrorMessages, SocketEventsFromServer, GENERIC_SOCKET_EVENTS, ChatMessage, ChatMessageStyles } from "../../../common";
import handleNewSocketConnection from "./handleNewSocketConnection";
import lobbyUiListeners from "./listeners/lobbyUiListeners";
import battleRoomGameListeners from "./listeners/battleRoomGameListeners";
import { LucellaServer } from ".";

export default function initializeListeners(server: LucellaServer) {
  server.io.sockets.on(GENERIC_SOCKET_EVENTS.CONNECT, async (socket) => {
    await handleNewSocketConnection(server, socket);
    socket.emit(
      SocketEventsFromServer.NEW_CHAT_MESSAGE,
      new ChatMessage(
        "Battle School is in alpha. All accounts are likely to be deleted upon the first beta release. Please report any issues here: https://github.com/SnowdenWintermute/lucella/issues",
        "Server",
        ChatMessageStyles.WARNING
      )
    );
    socket.emit(SocketEventsFromServer.AUTHENTICATION_COMPLETE, null);
    socket.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, server.lobby.getSanitizedGameRooms());
    socket.emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, null);
    socket.onAny(() => {
      if (!server.connectedSockets[socket.id]) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.LOBBY.SOCKET_NOT_REGISTERED);
    });
    lobbyUiListeners(server, socket);
    battleRoomGameListeners(server, socket);
    socket.on(GENERIC_SOCKET_EVENTS.DISCONNECT, () => server.handleSocketDisconnection(socket));
  });
}
