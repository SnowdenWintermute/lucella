import { Server, Socket } from "socket.io";
import removeSocketFromChatChannel from "../lobbyFunctions/removeSocketFromChatChannel";
import clientLeavesGame from "../lobbyFunctions/clientLeavesGame";
import ServerState from "../../interfaces/ServerState";

export default function (io: Server, socket: Socket, serverState: ServerState, gameName?: string) {
  console.log(socket.id + " disconnected");
  const { connectedSockets } = serverState;
  const { currentGameName } = serverState.connectedSockets[socket.id];
  if (currentGameName) clientLeavesGame(io, socket, serverState, true);
  else removeSocketFromChatChannel(io, socket, serverState);

  delete connectedSockets[socket.id];
}
