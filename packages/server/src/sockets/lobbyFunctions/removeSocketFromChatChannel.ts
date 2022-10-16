import { SocketEventsFromServer } from "@lucella/common";
import { Server, Socket } from "socket.io";
import ServerState from "../../interfaces/ServerState";
import sanitizeChatChannelForClient from "../../utils/sanitizeChatChannelForClient";
import updateChatChannelUsernameList from "./updateChatChannelUsernameList";

export default function (io: Server, socket: Socket, serverState: ServerState) {
  const { connectedSockets, chatChannels } = serverState;
  if (!connectedSockets[socket.id].currentChatChannel) return;
  const nameOfChatChannelToLeave = connectedSockets[socket.id].currentChatChannel;
  if (!nameOfChatChannelToLeave) return;
  connectedSockets[socket.id].previousChatChannelName = nameOfChatChannelToLeave; // used for placing user back in their last chat channel after a game ends
  updateChatChannelUsernameList(socket, serverState, nameOfChatChannelToLeave, undefined);
  socket.leave(nameOfChatChannelToLeave);
  io.in(nameOfChatChannelToLeave).emit(
    SocketEventsFromServer.CHAT_ROOM_UPDATE,
    sanitizeChatChannelForClient(chatChannels, nameOfChatChannelToLeave)
  );
}
