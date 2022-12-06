import { Server, Socket } from "socket.io";
import ServerState from "../../interfaces/ServerState";
import removeSocketFromChatChannel from "./removeSocketFromChatChannel";
import { SocketEventsFromServer, ChatChannel, ChatMessage, ChatMessageStyles } from "../../../../common";
import updateRoomUsernameList from "./updateChatChannelUsernameList";
import sanitizeChatChannelForClient from "../../utils/sanitizeChatChannelForClient";

// @ old delete

export default function clientRequestsToJoinChatChannel(
  io: Server,
  socket: Socket,
  serverState: ServerState,
  channelName: string | null,
  authorizedForGameChannel?: boolean
) {
  console.log("sending socket " + socket.id + " to channel " + channelName);
  const { connectedSockets, chatChannels } = serverState;
  if (!socket || !connectedSockets[socket.id]) return;
  let channelName_lc = channelName;
  if (!channelName) channelName_lc = "the void";
  channelName_lc = channelName_lc!.toLowerCase();
  if (channelName_lc.slice(0, 5) === "game-" && !authorizedForGameChannel)
    return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, `Channels prefixed with "game-" are reserved for that game's players`);

  removeSocketFromChatChannel(io, socket, serverState);
  socket.join(channelName_lc);
  connectedSockets[socket.id].currentChatChannel = channelName_lc;
  if (!chatChannels[channelName_lc]) chatChannels[channelName_lc] = new ChatChannel(channelName_lc);
  updateRoomUsernameList(socket, serverState, undefined, channelName_lc);
  io.in(channelName_lc).emit(SocketEventsFromServer.CHAT_ROOM_UPDATE, sanitizeChatChannelForClient(chatChannels, channelName_lc));
  socket.emit(SocketEventsFromServer.NEW_CHAT_MESSAGE, new ChatMessage("Server", `Welcome to ${channelName_lc}.`, ChatMessageStyles.PRIVATE));
}
