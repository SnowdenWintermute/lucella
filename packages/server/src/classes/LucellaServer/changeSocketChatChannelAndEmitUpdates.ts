import { ChatMessage, ChatMessageStyles, gameChannelNamePrefix, rankedGameChannelNamePrefix, SocketEventsFromServer, theVoid } from "@lucella/common";
import { Server, Socket } from "socket.io";
import { LucellaServer } from ".";
import { SocketMetadataList } from "../../types";
import { Lobby } from "../Lobby";

export default function changeSocketChatChannelAndEmitUpdates(
  lucellaServer: LucellaServer,
  socket: Socket,
  channelNameJoining: string | null,
  authorizedForGameChannel?: boolean
) {
  const { io, connectedSockets, lobby } = lucellaServer;
  if (!socket || !connectedSockets[socket.id]) return console.log("error handling change chat channel request - no socket registered with server");
  if (channelNameJoining) channelNameJoining = channelNameJoining.toLowerCase();

  const channelNameLeaving = connectedSockets[socket.id].currentChatChannel;
  lobby.updateChatChannelUsernameLists(connectedSockets[socket.id], channelNameLeaving, channelNameJoining);
  if (channelNameLeaving) {
    socket?.leave(channelNameLeaving);
    io.in(channelNameLeaving).emit(SocketEventsFromServer.CHAT_ROOM_UPDATE, lobby.getSanitizedChatChannel(channelNameLeaving));
  }

  if (channelNameJoining) {
    if (
      (channelNameJoining.slice(0, gameChannelNamePrefix.length) === rankedGameChannelNamePrefix ||
        channelNameJoining.slice(0, rankedGameChannelNamePrefix.length) === gameChannelNamePrefix) &&
      !authorizedForGameChannel
    )
      return socket.emit(
        SocketEventsFromServer.ERROR_MESSAGE,
        `Channels prefixed with "${gameChannelNamePrefix}" or "${rankedGameChannelNamePrefix}" are reserved for that game's players`
      );
    socket.join(channelNameJoining);
    io.in(channelNameJoining).emit(SocketEventsFromServer.CHAT_ROOM_UPDATE, lobby.getSanitizedChatChannel(channelNameJoining));
    connectedSockets[socket.id].previousChatChannelName = channelNameLeaving; // used for placing user back in their last chat channel after a game ends
    connectedSockets[socket.id].currentChatChannel = channelNameJoining;
    socket.emit(SocketEventsFromServer.NEW_CHAT_MESSAGE, new ChatMessage("Server", `Welcome to ${channelNameJoining}.`, ChatMessageStyles.PRIVATE));
  }
}
