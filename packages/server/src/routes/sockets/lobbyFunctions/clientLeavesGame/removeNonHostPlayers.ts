import { Server } from "socket.io";
import SocketMetadata from "../../../../classes/SocketMetadata";
import ServerState from "../../../../interfaces/ServerState";
import clientRequestsToJoinChatChannel from "../clientRequestsToJoinChatChannel";

export default function (
  io: Server,
  serverState: ServerState,
  players: { host: SocketMetadata; challenger: SocketMetadata }
) {
  const { connectedSockets } = serverState;
  if (!players.challenger) return console.log("no other players to remove from host leaving");
  let socketIdToRemove = players.challenger.socketId;
  if (!connectedSockets[socketIdToRemove]) return console.log("tried to remove a socket that is no longer in our list");
  connectedSockets[socketIdToRemove].currentGameName = null;
  const prevRoom = connectedSockets[socketIdToRemove].previousChatChannelName;
  clientRequestsToJoinChatChannel(io, io.sockets.sockets[socketIdToRemove], serverState, prevRoom);
}
