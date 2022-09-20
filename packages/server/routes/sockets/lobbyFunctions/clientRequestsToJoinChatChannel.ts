import { Server, Socket } from "socket.io";
import ServerState from "../../../types/ServerState";
import generateRoomForClient from "../../../utils/generateRoomForClient";

import removeSocketFromChatChannel from "./removeSocketFromChatChannel";
import ChatMessage from "../../../classes/chat/ChatMessage";
import updateRoomUsernameList from "./updateRoomUsernameList";

export default function clientRequestsToJoinChatChannel(
  io: Server,
  socket: Socket,
  serverState: ServerState,
  roomName: string,
  authorizedForGameChannel?: boolean
) {
  const { connectedSockets, chatChannels } = serverState;
  if (!socket) return;
  if (!roomName) roomName = "the void";
  if (roomName.slice(0, 5) === "game-" && !authorizedForGameChannel)
    return socket.emit("errorMessage", `Channels prefixed with "game-" are reserved for that game's players`);

  removeSocketFromChatChannel(io, socket, serverState);
  socket.join(roomName);
  connectedSockets[socket.id].currentChatChannel = roomName;
  if (!chatChannels[roomName]) chatChannels[roomName] = { roomName, connectedUsers: {} };
  updateRoomUsernameList({ application, nameOfchatChannelToJoin: roomName });
  io.in(roomName).emit("updateChatRoom", generateRoomForClient({ chatChannels, roomName }));
  socket.emit(
    "newMessage",
    new ChatMessage({
      author: "Server",
      style: "private",
      messageText: `Welcome to ${roomName}.`,
    })
  );
}
