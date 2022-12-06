import { SocketEventsFromClient } from "../../../../common";
import { Socket } from "socket.io";
import handleNewChatMessageFromClient from "../lobbyFunctions/handleNewChatMessageFromClient";
import { LucellaServer } from "../../classes/LucellaServer";

export default function chatListeners(server: LucellaServer, socket: Socket) {
  if (!socket) return;
  socket.on(SocketEventsFromClient.NEW_CHAT_MESSAGE, (data) => {
    handleNewChatMessageFromClient(server, socket, data);
  });
}

module.exports = chatListeners;
