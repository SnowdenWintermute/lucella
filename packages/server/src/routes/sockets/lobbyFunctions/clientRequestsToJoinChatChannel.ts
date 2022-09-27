import { Server, Socket } from "socket.io";
import ServerState from "../../../interfaces/ServerState";
import removeSocketFromChatChannel from "./removeSocketFromChatChannel";
import { ChatMessage, ChatMessageStyles } from "../../../../../common";
import updateRoomUsernameList from "./updateChatChannelUsernameList";
import sanitizeChatChannelForClient from "../../../utils/sanitizeChatChannelForClient";
import { ChatChannel } from "@lucella/common";

export default function clientRequestsToJoinChatChannel(
  io: Server,
  socket: Socket,
  serverState: ServerState,
  channelName: string | null,
  authorizedForGameChannel?: boolean
) {
  const { connectedSockets, chatChannels } = serverState;
  if (!socket) return;
  if (!channelName) channelName = "the void";
  if (channelName.slice(0, 5) === "game-" && !authorizedForGameChannel)
    return socket.emit("errorMessage", `Channels prefixed with "game-" are reserved for that game's players`);

  removeSocketFromChatChannel(io, socket, serverState);
  socket.join(channelName);
  connectedSockets[socket.id].currentChatChannel = channelName;
  if (!chatChannels[channelName]) chatChannels[channelName] = new ChatChannel(channelName);
  updateRoomUsernameList(socket, serverState, undefined, channelName);
  io.in(channelName).emit("updateChatRoom", sanitizeChatChannelForClient(chatChannels, channelName));
  socket.emit("newMessage", new ChatMessage("Server", `Welcome to ${channelName}.`, ChatMessageStyles.PRIVATE));
}
