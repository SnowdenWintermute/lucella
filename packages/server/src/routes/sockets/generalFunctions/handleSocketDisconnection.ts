import { Server, Socket } from "socket.io";

import removeSocketFromChatChannel from "../lobbyFunctions/removeSocketFromChatChannel";
import clientLeavesGame from "../lobbyFunctions/clientLeavesGame";
import ServerState from "../../../interfaces/ServerState";

export default function (io: Server, socket: Socket, serverState: ServerState, gameName: string) {
  console.log(socket.id + " disconnected");
  const { connectedSockets } = serverState;
  if (gameName) clientLeavesGame(io, socket, serverState, gameName, true);
  else removeSocketFromChatChannel(io, socket, serverState);

  delete connectedSockets[socket.id];
}
