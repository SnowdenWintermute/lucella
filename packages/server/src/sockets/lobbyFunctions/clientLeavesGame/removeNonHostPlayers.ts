import { Server } from "socket.io";
import { SocketMetadata } from "../../../../../common";
import ServerState from "../../../interfaces/ServerState";
import clientRequestsToJoinChatChannel from "../clientRequestsToJoinChatChannel";

export default function (io: Server, serverState: ServerState, players: { host: SocketMetadata | null; challenger: SocketMetadata | null }) {
  const { connectedSockets } = serverState;
  if (!players.challenger) return;
  let socketIdToRemove = players.challenger.socketId || "";
  if (!connectedSockets[socketIdToRemove]) return console.log("tried to remove a socket that is no longer in our list");
  connectedSockets[socketIdToRemove].currentGameName = null;
  const prevRoom = connectedSockets[socketIdToRemove].previousChatChannelName;
  const socketToRemove = io.sockets.sockets.get(socketIdToRemove);
  if (socketToRemove) clientRequestsToJoinChatChannel(io, socketToRemove, serverState, prevRoom);
  else console.log("tried to return a socket to a chat channel but no socket found");
}
