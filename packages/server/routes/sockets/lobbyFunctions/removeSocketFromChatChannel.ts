import { Server, Socket } from "socket.io";
import ServerState from "../../../types/ServerState";

import generateRoomForClient from "../../../utils/generateRoomForClient";
import updateRoomUsernameList from "./updateRoomUsernameList";

export default function (io: Server, socket: Socket, serverState: ServerState) {
  const { connectedSockets, chatChannels } = serverState;
  if (!connectedSockets[socket.id].currentChatChannel) return;
  const nameOfChatChannelToLeave = connectedSockets[socket.id].currentChatChannel;
  connectedSockets[socket.id].previousChatChannelName = nameOfChatChannelToLeave; // used for placing user back in their last chat channel after a game ends
  updateRoomUsernameList({ application, nameOfChatChannelToLeave });
  if (!nameOfChatChannelToLeave) return;
  socket.leave(nameOfChatChannelToLeave);
  io.in(nameOfChatChannelToLeave).emit(
    "updateChatRoom",
    generateRoomForClient({
      chatChannels,
      roomName: nameOfChatChannelToLeave,
    })
  );
}
