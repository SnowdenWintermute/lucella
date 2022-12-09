import { ErrorMessages, SocketEventsFromServer } from "../../../../common";
import handleNewSocketConnection from "../../sockets/generalFunctions/handleNewSocketConnection";
import chatListeners from "../../sockets/listeners/chatListeners";
import lobbyUiListeners from "../../sockets/listeners/lobbyUiListeners";
import battleRoomGameListeners from "../../sockets/listeners/battleRoomGameListeners";
import handleSocketDisconnection from "../../sockets/generalFunctions/handleSocketDisconnection";
import { LucellaServer } from ".";

export default function initializeListeners(server: LucellaServer) {
  server.io.sockets.on("connect", async (socket) => {
    await handleNewSocketConnection(server, socket);
    socket.emit(SocketEventsFromServer.AUTHENTICATION_COMPLETE, null);
    socket.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, server.lobby.getSanitizedGameRooms());
    socket.emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, null);
    socket.onAny(() => {
      if (!server.connectedSockets[socket.id]) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.SOCKET_NOT_REGISTERED);
    });
    chatListeners(server, socket);
    lobbyUiListeners(server, socket);
    battleRoomGameListeners(socket, serverState);

    socket.on("disconnect", () => server.handleSocketDisconnection(socket));
  });
}
