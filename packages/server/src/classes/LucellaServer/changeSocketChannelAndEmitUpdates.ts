import { ChatMessage, ChatMessageStyles, gameChannelNamePrefix, SocketEventsFromServer, SocketMetadata, theVoid } from "@lucella/common";
import { Server, Socket } from "socket.io";
import { SocketMetadataList } from "../../types";
import { LobbyManager } from "../LobbyManager";

export default function changeSocketChannelAndEmitUpdates(
  io: Server,
  connectedSockets: SocketMetadataList,
  lobbyManager: LobbyManager,
  socket: Socket,
  channelName: string,
  authorizedForGameChannel?: boolean
) {
  if (!channelName) return console.log("tried to change channels but got no channel name");
  if (!socket || !connectedSockets[socket.id]) return console.log("error handling join chat channel request - no socket registered");
  channelName = channelName.toLowerCase();
  if (channelName.slice(0, 5) === gameChannelNamePrefix && !authorizedForGameChannel)
    return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, `Channels prefixed with ${gameChannelNamePrefix} are reserved for that game's players`);

  const channelNameLeaving = connectedSockets[socket.id].currentChatChannel;
  lobbyManager.updateChatChannelUsernameLists(connectedSockets[socket.id], channelNameLeaving, channelName);

  if (channelNameLeaving) socket.leave(channelNameLeaving);
  socket.join(channelName);

  connectedSockets[socket.id].previousChatChannelName = channelNameLeaving || theVoid; // used for placing user back in their last chat channel after a game ends
  connectedSockets[socket.id].currentChatChannel = channelName;

  if (channelNameLeaving) io.in(channelNameLeaving).emit(SocketEventsFromServer.CHAT_ROOM_UPDATE, lobbyManager.getSanitizedChatChannel(channelNameLeaving));
  io.in(channelName).emit(SocketEventsFromServer.CHAT_ROOM_UPDATE, lobbyManager.getSanitizedChatChannel(channelName));
  socket.emit(SocketEventsFromServer.NEW_CHAT_MESSAGE, new ChatMessage("Server", `Welcome to ${channelName}.`, ChatMessageStyles.PRIVATE));
}
