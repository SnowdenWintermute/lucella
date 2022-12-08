import { ChatMessage, ChatMessageStyles, gameChannelNamePrefix, SocketEventsFromServer, theVoid } from "@lucella/common";
import { Server, Socket } from "socket.io";
import { LucellaServer } from ".";
import { SocketMetadataList } from "../../types";
import { LobbyManager } from "../LobbyManager";

export default function changeSocketChatChannelAndEmitUpdates(
  lucellaServer: LucellaServer,
  socket: Socket,
  channelNameJoining: string | null,
  authorizedForGameChannel?: boolean
) {
  const { io, connectedSockets, lobbyManager } = lucellaServer;
  if (!socket || !connectedSockets[socket.id]) return console.log("error handling change chat channel request - no socket registered with server");
  if (channelNameJoining) channelNameJoining = channelNameJoining.toLowerCase();

  const channelNameLeaving = connectedSockets[socket.id].currentChatChannel;
  lobbyManager.updateChatChannelUsernameLists(connectedSockets[socket.id], channelNameLeaving, channelNameJoining);
  if (channelNameLeaving) {
    socket?.leave(channelNameLeaving);
    io.in(channelNameLeaving).emit(SocketEventsFromServer.CHAT_ROOM_UPDATE, lobbyManager.getSanitizedChatChannel(channelNameLeaving));
  }

  if (channelNameJoining) {
    if (channelNameJoining.slice(0, 5) === gameChannelNamePrefix && !authorizedForGameChannel)
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, `Channels prefixed with ${gameChannelNamePrefix} are reserved for that game's players`);
    socket.join(channelNameJoining);
    io.in(channelNameJoining).emit(SocketEventsFromServer.CHAT_ROOM_UPDATE, lobbyManager.getSanitizedChatChannel(channelNameJoining));
    connectedSockets[socket.id].previousChatChannelName = channelNameLeaving; // used for placing user back in their last chat channel after a game ends
    connectedSockets[socket.id].currentChatChannel = channelNameJoining;
    socket.emit(SocketEventsFromServer.NEW_CHAT_MESSAGE, new ChatMessage("Server", `Welcome to ${channelNameJoining}.`, ChatMessageStyles.PRIVATE));
  }
}
