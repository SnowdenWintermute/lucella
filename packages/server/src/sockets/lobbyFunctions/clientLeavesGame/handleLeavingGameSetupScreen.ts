import clientRequestsToJoinChatChannel from "../clientRequestsToJoinChatChannel";
import sanitizeChatChannelForClient from "../../../utils/sanitizeChatChannelForClient";
import handleHostLeavingGameSetup from "./handleHostLeavingGameSetup";
import handleChallengerLeavingGameSetup from "./handleChallengerLeavingGameSetup";
import handleDisconnectionFromGameSetup from "./handleDisconnectionFromGameSetup";
import { Server, Socket } from "socket.io";
import ServerState from "../../../interfaces/ServerState";
import sanitizeGameRoomForClient from "../../../utils/sanitizeGameRoomForClient";
import { SocketEventsFromServer } from "../../../../../common";

export default function (io: Server, socket: Socket, serverState: ServerState, gameName: string, isDisconnecting: boolean | undefined) {
  const { connectedSockets, chatChannels, gameRooms } = serverState;
  const username = connectedSockets[socket.id].associatedUser.username;
  const gameRoom = gameRooms[gameName];
  const { players } = gameRoom;
  if (isDisconnecting) handleDisconnectionFromGameSetup(io, socket, serverState, gameRoom);
  else {
    connectedSockets[socket.id].currentGameName = null;
    socket.emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, null);
    const prevRoom = connectedSockets[socket.id].previousChatChannelName;
    clientRequestsToJoinChatChannel(io, socket, serverState, prevRoom ? prevRoom : "the void");
  }
  if (players.host?.associatedUser.username === username) handleHostLeavingGameSetup(io, serverState, gameName);
  else if (players.challenger?.associatedUser.username === username) handleChallengerLeavingGameSetup(io, socket, serverState, gameName, players);
  if (!players.host) {
    delete gameRooms[gameName];
    delete chatChannels[gameName];
  }

  io.in(`game-${gameName}`).emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, sanitizeGameRoomForClient(gameRoom));
  io.in(`game-${gameName}`).emit(SocketEventsFromServer.CHAT_ROOM_UPDATE, sanitizeChatChannelForClient(chatChannels, `game-${gameName}`));
}
