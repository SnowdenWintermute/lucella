import { SocketEventsFromClient } from "../../../../common";
import { Server, Socket } from "socket.io";
import ServerState from "../../interfaces/ServerState";
import handleNewChatMessageFromClient from "../lobbyFunctions/handleNewChatMessageFromClient";

export default function chatListeners(io: Server, socket: Socket, serverState: ServerState) {
  if (!socket) return;
  socket.on(SocketEventsFromClient.NEW_CHAT_MESSAGE, (data) => {
    handleNewChatMessageFromClient(io, socket, serverState, data);
  });
}

module.exports = chatListeners;
