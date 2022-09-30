import { Server, Socket } from "socket.io";
import ServerState from "../../interfaces/ServerState";
import clientSendsNewChat from "../lobbyFunctions/clientSendsNewChat";

export default function chatListeners(io: Server, socket: Socket, serverState: ServerState) {
  if (!socket) return;
  socket.on("clientSendsNewChat", (data) => {
    clientSendsNewChat(io, socket, serverState, data);
  });
}

module.exports = chatListeners;
