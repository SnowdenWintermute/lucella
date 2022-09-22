import { Server } from "socket.io";
import SocketMetadata from "../../../../classes/SocketMetadata";
import ServerState from "../../../../interfaces/ServerState";
import clientRequestsToJoinChatChannel from "../../lobbyFunctions/clientRequestsToJoinChatChannel";

export default function (
  io: Server,
  serverState: ServerState,
  socketId: string | undefined,
  player: SocketMetadata | null
) {
  if (!player) return new Error("tried to send player back to lobby but no player found");
  if (!socketId) return new Error("tried to send player back to lobby but no sockedId found");
  const { connectedSockets } = serverState;
  player.currentGameName = null;
  clientRequestsToJoinChatChannel(
    io,
    io.sockets.sockets[socketId],
    serverState,
    connectedSockets[socketId].previousChatChannelName
  );
}
