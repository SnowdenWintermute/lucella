import clientRequestsToJoinChatChannel from "../clientRequestsToJoinChatChannel";
import generateGameRoomForClient from "../../../../utils/generateGameRoomForClient";
import sanitizeChatChannelForClient from "../../../../utils/sanitizeChatChannelForClient";
import handleHostLeavingGameSetup from "./handleHostLeavingGameSetup";
import handleChallengerLeavingGameSetup from "./handleChallengerLeavingGameSetup";
import handleDisconnectionFromGameSetup from "./handleDisconnectionFromGameSetup";
import { Server, Socket } from "socket.io";
import ServerState from "../../../../interfaces/ServerState";

export default function (
  io: Server,
  socket: Socket,
  serverState: ServerState,
  gameName: string,
  isDisconnecting: boolean | undefined
) {
  const { connectedSockets, chatChannels, gameRooms } = serverState;
  const username = connectedSockets[socket.id].associatedUser.username;
  const gameRoom = gameRooms[gameName];
  const { players } = gameRoom;
  if (isDisconnecting) handleDisconnectionFromGameSetup({ serverState, gameRoom });
  else {
    connectedSockets[socket.id].currentGameName = null;
    socket.emit("currentGameRoomUpdate", null);
    const prevRoom = connectedSockets[socket.id].previousChatChannelName;
    clientRequestsToJoinChatChannel(io, socket, serverState, prevRoom ? prevRoom : "the void");
  }
  if (players.host?.username === username) handleHostLeavingGameSetup({ serverState, gameName });
  else if (players.challenger?.username === username)
    handleChallengerLeavingGameSetup({ serverState, gameName, players });
  if (!players.host) {
    delete gameRooms[gameName];
    delete chatChannels[gameName];
  }

  io.in(`game-${gameName}`).emit("currentGameRoomUpdate", generateGameRoomForClient({ gameRoom }));
  io.in(`game-${gameName}`).emit(
    "updateChatRoom",
    sanitizeChatChannelForClient({
      chatChannels,
      roomName: `game-${gameName}`,
    })
  );
}
