import { Server, Socket } from "socket.io";
import ServerState from "../../interfaces/ServerState";
import removeSocketFromChatChannel from "./removeSocketFromChatChannel";
import { SocketEventsFromServer, ChatChannel, ChatMessage, ChatMessageStyles } from "../../../../common";
import updateRoomUsernameList from "./updateChatChannelUsernameList";
import sanitizeChatChannelForClient from "../../utils/sanitizeChatChannelForClient";

export default function clientRequestsToJoinChatChannel(
  io: Server,
  socket: Socket,
  serverState: ServerState,
  channelName: string | null,
  authorizedForGameChannel?: boolean
) {
  const { connectedSockets, chatChannels } = serverState;
  if (!socket || !connectedSockets[socket.id]) return;
  if (!channelName) channelName = "the void";
  if (channelName.slice(0, 5) === "game-" && !authorizedForGameChannel)
    return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, `Channels prefixed with "game-" are reserved for that game's players`);

  removeSocketFromChatChannel(io, socket, serverState);
  socket.join(channelName);
  connectedSockets[socket.id].currentChatChannel = channelName;
  if (!chatChannels[channelName]) chatChannels[channelName] = new ChatChannel(channelName);
  updateRoomUsernameList(socket, serverState, undefined, channelName);
  io.in(channelName).emit(SocketEventsFromServer.CHAT_ROOM_UPDATE, sanitizeChatChannelForClient(chatChannels, channelName));
  socket.emit(SocketEventsFromServer.NEW_CHAT_MESSAGE, new ChatMessage("Server", `Welcome to ${channelName}.`, ChatMessageStyles.PRIVATE));
}
