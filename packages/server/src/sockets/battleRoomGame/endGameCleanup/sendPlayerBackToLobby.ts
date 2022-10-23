import { SocketMetadata } from "../../../../../common";
import { Server } from "socket.io";
import ServerState from "../../../interfaces/ServerState";
import clientRequestsToJoinChatChannel from "../../lobbyFunctions/clientRequestsToJoinChatChannel";

export default function (
  io: Server,
  serverState: ServerState,
  socketId: string | undefined,
  player: SocketMetadata | null
) {
  if (!player) return new Error("tried to send player back to lobby but no player found");
  if (!socketId) return new Error("tried to send player back to lobby but no sockedId found");
  console.log("sending player back to lobby: ", player);
  const { connectedSockets } = serverState;
  player.currentGameName = null;
  const socketToSend = io.sockets.sockets.get(socketId);
  if (socketToSend)
    clientRequestsToJoinChatChannel(io, socketToSend, serverState, connectedSockets[socketId].previousChatChannelName);
  else throw new Error("tried to send player back to lobby but their socket id wasn't registered with the io server");
}
